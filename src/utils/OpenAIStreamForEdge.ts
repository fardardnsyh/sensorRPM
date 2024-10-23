import { createParser, ParseEvent } from "eventsource-parser";

// From https://github.com/Nutlope/twitterbio/blob/main/utils/OpenAIStream.ts
export async function OpenAIStream(response: Response) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      // callback
      const onParse = (event: ParseEvent) => {
        if (event.type === "event") {
          const data = event.data;
          controller.enqueue(encoder.encode(data));
        }
      };

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);
      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of response.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  let counter = 0;
  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      const data = decoder.decode(chunk);
      // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
      if (data === "[DONE]") {
        controller.terminate();
        return;
      }
      try {
        const json = JSON.parse(data);
        const text = json.choices[0].delta?.content || "";
        if (counter < 2 && (text.match(/\n/) || []).length) {
          // this is a prefix character (i.e., "\n\n"), do nothing
          return;
        }
        // stream transformed JSON resposne as SSE
        const payload = { text: text };
        // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
        );
        counter++;
      } catch (e) {
        // maybe parse error
        controller.error(e);
      }
    },
  });

  return readableStream.pipeThrough(transformStream);
}
