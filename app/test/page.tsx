"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function TestPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function login() {
    const email = prompt("Enter email:");

    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000/test",
      },
    });

    if (error) alert(error.message);
    else alert("Check your email!");
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Test Page</h1>

      {user ? (
        <p>Logged in: {user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}

      <button onClick={login} style={{ marginTop: "20px" }}>
        Login with Email
      </button>
    </div>
  );
}