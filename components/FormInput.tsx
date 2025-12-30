import { UseFormRegister, FieldValues, Path, FieldError } from "react-hook-form";
import clsx from "clsx";

interface FormInputProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    error?: FieldError;
    type?: string;
    placeholder?: string;
    textarea?: boolean;
    disabled?: boolean;
    required?: boolean;
}

export function FormInput<T extends FieldValues>({
    label,
    name,
    register,
    error,
    type = "text",
    placeholder,
    textarea = false,
    disabled = false,
    required = false,
}: FormInputProps<T>) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                {textarea ? (
                    <textarea
                        id={name}
                        rows={4}
                        className={clsx(
                            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3",
                            error && "ring-red-500 focus:ring-red-500"
                        )}
                        placeholder={placeholder}
                        {...register(name)}
                    />
                ) : (
                    <input
                        id={name}
                        type={type}
                        className={clsx(
                            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3",
                            error && "ring-red-500 focus:ring-red-500"
                        )}
                        placeholder={placeholder}
                        {...register(name)}
                    />
                )}
                {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
            </div>
        </div>
    );
}
