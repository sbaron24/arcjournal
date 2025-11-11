import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const usePreferences = () => {
  const { user } = useAuth();
  const [preferredLayout, setPreferredLayout] = useState<"A" | "B">("A");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) {
      setPreferredLayout("A");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("reflection_layout")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is fine for new users
        console.error("Error fetching preferences:", error);
      }

      if (data?.reflection_layout) {
        setPreferredLayout(data.reflection_layout as "A" | "B");
      } else {
        // Default to 'A' if no preferences found
        setPreferredLayout("A");
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      setPreferredLayout("A");
    } finally {
      setLoading(false);
    }
  };

  const updateLayout = async (layout: "A" | "B") => {
    if (!user) return { error: new Error("User not authenticated") };

    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert(
          {
            user_id: user.id,
            reflection_layout: layout,
          },
          {
            onConflict: "user_id",
          }
        );

      if (error) throw error;

      setPreferredLayout(layout);
      return { error: null };
    } catch (error) {
      console.error("Error updating preferences:", error);
      return { error: error as Error };
    }
  };

  return {
    preferredLayout,
    updateLayout,
    loading,
    refetch: fetchPreferences,
  };
};

