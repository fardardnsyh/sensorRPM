import {
  ChangeEvent,
  ChangeEventHandler,
  ComponentProps,
  ReactNode,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

type BaseInputProps = Partial<
  Pick<
    ComponentProps<"input">,
    | "id"
    | "className"
    | "name"
    | "onChange"
    | "maxLength"
    | "placeholder"
    | "required"
    | "disabled"
  >
>;

interface InputProps extends BaseInputProps {
  inputType: "input" | "textarea";
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  children?: ReactNode;
}

const Input = ({ inputType = "input", children, ...props }: InputProps) => {
  const [length, setLength] = useState(0);
  const className = `px-4 py-2 w-full placeholder:text-sm border-2 border-black/25 rounded-lg transition-colors focus:outline-none focus:border-black/75`;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLength(e.target.value.length);
    props.onChange(e);
  };

  return (
    <label
      className={`relative ${inputType === "textarea" ? "sm:col-span-2" : ""}`}
    >
      <p className="font-medium text-sm mb-2 relative flex gap-2 items-center">
        {children}
      </p>
      {inputType === "input" ? (
        <input
          type="text"
          {...props}
          onChange={onChange}
          className={twMerge(className, props.className, "peer")}
        />
      ) : (
        <textarea
          {...props}
          onChange={onChange}
          className={twMerge(
            className,
            props.className,
            "resize-y max-h-48 min-h-min h-28 peer block"
          )}
        />
      )}
      <span className="absolute opacity-0 peer-focus:opacity-50 text-xs w-fit top-1 right-1 ">
        {length} / {props.maxLength}
      </span>
    </label>
  );
};

export default Input;
