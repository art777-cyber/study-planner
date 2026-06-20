"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Test() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Test Page</h1>

      {user ? (
        <p>Logged in: {user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}