import type { UserInfo } from "@/inputs";
import { OpenAIStream } from "@/utils/OpenAIStreamForEdge";
import fetchOpenAIAPI from "@/utils/fetchOpenAIAPI";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request): Promise<Response | void> {
  const { userInfo, apiKey } = (await req.json()) as {
    userInfo: UserInfo;
    apiKey?: string;
  };

  try {
    const response = await fetchOpenAIAPI(userInfo, apiKey);

    const stream = await OpenAIStream(response);
    return new Response(stream, {
      headers: new Headers({
        "Cache-Control": "no-cache",
      }),
    });
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
