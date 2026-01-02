import { UseFormRegister, FieldErrors, Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { VakalathFormValues } from "@/lib/validators";
import { FormInput } from "@/components/FormInput";
import { useEffect, useState } from "react";
import { UserCheck, Users } from "lucide-react";

interface AdvocateDetailsProps {
    register: UseFormRegister<VakalathFormValues>;
    control: Control<VakalathFormValues>;
    errors: FieldErrors<VakalathFormValues>;
    setValue: UseFormSetValue<VakalathFormValues>;
    watch: UseFormWatch<VakalathFormValues>;
}

const PROFILE_KEY = 'advocate_profile';

type SavedAdvocate = {
    name: string;
    enrollmentNumber: string;
};

export function AdvocateDetails({ register, control, errors, setValue, watch }: AdvocateDetailsProps) {
    const [savedAdvocates, setSavedAdvocates] = useState<SavedAdvocate[]>([]);
    const [selectedAdvocateIndex, setSelectedAdvocateIndex] = useState<string>("");
    const [autoFilled, setAutoFilled] = useState(false);

    // Load saved advocates on mount
    useEffect(() => {
        const savedData = localStorage.getItem(PROFILE_KEY);
        if (savedData) {
            try {
                const profile = JSON.parse(savedData);

                // Handle new multi-advocate format
                if (profile.advocates && Array.isArray(profile.advocates)) {
                    setSavedAdvocates(profile.advocates.filter((a: SavedAdvocate) => a.name));
                }
                // Handle old single advocate format for backward compatibility
                else if (profile.advocateName) {
                    setSavedAdvocates([{
                        name: profile.advocateName,
                        enrollmentNumber: profile.enrollmentNumber || ''
                    }]);
                }
            } catch (e) {
                console.error("Error loading advocates:", e);
            }
        }
    }, []);

    // Auto-fill from profile on initial load
    useEffect(() => {
        const currentName = watch("advocateName");

        // Only auto-fill if fields are empty and we have saved data
        if (!currentName && savedAdvocates.length > 0) {
            const savedData = localStorage.getItem(PROFILE_KEY);
            if (savedData) {
                try {
                    const profile = JSON.parse(savedData);

                    // Auto-fill the first advocate and contact details
                    if (savedAdvocates[0]) {
                        setValue("advocateName", savedAdvocates[0].name);
                        setValue("enrollmentNumber", savedAdvocates[0].enrollmentNumber);
                        setSelectedAdvocateIndex("0");
                    }

                    // Fill contact details
                    if (profile.advocatePhone) setValue("advocateMobile", profile.advocatePhone);
                    if (profile.advocateAddress) setValue("advocateAddress", profile.advocateAddress);

                    setAutoFilled(true);
                } catch (e) {
                    console.error("Error auto-filling profile data:", e);
                }
            }
        }
    }, [savedAdvocates, setValue, watch]);

    // Handle advocate selection from dropdown
    const handleAdvocateSelect = (index: string) => {
        setSelectedAdvocateIndex(index);

        if (index === "") {
            // Clear selection
            setValue("advocateName", "");
            setValue("enrollmentNumber", "");
            setAutoFilled(false);
            return;
        }

        const selectedIndex = parseInt(index);
        const selected = savedAdvocates[selectedIndex];

        if (selected) {
            setValue("advocateName", selected.name);
            setValue("enrollmentNumber", selected.enrollmentNumber);

            // Also fill contact details from profile
            const savedData = localStorage.getItem(PROFILE_KEY);
            if (savedData) {
                try {
                    const profile = JSON.parse(savedData);
                    if (profile.advocatePhone) setValue("advocateMobile", profile.advocatePhone);
                    if (profile.advocateAddress) setValue("advocateAddress", profile.advocateAddress);
                } catch (e) {
                    console.error("Error loading contact details:", e);
                }
            }

            setAutoFilled(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Advocate Details</h3>
                {autoFilled && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Auto-filled from Profile
                    </span>
                )}
            </div>

            {/* Advocate Selector Dropdown */}
            {savedAdvocates.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label htmlFor="advocateSelector" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Users className="w-4 h-4 mr-2 text-blue-600" />
                        Select from Saved Advocates
                    </label>
                    <select
                        id="advocateSelector"
                        value={selectedAdvocateIndex}
                        onChange={(e) => handleAdvocateSelect(e.target.value)}
                        className="block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                    >
                        <option value="">-- Select an advocate or enter manually --</option>
                        {savedAdvocates.map((advocate, index) => (
                            <option key={index} value={index}>
                                {advocate.name} ({advocate.enrollmentNumber})
                            </option>
                        ))}
                    </select>
                    <p className="mt-2 text-xs text-blue-700">
                        💡 Selecting an advocate will auto-fill all details. You can also enter details manually below.
                    </p>
                </div>
            )}

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

            {savedAdvocates.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-xs text-yellow-800">
                        💡 <strong>Tip:</strong> Save your advocate details in{" "}
                        <a href="/dashboard/profile" className="underline font-medium hover:text-yellow-900">
                            Profile Settings
                        </a>{" "}
                        to quickly select them in future drafts.
                    </p>
                </div>
            )}
        </div>
    );
}
