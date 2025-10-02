import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (!error && data) {
        setRoles(data.map((r) => r.role));
      }
      setLoading(false);
    };

    fetchRoles();
  }, [user]);

  const isAdmin = roles.includes("admin");
  const isEditor = roles.includes("editor") || isAdmin;
  const isUser = roles.length > 0;

  return { roles, isAdmin, isEditor, isUser, loading };
};
