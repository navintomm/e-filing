"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { UseFormRegister, FieldValues, Path, UseFormSetValue, UseFormWatch, Controller, Control } from 'react-hook-form';
import { ChevronDown, Check, X } from 'lucide-react';
import clsx from 'clsx';

interface FormSearchSelectProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    control: Control<T>;
    options: string[];
    placeholder?: string;
    error?: any;
    disabled?: boolean;
    required?: boolean;
}

export function FormSearchSelect<T extends FieldValues>({
    label,
    name,
    control,
    options,
    placeholder = "Select...",
    error,
    disabled = false,
    required = false,
}: FormSearchSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        return options.filter(option =>
            option.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value, ref } }) => {
                // Determine display value
                const displayValue = value || '';

                const handleSelect = (option: string) => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchTerm('');
                };

                const handleClear = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    onChange('');
                    setSearchTerm('');
                };

                return (
                    <div className="relative" ref={containerRef}>
                        <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                            {label} {required && <span className="text-red-500">*</span>}
                        </label>

                        <div
                            className={clsx(
                                "relative w-full cursor-default overflow-hidden rounded-md border bg-white text-left shadow-sm focus:outline-none sm:text-sm",
                                error
                                    ? "border-red-500 ring-red-500"
                                    : "border-gray-300 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600",
                                disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-text"
                            )}
                            onClick={() => !disabled && setIsOpen(!isOpen)}
                        >
                            <input
                                type="text"
                                className={clsx(
                                    "w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 outline-none",
                                    disabled && "bg-gray-100 cursor-not-allowed"
                                )}
                                placeholder={placeholder}
                                value={isOpen ? searchTerm : displayValue}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (!isOpen) setIsOpen(true);
                                }}
                                onFocus={() => !disabled && setIsOpen(true)}
                                ref={ref}
                                disabled={disabled}
                                autoComplete="off"
                            />

                            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                {displayValue && !disabled && !isOpen && (
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="text-gray-400 hover:text-gray-500 mr-1"
                                    >
                                        <X className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                )}
                                <ChevronDown
                                    className="h-4 w-4 text-gray-400"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        {isOpen && !disabled && (
                            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredOptions.length === 0 ? (
                                    <li className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                        No results found.
                                    </li>
                                ) : (
                                    filteredOptions.map((option, idx) => (
                                        <li
                                            key={option}
                                            className={clsx(
                                                "relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-blue-50",
                                                option === value ? "bg-blue-50 text-blue-900 font-medium" : "text-gray-900"
                                            )}
                                            onClick={() => handleSelect(option)}
                                        >
                                            <span className="block truncate">
                                                {option}
                                            </span>
                                            {option === value && (
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                                    <Check className="h-4 w-4" aria-hidden="true" />
                                                </span>
                                            )}
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}

                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error.message}</p>
                        )}
                    </div>
                );
            }}
        />
    );
}
