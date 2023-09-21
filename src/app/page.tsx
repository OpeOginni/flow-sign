"use client";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";

import SignInButton from "@/components/signInButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <Link href={"/api/auth/signin"}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          SignUp / Login
        </button>
      </Link> */}
      <SignInButton />
    </main>
  );
}
