import { ChangeEvent, ComponentProps, MutableRefObject, useState } from "react";
import Button from "../Button";
import Input from "./Input";

import inputs, { UserInfo } from "@/inputs";

interface FormProps extends ComponentProps<"form"> {
  userInfo: MutableRefObject<UserInfo>;
  loading: boolean;
}

const Form = ({ userInfo, loading, ...props }: FormProps) => {
  const [showOptional, setShowOptional] = useState(false);

  // Refresh form inputs when reset clicked
  const [formKey, setFormKey] = useState(Math.random().toString());
  const [temperature, setTemperature] = useState("5");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const isTemperature = name === "temperature";
    if (isTemperature) setTemperature(value);

    userInfo.current = {
      ...userInfo.current,
      [name]: isTemperature ? Number(value) / 10 : value,
    };
  };

  const resetForm = () => {
    setFormKey(Math.random().toString());
    setTemperature("5");
  };

  return (
    <form
      key={formKey}
      {...props}
      className="pb-8 pt-16 grid px-4 sm:grid-cols-2 gap-4 max-w-2xl mx-auto relative overflow-hidden-x "
      onReset={resetForm}
    >
      {inputs.map(
        ({ label, hint, ...input }) =>
          (input.required || showOptional) && (
            <Input
              key={input.id}
              {...input}
              onChange={handleChange}
              disabled={loading}
            >
              <span>
                {label}{" "}
                <span className="text-rose-600">{input.required && "*"}</span>
              </span>
              {hint && <Tooltip hint={hint} />}
            </Input>
          )
      )}
      <label className="absolute w-full text-sm w-max top-2 left-1/2 -translate-x-1/2 font-medium flex items-center gap-2">
        Model Creativity
        <input
          type="range"
          name="temperature"
          min={5}
          max={10}
          className="accent-black w-24 sm:w-40"
          value={temperature}
          onChange={handleChange}
        />
        <span className="block min-w-[4rem]">
          {temperature === "5" ? "Default" : temperature}
        </span>
        <Tooltip hint="This controls how creative or conservative the model is when generating Cover Letters. A higher number will result in more creative results. Try default first." />
      </label>

      <Button alt type="button" onClick={() => setShowOptional(prev => !prev)}>
        {showOptional ? "Hide" : "Show"} Optional Inputs
      </Button>
      <Button alt type="reset" disabled={loading}>
        Reset Fields
      </Button>
      <Button className="sm:col-span-2" disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </Button>
    </form>
  );
};

const Tooltip = ({ hint }: { hint: string }) => (
  <>
    <span className="flex items-center justify-center rounded-full w-4 h-4 text-xs border border-black/50 cursor-pointer mr-2 peer">
      !
    </span>
    <span className="absolute z-10 bg-white shadow-2xl rounded-lg p-3 border border-black/10 bottom-0 left-1 opacity-0 transition-opacity pointer-events-none peer-hover:opacity-100">
      {hint}
    </span>
  </>
);

export default Form;
