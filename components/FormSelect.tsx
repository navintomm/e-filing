import { UseFormRegister, FieldValues, Path, FieldError } from "react-hook-form";
import clsx from "clsx";

interface FormSelectProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    error?: FieldError;
    options: string[];
    placeholder?: string;
    description?: string;
}

export function FormSelect<T extends FieldValues>({
    label,
    name,
    register,
    error,
    options,
    placeholder,
    description
}: FormSelectProps<T>) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <select
                    id={name}
                    className={clsx(
                        "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3",
                        error && "ring-red-500 focus:ring-red-500"
                    )}
                    defaultValue=""
                    {...register(name)}
                >
                    <option value="" disabled>
                        {placeholder || "Select an option"}
                    </option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
                {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
            </div>
        </div>
    );
}

interface FormDatalistProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    error?: FieldError;
    options: string[];
    placeholder?: string;
    required?: boolean;
}

export function FormCombobox<T extends FieldValues>({
    label,
    name,
    register,
    error,
    options,
    placeholder,
    required
}: FormDatalistProps<T>) {
    const listId = `${name}-list`;
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <input
                    id={name}
                    list={listId}
                    className={clsx(
                        "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3",
                        error && "ring-red-500 focus:ring-red-500"
                    )}
                    placeholder={placeholder}
                    {...register(name)}
                />
                <datalist id={listId}>
                    {options.map((option) => (
                        <option key={option} value={option} />
                    ))}
                </datalist>
                {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
            </div>
        </div>
    );
}
