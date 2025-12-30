import { UseFormRegister, FieldErrors, Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { VakalathFormValues } from "@/lib/validators";
import { FormInput } from "@/components/FormInput";
import { useEffect } from "react";
import { UserCheck } from "lucide-react";

interface AdvocateDetailsProps {
    register: UseFormRegister<VakalathFormValues>;
    control: Control<VakalathFormValues>;
    errors: FieldErrors<VakalathFormValues>;
    setValue: UseFormSetValue<VakalathFormValues>;
    watch: UseFormWatch<VakalathFormValues>;
}

const PROFILE_KEY = 'advocate_profile';

export function AdvocateDetails({ register, control, errors, setValue, watch }: AdvocateDetailsProps) {

    // Auto-fill effect
    useEffect(() => {
        // Check if main field is empty to avoid overwriting user input
        // We use a small timeout to ensure form is ready, though useEffect runs after render
        const currentName = watch("advocateName");

        // Only attempt auto-fill if the name field is empty
        if (!currentName) {
            const savedData = localStorage.getItem(PROFILE_KEY);
            if (savedData) {
                try {
                    const profile = JSON.parse(savedData);

                    // Auto-fill fields if they exist in profile
                    if (profile.advocateName) setValue("advocateName", profile.advocateName);
                    if (profile.enrollmentNumber) setValue("enrollmentNumber", profile.enrollmentNumber);

                    // Map advocatePhone to advocateMobile
                    if (profile.advocatePhone) setValue("advocateMobile", profile.advocatePhone);

                    if (profile.advocateAddress) setValue("advocateAddress", profile.advocateAddress);

                    // If your schema has advocateEmail, set it too
                    if (profile.advocateEmail && "advocateEmail" in profile) {
                        // Check if schema supports email before setting to avoid type errors if strict
                        // For now we skip email if not in the UI form shown previously
                    }

                } catch (e) {
                    console.error("Error auto-filling profile data:", e);
                }
            }
        }
    }, [setValue, watch]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Advocate Details</h3>
                {watch("advocateName") && localStorage.getItem(PROFILE_KEY) && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Auto-filled from Profile
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                    <FormInput
                        label="Advocate Name"
                        name="advocateName"
                        register={register}
                        error={errors.advocateName}
                        placeholder="Advocate Name"
                        required
                    />
                </div>

                <div className="col-span-1">
                    <FormInput
                        label="Enrollment Number"
                        name="enrollmentNumber"
                        register={register}
                        error={errors.enrollmentNumber}
                        placeholder="K/123/2023"
                        required
                    />
                </div>

                <div className="col-span-1">
                    <FormInput
                        label="Mobile Number"
                        name="advocateMobile"
                        register={register}
                        error={errors.advocateMobile}
                        placeholder="9876543210"
                        required
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <FormInput
                        label="Advocate Address"
                        name="advocateAddress"
                        register={register}
                        error={errors.advocateAddress}
                        placeholder="Full Office Address"
                        textarea
                        required
                    />
                </div>
            </div>
        </div>
    );
}
