"use client";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <div className="p-7">
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        SignUp with Google
      </button>
    </div>
  );
}
