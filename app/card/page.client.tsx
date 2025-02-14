"use client";

import { Button } from "@/components/ui/button";
import ValentineCard from "@/components/valentine-card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CardPageClient() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text");

  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <div>
        <p className="text-3xl text-center mb-4">
          You received a valentines card
        </p>
        <ValentineCard text={text ?? "???"} />

        <div className="text-xl mt-10 items-center flex flex-col gap-4">
          <p>Create a new card with AI</p>
          <Button variant="secondary" asChild>
            <Link href="/">Create!</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
