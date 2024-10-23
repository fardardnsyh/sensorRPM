import type { UserInfo } from "@/inputs";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAIStream from "@/utils/OpenAIStreamForServerless";
import fetchOpenAIAPI from "@/utils/fetchOpenAIAPI";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Response | void> {
  const { userInfo, apiKey } = req.body as {
    userInfo: UserInfo;
    apiKey?: string;
  };

  try {
    const response = await fetchOpenAIAPI(userInfo, apiKey);

    await OpenAIStream(response, res);
  } catch (err) {
    // If the error accure while straming response
    res.end();

    if (err instanceof Response) {
      return err;
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
