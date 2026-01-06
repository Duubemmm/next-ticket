// app/login/page.tsx
"use client";

import { useAuth } from "@/app/lib/authContext";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // SIMULATION: In a real app, you'd fetch an API here.
    login({ email, name: "New User", token: "fake-jwt-123" });
  };

  return (
    <div className="flex flex-col items-center p-24">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="email" 
          placeholder="Email" 
          className="border p-2 text-black"
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input type="password" placeholder="Password" className="border p-2 text-black" required />
        <button className="bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}