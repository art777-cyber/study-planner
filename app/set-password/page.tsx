"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  async function handleSetPassword() {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password set successfully!");
    router.push("/home");
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Create Password</h1>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSetPassword}>
        Set Password
      </button>
    </div>
  );
}