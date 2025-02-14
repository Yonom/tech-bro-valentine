"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Comic_Neue } from "next/font/google";
import { Button } from "@/components/ui/button";
import { DownloadIcon, LinkIcon, TwitterIcon } from "lucide-react";
import { domToPng } from "modern-screenshot";

export const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const CARDCOLORS = [
  "bg-red-900",
  "bg-blue-900",
  "bg-green-900",
  "bg-purple-900",
  "bg-pink-900",
  "bg-rose-900",
  "bg-fuchsia-900",
  "bg-indigo-900",
  "bg-red-700",
  "bg-blue-700",
  "bg-green-700",
  "bg-purple-700",
  "bg-pink-700",
  "bg-rose-700",
  "bg-fuchsia-700",
  "bg-indigo-700",
  "bg-red-950",
  "bg-blue-950",
  "bg-green-950",
  "bg-purple-950",
  "bg-pink-950",
  "bg-rose-950",
  "bg-fuchsia-950",
  "bg-indigo-950",
];

export default function ValentineCard({ text }: { text: string }) {
  const color = CARDCOLORS[text.length % CARDCOLORS.length];
  const [isCopied, setIsCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://valentines.assistant-ui.com/card?text=${encodeURIComponent(
        text
      )}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  const handleTweet = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `https://valentines.assistant-ui.com/card?text=${encodeURIComponent(
          text
        ).replaceAll("!", "%21")}`
      )}`
    );
  };

  const handleDownloadClick = async () => {
    if (!cardRef.current) return;
    const ref = cardRef.current;

    const hiddenElement = ref.querySelector(".screenshot-only");
    hiddenElement?.classList.remove("hidden");

    const dataUrl = await domToPng(ref, { scale: 3 });

    hiddenElement?.classList.add("hidden");

    const link = document.createElement("a");
    link.download = "card.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-w-[19rem] max-w-[24rem] bg-popover shadow-lg border flex flex-col rounded-[18px] overflow-clip mx-4">
      <Card
        className={`${color} border-0 text-white shadow-md ${comicNeue.className} flex-grow flex flex-col`}
        ref={cardRef}
      >
        <CardContent className="space-y-10 pt-6 flex-grow flex flex-col justify-between">
          <p className="text-xl font-bold">{text}</p>
          <p className="text-lg font-bold">be my valentine?</p>
        </CardContent>
        <CardFooter className="text-xs justify-end text-end font-mono screenshot-only hidden">
          valentines.assistant-ui.com
        </CardFooter>
      </Card>
      <div className="gap-2 p-2 flex justify-end">
        <Button variant="outline" onClick={handleTweet}>
          <TwitterIcon />
        </Button>
        <Button variant="outline" onClick={handleCopyLink}>
          {isCopied ? "Copied" : <LinkIcon />}
        </Button>
        <Button variant="outline" onClick={handleDownloadClick}>
          <DownloadIcon />
        </Button>
      </div>
    </div>
  );
}
