import { Dispatch, FormEvent, SetStateAction, useEffect, useRef } from "react";
import Button from "./Button";
import { toast } from "react-hot-toast";

interface ApiKeyModalProps {
  setApiKey: Dispatch<SetStateAction<string>>;
}

const ApiKeyModal = ({ setApiKey }: ApiKeyModalProps) => {
  const saveToLocalStorageRef = useRef<HTMLInputElement>(null);
  const apiKeyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const apiKeyFromLocalStorage = localStorage.getItem("apiKey");
    const apiKeyFromSessionStorage = sessionStorage.getItem("apiKey");
    if (!apiKeyFromLocalStorage && !apiKeyFromSessionStorage) return;

    setApiKey(apiKeyFromLocalStorage ?? apiKeyFromSessionStorage ?? "");
  });

  const addAPIKey = (e: FormEvent) => {
    e.preventDefault();

    const apiKey = apiKeyRef.current?.value;
    const saveToLocalStorage = saveToLocalStorageRef.current?.checked;

    if (!apiKey) {
      return toast("You forgot to add your API key", { icon: "😉" });
    }

    if (saveToLocalStorage) {
      localStorage.setItem("apiKey", apiKey);
    } else {
      sessionStorage.setItem("apiKey", apiKey);
    }

    setApiKey(apiKey);
  };

  return (
    <div className="absolute inset-0 z-10 grid place-items-center p-4 backdrop-blur-sm">
      <div className="relative max-w-md z-10 font-medium bg-slate-50 p-4 shadow-2xl rounded-lg border border-black/25">
        <h3 className="font-bold text-center text-2xl mb-4">Sorry 😑</h3>
        <p className="text-center text-sm sm:text-base">
          Because OpenAI is not available in my country, I have limited access
          to the API usage (free grant only), but you can provide your API key
          below to use the generator.
        </p>

        <form onSubmit={addAPIKey} className="mt-4 flex flex-col gap-2">
          <input
            ref={apiKeyRef}
            type="text"
            placeholder="OpenAI API Key."
            className="px-4 py-2 w-full placeholder:text-sm border-2 border-black/25 rounded-lg transition-colors focus:outline-none focus:border-black/75"
          />
          <label className="flex items-center gap-2 text-sm">
            Save in Browser for next time?{" "}
            <input
              ref={saveToLocalStorageRef}
              type="checkbox"
              className="accent-black w-4 h-4"
            />
          </label>
          <Button>Save</Button>
        </form>
        <p className="mt-4 text-sm">
          If you don&#39;t have a key, go to{" "}
          <a
            className="text-blue-600"
            target="_blank"
            href="https://platform.openai.com/docs/api-reference/authentication"
          >
            API Key
          </a>{" "}
          page and get one.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;
