import { UserInfo } from "@/inputs";

interface ChatGPTMessage {
  role: "user" | "system";
  content: string;
}

interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

const fetchOpenAIAPI = async (
  userInfo: UserInfo,
  API_KEY: string | undefined
) => {
  const OPENAI_API_KEY = API_KEY || process.env.OPENAI_KEY;

  if (!OPENAI_API_KEY) {
    throw new Response("Missing OPENAI_API_KEY", { status: 400 });
  }

  if (
    !userInfo ||
    !userInfo.candidateFullName ||
    !userInfo.jobTitle ||
    !userInfo.companyName ||
    !userInfo.releventSkills
  ) {
    throw new Response(
      "Missing userInfo object or one of the required fields",
      { status: 400 }
    );
  }

  const prompt = `You are an AI Cover Letter Email Generator. Your task is to generate a concise, professional, and engaging cover letter email that is customized to reflect the candidate's suitability for the role and company. Use the following details to create the cover letter:
  - Candidate's Full Name: ${userInfo.candidateFullName}.
  - Position Being Applied For: ${userInfo.jobTitle}.
  - Company Name: ${userInfo.companyName}
  - Key Skills Relevant to the Job: ${userInfo.releventSkills}.
  - Notable Achievements or Relevant Experience: ${
    userInfo.achievementsOrExperience
  }.
  - Recipient's Name (if knwon or general): ${
    userInfo.hiringManagerName ?? ""
  }${
    userInfo.whyThisRole
      ? `\n- Reasons for Interest in this Role or Company: ${userInfo.whyThisRole}.`
      : ""
  }${
    userInfo.additionalInfo
      ? `\n- Any Additional Information or Instructions: ${userInfo.additionalInfo}.`
      : ""
  }`;

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: userInfo.temperature ?? 0.5,
    top_p: 1,
    n: 1,
    stream: true,
    max_tokens: 1000,
    presence_penalty: 0,
    frequency_penalty: 0,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (response.status !== 200) {
    throw new Response(response.statusText, { status: response.status });
  }

  return response;
};

export default fetchOpenAIAPI;
