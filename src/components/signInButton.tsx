"use client";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <div>
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        SignUp / Login
      </button>
    </div>
  );
}
