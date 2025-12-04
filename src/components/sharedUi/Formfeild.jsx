"use client";
import { useFormContext, get } from "react-hook-form";
import { Input } from "../ui/input";

export default function Formfeild({
  labelText,
  fieldName,
  type = "text",
  placeholder = "",
  required = false,
}) {
  const { register, formState: { errors } } = useFormContext();

  const error = get(errors, fieldName);

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={fieldName} className="text-black">
        {labelText}
        {required && <span className="text-red-500">*</span>}
      </label>

      <Input
        id={fieldName}
        type={type}
        placeholder={placeholder}
        {...register(fieldName, {
          required: required ? `${labelText} is required` : false,
        })}
        className={`border placeholder:text-black/80 p-2 rounded ${
          error ? "border-red-500" : ""
        }`}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error.message}fg</p>}
    </div>
  );
}
