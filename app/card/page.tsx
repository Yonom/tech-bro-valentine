import { Metadata } from "next";
import CardPageClient from "./page.client";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ text?: string }>;
}): Promise<Metadata> {
  const text = (await searchParams).text ?? "Happy Valentine's Day!";
  const ogImageUrl = `/api/og?text=${encodeURIComponent(text)}`;

  return {
    title: "Your Valentine's Card",
    description: "A special Valentine's card just for you!",
    openGraph: {
      title: "Your Valentine's Card",
      description: "A special Valentine's card just for you!",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Your Valentine's Card",
      description: "A special Valentine's card just for you!",
      images: [ogImageUrl],
    },
  };
}

export default function CardPage() {
  return <CardPageClient />;
}
