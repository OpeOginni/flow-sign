"use client";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";

import SignInButton from "@/components/signInButton";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="grid grid-flow-row gap-7 p-8">
        <div>
          <h1 className="text-7xl text-center hover:text-[#02ed8b]">
            Welcome To FlowSign 📜
          </h1>
        </div>
        <div>
          <p className="text-xl text-center hover:text-[#ac2f63]">
            A Contract that makes Contracts Less Stressful
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-9 w-full items-center justify-center p-10">
        <div className="flex border-2 border-transparent text-center justify-center items-center bg-[#a7d7c5] text-[#ac2f63] h-80 w-[100%] hover:bg-[#ac2f63] hover:text-[#02ed8b]">
          <div>
            <h1 className="font-extrabold text-2xl">SIGN CONTRACTS ✍️</h1>
          </div>
        </div>

        <div className="flex border-2 border-transparent text-center justify-center items-center bg-[#a7d7c5] text-[#ac2f63] h-80 w-[100%] hover:bg-[#ac2f63] hover:text-[#02ed8b]">
          <h1 className="font-extrabold text-2xl">VALIDATE CONTRACTS ✅</h1>
        </div>

        <div className="flex border-2 border-transparent text-center justify-center items-center  bg-[#a7d7c5] text-[#ac2f63] h-80 w-[100%] hover:bg-[#ac2f63] hover:text-[#02ed8b]">
          <h1 className="font-extrabold text-2xl">STORE CONTRACTS 🗄</h1>
        </div>
      </div>

      <SignInButton />
    </main>
  );
}
