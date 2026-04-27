import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../db/supabase";

export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;

      if (!userId) {
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);
}
