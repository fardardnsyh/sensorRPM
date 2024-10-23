import { ParseEvent, createParser } from "eventsource-parser";
import { NextApiResponse } from "next";

const OpenAIStream = async (
  openAIResponse: Response,
  serverResponse: NextApiResponse
) => {
  const encoder = new TextEncoder();

  const onParse = (event: ParseEvent) => {
    if (event.type === "event") {
      const data = event.data;

      // OpenAi docs: Stream terminated by a `data: [DONE]` message.
      // https://platform.openai.com/docs/api-reference/completions/create#completions/create-stream
      if (data === "[DONE]") {
        return serverResponse.end();
      }

      const text = JSON.parse(data).choices[0].delta?.content ?? "";
      // To follow a standard format and to work properly with eventsource-parser package, I added (`data: `, `\n\n`)
      // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format
      serverResponse.write(
        encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
      );
    }
  };

  const decoder = new TextDecoder();
  const parser = createParser(onParse);

  for await (const chunk of openAIResponse.body as any) {
    parser.feed(decoder.decode(chunk));
  }
};

export default OpenAIStream;
