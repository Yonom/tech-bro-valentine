import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get("text") ?? "Happy Valentine's Day!";

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

  const colorClass = CARDCOLORS[text.length % CARDCOLORS.length];

  // Map Tailwind classes to inline styles
  const tailwindToInline: { [key: string]: string } = {
    "bg-red-900": "#7f1d1d",
    "bg-blue-900": "#1e3a8a",
    "bg-green-900": "#14532d",
    "bg-purple-900": "#581c87",
    "bg-pink-900": "#831843",
    "bg-rose-900": "#881337",
    "bg-fuchsia-900": "#701a75",
    "bg-indigo-900": "#312e81",
    "bg-red-700": "#b91c1c",
    "bg-blue-700": "#1e40af",
    "bg-green-700": "#15803d",
    "bg-purple-700": "#7e22ce",
    "bg-pink-700": "#9d174d",
    "bg-rose-700": "#9f1239",
    "bg-fuchsia-700": "#a21caf",
    "bg-indigo-700": "#4338ca",
    "bg-red-950": "#450a0a",
    "bg-blue-950": "#172554",
    "bg-green-950": "#052e16",
    "bg-purple-950": "#3b0764",
    "bg-pink-950": "#500724",
    "bg-rose-950": "#4c0519",
    "bg-fuchsia-950": "#4a044e",
    "bg-indigo-950": "#1e1b4b",
  };

  // Load the Comic Neue font
  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "ComicNeue-Bold.ttf"
  );
  const fontData = await fs.promises.readFile(fontPath);

  // Load a monospace font (e.g., Roboto Mono)
  const monoFontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "RobotoMono-Regular.ttf"
  );
  const monoFontData = await fs.promises.readFile(monoFontPath);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: tailwindToInline[colorClass],
          color: "white",
          padding: "3.5rem 4rem",
          fontFamily: "Comic Neue",
        }}
      >
        <div
          style={{
            fontSize: "5.5rem",
            fontWeight: "bold",
            textAlign: "left",
            marginBottom: "1rem",
            maxWidth: "100%",
          }}
        >
          {text}
        </div>
        <div style={{ flexGrow: 1 }} />
        <div
          style={{
            fontSize: "4.5rem",
            fontWeight: "normal",
            alignSelf: "flex-start",
          }}
        >
          be my valentine?
        </div>
        <div
          style={{
            fontFamily: "Roboto Mono",
            fontSize: "1.5rem",
            alignSelf: "flex-end",
            marginTop: "2rem",
          }}
        >
          valentines.assistant-ui.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Comic Neue",
          data: fontData,
          style: "normal",
          weight: 700,
        },
        {
          name: "Roboto Mono",
          data: monoFontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
