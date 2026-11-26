"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCourtlink } from "@/lib/store";

export default function LoginPage() {
  const { login } = useCourtlink();
  const router = useRouter();
  const [email, setEmail] = useState("maya@courtlink.app");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err = login(email, password);
    if (err) {
      setError(err);
      return;
    }
    router.push("/app");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <BrandMark className="mb-8" />
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Welcome back
      </h1>
      <p className="mt-2 text-muted-foreground">
        Sign in to your Courtlink account and pick up where you left off.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        Demo: maya@courtlink.app / demo1234
      </p>
    </div>
  );
}
