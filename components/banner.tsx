"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, LightbulbIcon, X } from "lucide-react";
import { useState } from "react";

export default function Banner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="dark bg-muted px-4 py-3 text-foreground w-full">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <LightbulbIcon
            className="mt-0.5 shrink-0 opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <div className="flex grow flex-col justify-between gap-2 md:flex-row">
            <p className="text-sm">
              Build AI chatbots like this one with{" "}
              <a href="https://assistant-ui.com" className="font-bold">
                assistant-ui
              </a>
              . The open source Typescript/React library for AI chat.
            </p>
            <a
              href="https://github.com/assistant-ui/assistant-ui"
              className="group whitespace-nowrap text-sm font-medium"
            >
              View on GitHub
              <ArrowRight
                className="-mt-0.5 ms-1 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => setIsVisible(false)}
          aria-label="Close banner"
        >
          <X
            size={16}
            strokeWidth={2}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}
