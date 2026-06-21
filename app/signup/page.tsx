"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");

  async function handleSignup() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000/set-password",
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Check your email for the link!");
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Sign Up</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSignup}>
        Send Verification Email
      </button>
    </div>
  );
}