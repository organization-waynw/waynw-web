import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { STEP1_SESSION_KEY } from "../../constants/personaCreateStep1.constants";
import {
  PersonaFormData,
  SubInfo,
} from "../../types/Persona/personacreate1.types";

export function usePersonaForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PersonaFormData>({
    name: "",
    title: "",
    subInfos: [{ title: "", content: "" }],
    additionalInfo: "",
    autoGenerate: false,
    profileImage: null,
    profileImagePreview: null,
  });

  const isValid = formData.name.trim() && formData.title.trim();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/main");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleAddSubInfo = () => {
    setFormData((prev) => ({
      ...prev,
      subInfos: [...prev.subInfos, { title: "", content: "" }],
    }));
  };

  const handleRemoveSubInfo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subInfos: prev.subInfos.filter((_, i) => i !== index),
    }));
  };

  const handleSubInfoChange = (
    index: number,
    field: keyof SubInfo,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      subInfos: prev.subInfos.map((info, i) =>
        i === index ? { ...info, [field]: value } : info,
      ),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
        profileImagePreview: ev.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleToggleAutoGenerate = () => {
    setFormData((prev) => ({ ...prev, autoGenerate: !prev.autoGenerate }));
  };

  const handleFieldChange = (field: keyof PersonaFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    sessionStorage.setItem(
      STEP1_SESSION_KEY,
      JSON.stringify({ ...formData, profileImage: null }),
    );
    navigate("/persona/create/step2");
  };

  return {
    formData,
    isValid,
    fileInputRef,
    handleAddSubInfo,
    handleRemoveSubInfo,
    handleSubInfoChange,
    handleImageChange,
    handleToggleAutoGenerate,
    handleFieldChange,
    handleNext,
  };
}
