"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        router.replace("/home");
      }
    }

    checkUser();
  }, [router]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1>Study Planner</h1>

      <br />

      <Link href="/login">
        <button>Login</button>
      </Link>

      <br />
      <br />

      <Link href="/signup">
        <button>Sign Up</button>
      </Link>
    </div>
  );
}