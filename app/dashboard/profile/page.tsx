"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FormInput } from "@/components/FormInput";
import { Save, CheckCircle, ArrowLeft, User, Plus, Trash2 } from "lucide-react";
import Link from 'next/link';

// Using localStorage key for auto-fill
const PROFILE_KEY = 'advocate_profile';

type AdvocateEntry = {
    name: string;
    enrollmentNumber: string;
};

type ProfileFormValues = {
    advocates: AdvocateEntry[];
    advocateAddress: string;
    advocatePhone: string;
    advocateEmail: string;
};

export default function ProfilePage() {
    const [isSaved, setIsSaved] = useState(false);
    const { register, handleSubmit, setValue, control, formState: { errors }, watch } = useForm<ProfileFormValues>({
        defaultValues: {
            advocates: [{ name: '', enrollmentNumber: '' }],
            advocateAddress: '',
            advocatePhone: '',
            advocateEmail: '',
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "advocates"
    });

    // Load saved data on mount
    useEffect(() => {
        const savedData = localStorage.getItem(PROFILE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Handle old single advocate format
                if (parsed.advocateName && !parsed.advocates) {
                    setValue('advocates', [{
                        name: parsed.advocateName,
                        enrollmentNumber: parsed.enrollmentNumber || ''
                    }]);
                } else if (parsed.advocates) {
                    setValue('advocates', parsed.advocates);
                }
                setValue('advocateAddress', parsed.advocateAddress || '');
                setValue('advocatePhone', parsed.advocatePhone || '');
                setValue('advocateEmail', parsed.advocateEmail || '');
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        }
    }, [setValue]);

    const onSubmit = (data: ProfileFormValues) => {
        // Also save in old format for backward compatibility
        const advocateNames = data.advocates.map(a => a.name).join(', ');
        const enrollmentNumbers = data.advocates.map(a => a.enrollmentNumber).join(', ');

        const saveData = {
            ...data,
            // Backward compatibility
            advocateName: advocateNames,
            enrollmentNumber: enrollmentNumbers,
        };

        localStorage.setItem(PROFILE_KEY, JSON.stringify(saveData));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Advocate Profile</h1>
                <p className="mt-2 text-gray-600">
                    Save your professional details here. They will be <strong>automatically filled</strong> in every new Vakalath draft you create.
                </p>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">Default Details</h2>
                            <p className="text-sm text-gray-500">These details will appear in your drafts.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                    {/* Advocates Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Advocate Details</h3>
                            <button
                                type="button"
                                onClick={() => append({ name: '', enrollmentNumber: '' })}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1" />
                                Add Advocate
                            </button>
                        </div>

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="text-sm font-medium text-gray-700">
                                            Advocate {index + 1}
                                            {index === 0 && fields.length === 1 && (
                                                <span className="ml-2 text-xs text-gray-500">(Primary)</span>
                                            )}
                                        </h4>
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-red-600 hover:text-red-700 transition-colors p-1"
                                                title="Remove advocate"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <FormInput
                                                label="Advocate Name"
                                                name={`advocates.${index}.name`}
                                                register={register}
                                                error={errors.advocates?.[index]?.name}
                                                placeholder="e.g., Adv. A. Kumar"
                                                required
                                            />
                                        </div>

                                        <div className="sm:col-span-1">
                                            <FormInput
                                                label="Enrollment Number"
                                                name={`advocates.${index}.enrollmentNumber`}
                                                register={register}
                                                error={errors.advocates?.[index]?.enrollmentNumber}
                                                placeholder="e.g., K/123/2010"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <p className="text-xs text-blue-800">
                                💡 <strong>Tip:</strong> If you add multiple advocates, they will be displayed as "Adv. A, Adv. B, and Adv. C" in the Vakalath document.
                            </p>
                        </div>
                    </div>

                    {/* Contact & Address Section */}
                    <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact & Address</h3>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <FormInput
                                    label="Phone Number"
                                    name="advocatePhone"
                                    type="tel"
                                    register={register}
                                    error={errors.advocatePhone}
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div className="sm:col-span-1">
                                <FormInput
                                    label="Email Address"
                                    name="advocateEmail"
                                    type="email"
                                    register={register}
                                    error={errors.advocateEmail}
                                    placeholder="advocate@example.com"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <FormInput
                                    label="Office Address"
                                    name="advocateAddress"
                                    register={register}
                                    error={errors.advocateAddress}
                                    placeholder="Full office address including pincode"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                        {isSaved && (
                            <span className="text-green-600 text-sm font-medium mr-4 flex items-center animate-fadeIn">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Settings Saved!
                            </span>
                        )}
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
