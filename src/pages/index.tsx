import { FormEvent, useRef, useState } from "react";
import { createParser, ParseEvent } from "eventsource-parser";
import { toast } from "react-hot-toast";

import Header from "@/components/Header";
import Button from "@/components/Button";
import Form from "@/components/Form";
import ApiKeyModal from "@/components/ApiKeyModal";

import inputs, { UserInfo } from "../inputs";

const intialUserInfo: UserInfo = Object.assign(
  {},
  ...inputs.map(input => ({ [input.name]: "" }))
);

export default function Home() {
  const userInfo = useRef<UserInfo>(intialUserInfo);
  const [loading, setLoading] = useState(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [apiKey, setApiKey] = useState("");
  const gereratedSection = useRef<HTMLDivElement>(null);

  const generate = async (e: FormEvent) => {
    e.preventDefault();

    setGeneratedCoverLetter("");
    setLoading(true);

    try {
      const response = await fetch("/api/generate/edge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInfo: userInfo.current, apiKey }),
      });

      if (response.status !== 200 || !response.body) {
        throw new Error("Failed to generate");
      }

      const onParse = (event: ParseEvent) => {
        if (event.type === "event") {
          const data = event.data;

          try {
            const newText = JSON.parse(data).text ?? "";
            setGeneratedCoverLetter(prevText => prevText + newText);
          } catch (e) {
            throw new Error("Somthing went wrong while generating");
          }
        }
      };

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const parser = createParser(onParse);

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        parser.feed(decoder.decode(value));
        gereratedSection.current?.scrollIntoView({
          behavior: "smooth",
        });
      }
    } catch (err) {
      console.log(err);
      const message = err instanceof Error ? err.message : "Failed to Generate";
      toast.error(message, { icon: "😥" });
    }
    setLoading(false);
  };

  const focusOnFirstInput = () => {
    const input = document.getElementsByTagName("input")?.[0];
    if (input) {
      input?.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const saveToClipboard = () => {
    if (loading) return;
    navigator.clipboard.writeText(generatedCoverLetter);
    toast.success("Copied to clipboard");
  };

  const disabledForm = process.env.NODE_ENV === "production" && !apiKey;

  return (
    <main className={`min-h-screen max-w-5xl mx-auto`}>
      <Header />
      <section className="p-4">
        <h2 className="text-[min(10vw,3.5rem)] mt-16 font-bold text-center max-w-lg min-[900px]:max-w-3xl mx-auto">
          Generate Cover Letter Email Easily With GPT Model
        </h2>
        <Button className="mx-auto my-16" onClick={focusOnFirstInput}>
          Try it now 👇
        </Button>
      </section>
      <div className="relative">
        {disabledForm && <ApiKeyModal setApiKey={setApiKey} />}
        <Form
          onSubmit={disabledForm ? e => e.preventDefault() : generate}
          loading={loading}
          userInfo={userInfo}
        />
      </div>
      <div ref={gereratedSection}></div>
      {generatedCoverLetter && (
        <section className="max-w-3xl mx-auto p-4">
          <h2 className="mt-4 pb-8 text-[min(7vw,2.5rem)] font-bold text-center">
            Generated Cover Letter
          </h2>
          <div
            className="relative group bg-slate-50 p-4 shadow-lg rounded-lg border border-black/25 cursor-pointer hover:bg-white transition-colors"
            onClick={saveToClipboard}
          >
            <span className="absolute font-medium bottom-full left-1/2 -translate-x-1/2 translate-y-4 -z-10 transition-all group-hover:-translate-y-1 will-change-transform group-hover:opacity-100 opacity-0 pointer-events-none">
              Click To Copy 📋
            </span>
            {generatedCoverLetter
              .split("\n")
              .map((text, idx) =>
                text === "" ? <br key={idx} /> : <p key={idx}>{text}</p>
              )}
          </div>
        </section>
      )}
      <footer className="px-4 mt-16 text-sm sm:text-base font-medium py-6 text-slate-700 flex justify-between gap-2 items-center border-t-2 border-black/5">
        <p>
          Created By{" "}
          <a
            target="_blank"
            className="front-bold hover:underline"
            href="https://github.com/mohamedalosaili/cover-letter-generator"
          >
            @Mohammed
          </a>
        </p>
        <p>
          Inspired By{" "}
          <a
            target="_blank"
            className="front-bold hover:underline"
            href="https://github.com/Nutlope/twitterbio"
          >
            twitterbio
          </a>
        </p>
      </footer>
    </main>
  );
}
