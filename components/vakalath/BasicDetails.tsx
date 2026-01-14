"use client";

import { UseFormRegister, FieldErrors, Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { VakalathFormValues } from "@/lib/vakalath-validators";
import { FormInput } from "@/components/FormInput";
import { FormCombobox } from "@/components/FormSelect";
import { FormSearchSelect } from "@/components/FormSearchSelect";
import { FILING_TYPES } from "@/lib/constants";
import { KERALA_DISTRICTS, COURTS_BY_DISTRICT, CASE_TYPES, getCourtsForDistrict } from "@/lib/kerala-legal-data";
import { useEffect, useState } from "react";

interface BasicDetailsProps {
    register: UseFormRegister<VakalathFormValues>;
    control: Control<VakalathFormValues>;
    errors: FieldErrors<VakalathFormValues>;
    setValue: UseFormSetValue<VakalathFormValues>;
    watch: UseFormWatch<VakalathFormValues>;
}

export function BasicDetails({ register, control, errors, setValue, watch }: BasicDetailsProps) {
    const documentType = watch("documentType");
    const selectedDistrict = watch("district");
    const [availableCourts, setAvailableCourts] = useState<string[]>([]);

    // Update effect for document type
    useEffect(() => {
        if (documentType === "Memo of Appearance") {
            setValue("partySignature", "No");
        } else if (documentType === "Vakalathnama") {
            setValue("partySignature", "Yes");
        }
    }, [documentType, setValue]);

    // Update available courts when district changes
    useEffect(() => {
        if (selectedDistrict) {
            const courts = getCourtsForDistrict(selectedDistrict);
            setAvailableCourts(courts);
            // Reset court selection when district changes
            setValue("courtName", "");
        } else {
            setAvailableCourts([]);
        }
    }, [selectedDistrict, setValue]);

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Details</h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                    <label htmlFor="documentType" className="block text-sm font-medium leading-6 text-gray-900">
                        Document Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="documentType"
                        {...register("documentType")}
                        className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">Select Document Type</option>
                        {FILING_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {errors.documentType && (
                        <p className="mt-1 text-sm text-red-600">{errors.documentType.message}</p>
                    )}
                </div>

                {/* District Dropdown */}
                <div className="sm:col-span-1">
                    <label htmlFor="district" className="block text-sm font-medium leading-6 text-gray-900">
                        District <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="district"
                        {...register("district")}
                        className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">Select District</option>
                        {KERALA_DISTRICTS.map((district) => (
                            <option key={district} value={district}>
                                {district}
                            </option>
                        ))}
                    </select>
                    {errors.district && (
                        <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                    )}
                </div>

                {/* Court Name Searchable Dropdown */}
                <div className="sm:col-span-1">
                    <FormSearchSelect
                        label="Court Name"
                        name="courtName"
                        control={control}
                        options={availableCourts}
                        error={errors.courtName}
                        placeholder={selectedDistrict ? "Search or select court..." : "Select District First"}
                        disabled={!selectedDistrict}
                        required
                    />
                </div>

                {/* Case Type Dropdown */}
                <div className="sm:col-span-1">
                    <label htmlFor="caseType" className="block text-sm font-medium leading-6 text-gray-900">
                        Case Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="caseType"
                        {...register("caseType")}
                        className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">Select Case Type</option>
                        {/* Group by category */}
                        <optgroup label="Civil Cases">
                            {CASE_TYPES.filter(ct => ct.category === 'Civil').map((caseType) => (
                                <option key={caseType.value} value={caseType.value}>
                                    {caseType.label}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Writ Petitions">
                            {CASE_TYPES.filter(ct => ct.category === 'Writ').map((caseType) => (
                                <option key={caseType.value} value={caseType.value}>
                                    {caseType.label}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Criminal Cases">
                            {CASE_TYPES.filter(ct => ct.category === 'Criminal').map((caseType) => (
                                <option key={caseType.value} value={caseType.value}>
                                    {caseType.label}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Special Cases">
                            {CASE_TYPES.filter(ct => ct.category === 'Special').map((caseType) => (
                                <option key={caseType.value} value={caseType.value}>
                                    {caseType.label}
                                </option>
                            ))}
                        </optgroup>
                    </select>
                    {errors.caseType && (
                        <p className="mt-1 text-sm text-red-600">{errors.caseType.message}</p>
                    )}
                </div>

                <div className="sm:col-span-1">
                    <FormInput
                        label="Case Number"
                        name="caseNumber"
                        register={register}
                        error={errors.caseNumber}
                        placeholder="e.g., 245"
                    />
                </div>

                <div className="sm:col-span-1">
                    <FormInput
                        label="Year"
                        name="year"
                        register={register}
                        error={errors.year}
                        placeholder="e.g., 2025"
                    />
                </div>

                <div className="sm:col-span-2">
                    <FormInput
                        label="Witnesses"
                        name="witnesses"
                        register={register}
                        error={errors.witnesses}
                        placeholder="Enter witness names separated by commas"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Separate multiple witness names with commas (e.g., "John Doe, Jane Smith")
                    </p>
                </div>
            </div>
        </div>
    );
}
