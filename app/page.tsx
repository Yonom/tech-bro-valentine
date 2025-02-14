"use client";
import { Thread } from "@/components/assistant-ui/thread";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import {
  AssistantRuntimeProvider,
  makeAssistantToolUI,
  ToolCallContentPart,
  useContentPart,
  useMessage,
} from "@assistant-ui/react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ValentineCard from "@/components/valentine-card";

type BrainstormValentineDayCardsArgs = {
  ideas: string[];
};

type DataValue = {
  readonly type: "rating";
  readonly ideaIdx: number;
  readonly rating: number;
};

const useValentinesDayCardsState = () => {
  const data = useMessage(
    (m) => (m.metadata.unstable_data ?? []) as DataValue[]
  );
  const part = useContentPart((t) => {
    if (t.type !== "tool-call" || t.toolName !== "brainstormValentineDayCards")
      throw new Error("Unexpected tool call");

    return t as unknown as ToolCallContentPart<
      BrainstormValentineDayCardsArgs,
      object
    >;
  });

  return useMemo(() => {
    const { ideas = [] } = part.args;
    const ratings = data.filter((d) => d.type === "rating");
    const ideasWithRatings = ideas.map((idea, idx) => {
      const rating = ratings.find((r) => r.ideaIdx === idx)?.rating;
      return { idea, rating };
    });
    return { ideas: ideasWithRatings, hasRatings: ratings.length > 0 };
  }, [part, data]);
};

const BrainstormValentineDayCardsUI = makeAssistantToolUI<
  BrainstormValentineDayCardsArgs,
  object
>({
  toolName: "brainstormValentineDayCards",
  render: function BrainstormValentineDayCardsRender() {
    const { ideas, hasRatings } = useValentinesDayCardsState();
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valentine Cards</CardTitle>
        </CardHeader>
        <CardContent className="flex overflow-x-scroll gap-4">
          {!hasRatings && (
            <ul>
              {ideas.map(({ idea }, idx) => (
                <li key={idx}>{idea}</li>
              ))}
            </ul>
          )}
          {hasRatings &&
            ideas
              .sort((a, b) => b.rating! - a.rating!)
              .map(({ idea }, idx) => <ValentineCard key={idx} text={idea} />)}
        </CardContent>
      </Card>
    );
  },
});

export default function Home() {
  const runtime = useChatRuntime({
    api: "/api/chat",
    unstable_humanToolNames: ["brainstormValentineDayCards"],
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <main className="h-dvh flex-col flex">
        <Thread />
      </main>
      <BrainstormValentineDayCardsUI />
      {/* <ValentineCard text="You're the only one who can make my heart go 'covfefe'! 💖" /> */}
    </AssistantRuntimeProvider>
  );
}
