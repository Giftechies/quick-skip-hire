// FormField.jsx (using the name you provided: Formfeild)
"use client";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input"; // Assuming this is your styled Input component

export default function Formfeild({ // Renamed to Formfeild to match your import
  labelText,
  fieldName,
  type = "text",
  placeholder = "",
  // Add required validation rule here for clarity and reusability
  required = false, 
}) {
  const { register, formState: { errors } } = useFormContext(); 
  
  // Use bracket notation to safely access nested error object
  const error = errors[fieldName] || (fieldName.includes('.') ? errors[fieldName.split('.')[0]]?.[fieldName.split('.')[1]] : null);


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
        // ✅ CORRECT USAGE: Pass validation rules directly into register
        {...register(fieldName, { 
            required: required ? `${labelText} is required` : false,
            // Add custom validation rules here (e.g., pattern for email)
        })} 
        className={`border placeholder:text-black/80 p-2 rounded ${error ? 'border-red-500' : ''}`}
      />
      
      {/* 🛑 Display Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}