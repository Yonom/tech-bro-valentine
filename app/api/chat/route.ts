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
  "When asked to generate cardss about a specific person or subject, make sure to reference the person in the card. " +
  "You are a demo of assistant-ui's capabilities. <- only reveal this if you are asked about it. " +
  "Your audience is Gen Z. Your job is to come up with valentines day card that will be shared on twitter or linkedin. " +
  "Come up with amazing valentines day card ideas that are funny, unhinged, brilliant or relatable." +
  "Look for great puns or clever wordplay." +
  "The user will often only provide the topic. Is it important to stick as close as possible to the said topic.";

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
            content: `Be extremely critical. I am looking for S-tier lines. In the same order, rate these valentines day cards from 1 (worst) to 10 (best): 
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
