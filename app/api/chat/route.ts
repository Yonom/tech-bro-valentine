import { openai } from "@ai-sdk/openai";
import { createDataStreamResponse, streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const brainstormValentineDayCards = tool({
  parameters: z.object({
    ideas: z.array(z.string()).max(7),
  }),
  execute: async () => {
    return {};
  },
});

const system =
  "You are a tech bro valentines day card generator. " +
  "Your name is 'assistant-ui's Tech Bro Valentines Card Generator'. " +
  "Your audience is Gen Z. Your job is to come up with valentines day card that will be shared on twitter or linkedin. " +
  "Come up with amazing valentines day card ideas that are funny, unhinged, brilliant or relatable." +
  "Look for great puns or clever wordplay. The smoother, the more elegant, the better. " +
  "The user will often only provide the topic. Stick as close as possible to the said topic, do not deviate into related similar topics.." +
  "When mentioning public figures, assume that the person is NOT the subject of the card.";

export async function POST(req: Request) {
  const { messages } = await req.json();

  return createDataStreamResponse({
    execute: async (writer) => {
      const result = streamText({
        model: openai("gpt-4o-mini"),
        system,
        messages,
        temperature: 0.4,
        toolCallStreaming: true,
        tools: {
          brainstormValentineDayCards,
        },
        maxTokens: 2000,
        maxSteps: 1,
      });

      result.mergeIntoDataStream(writer);

      const res = await result.toolCalls;
      const ideas = res
        .filter((t) => t.toolName === "brainstormValentineDayCards")
        .flatMap((t) => t.args.ideas);

      const result2 = streamText({
        model: openai("gpt-4o-mini"),
        system,
        messages: [
          ...messages,
          {
            role: "user",
            content: `Be extremely critical. In the same order, rate these valentines day cards from 1 (worst) to 10 (best): 
${ideas.map((i) => `\n- ${i}`)}.`,
          },
        ],
        tools: {
          rating: tool({
            parameters: z.object({
              ratings: z.number().min(1).max(10).array(),
            }),
          }),
        },
        toolChoice: {
          type: "tool",
          toolName: "rating",
        },
      });
      result2.consumeStream();

      const ratings =
        (await result2.toolCalls).find((t) => t.toolName === "rating")?.args
          .ratings ?? [];

      for (let i = 0; i < ideas.length; i++) {
        writer.writeData({
          type: "rating",
          ideaIdx: i,
          rating: ratings[i] ?? 5,
        });
      }
    },
  });
}
