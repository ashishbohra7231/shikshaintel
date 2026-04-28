import { Field, ErrorMessage } from "formik";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  errors?: any;
  touched?: any;
}

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  errors,
  touched,
}: InputFieldProps) => (
  <div className="space-y-1.5">
    <label 
      htmlFor={name}
      className="block text-sm font-semibold text-slate-700 ml-1"
    >
      {label} <span className="text-rose-500">*</span>
    </label>
    <div className="relative">
      <Field
        as="input"
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className={`w-full h-11 px-4 rounded-lg bg-white border text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
          touched && errors
            ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
            : "border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
        }`}
      />
    </div>
    <ErrorMessage name={name}>
      {(msg) => (
        <p className="mt-1.5 text-xs font-medium text-rose-500 flex items-center gap-1 ml-1">
          {msg}
        </p>
      )}
    </ErrorMessage>
  </div>
);

export default InputField;