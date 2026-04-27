import { useEffect, useState } from "react";
import { getPersonas } from "../../api/MainPage";
import { supabase } from "../../db/supabase";
import { Persona } from "../../types/Persona/Persona";

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;

      if (!userId) return;

      getPersonas(userId)
        .then(setPersonas)
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    init();
  }, []);

  return { personas, loading };
}
