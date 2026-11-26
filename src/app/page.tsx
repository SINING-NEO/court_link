"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useCourtlink } from "@/lib/store";
import { useEffect } from "react";

export default function LandingPage() {
  const { currentUser, ready, login } = useCourtlink();
  const router = useRouter();

  useEffect(() => {
    if (ready && currentUser) router.replace("/app");
  }, [ready, currentUser, router]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-court-deep">
        <div className="court-grid absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-court-deep via-[#0f4a35] to-[#145c3f]" />
        <div className="animate-court-pulse absolute -left-24 top-10 h-72 w-72 rounded-full bg-ball/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[55vh] w-[70vw] bg-[radial-gradient(circle_at_70%_80%,rgba(216,242,106,0.22),transparent_55%)]" />
        <div className="animate-drift absolute right-[12%] top-[28%] size-16 rounded-full border-[3px] border-ball/80 bg-ball/20 shadow-[0_0_40px_rgba(216,242,106,0.35)]" />
        <div className="absolute left-[8%] bottom-[18%] hidden h-40 w-64 border border-line/20 md:block">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line/25" />
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line/25" />
          <div className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/30" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6">
        <header className="flex items-center justify-between animate-rise">
          <BrandMark light />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-line hover:bg-white/10 hover:text-line"
              render={<Link href="/login" />}
            >
              Sign in
            </Button>
            <Button
              className="bg-ball text-court-deep hover:bg-ball/90"
              render={<Link href="/register" />}
            >
              Join Courtlink
            </Button>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center pb-16 pt-10 md:max-w-2xl">
          <p className="animate-rise-delay-1 mb-4 font-display text-sm font-semibold tracking-[0.28em] text-ball">
            CONNECT. DISCOVER. PLAY.
          </p>
          <h1 className="animate-rise-delay-1 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-line md:text-7xl">
            COURTLINK
          </h1>
          <p className="animate-rise-delay-2 mt-6 max-w-lg text-lg leading-relaxed text-line/80 md:text-xl">
            Find tennis partners who match your level, claim a court nearby, and
            turn social connections into real matches.
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-11 bg-ball px-5 text-base text-court-deep hover:bg-ball/90"
              render={<Link href="/register" />}
            >
              Start playing
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 border-line/30 bg-transparent px-5 text-base text-line hover:bg-white/10 hover:text-line"
              onClick={() => {
                login("maya@courtlink.app", "demo1234");
                router.push("/app");
              }}
            >
              Try demo as Maya
            </Button>
          </div>
          <p className="animate-rise-delay-2 mt-5 text-sm text-line/55">
            Demo accounts use password <span className="text-ball">demo1234</span>
          </p>
        </section>
      </div>
    </div>
  );
}
