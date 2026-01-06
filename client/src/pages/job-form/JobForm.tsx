import React from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import { Dropdown } from "@/components/ui/Dropdown";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { TextInput } from "@/components/ui/TextInput";
import { Textarea } from "@/components/ui/Textarea";

export const regions = ["Nepal", "USA", "South Asia", "Latam", "North America"];

const timezones = [
    "UTC-12:00 - Baker Island",
    "UTC-11:00 - American Samoa",
    "UTC-10:00 - Hawaii",
    "UTC-09:00 - Alaska",
    "UTC-08:00 - Pacific Time (US & Canada)",
    "UTC-07:00 - Mountain Time (US & Canada)",
    "UTC-06:00 - Central Time (US & Canada)",
    "UTC-05:00 - Eastern Time (US & Canada)",
    "UTC-04:00 - Atlantic Time (Canada)",
    "UTC-03:00 - Buenos Aires, SÃ£o Paulo",
    "UTC-02:00 - Mid-Atlantic",
    "UTC-01:00 - Azores",
    "UTC+00:00 - London, Dublin, Lisbon",
    "UTC+01:00 - Paris, Berlin, Rome",
    "UTC+02:00 - Cairo, Athens, Jerusalem",
    "UTC+03:00 - Moscow, Istanbul, Nairobi",
    "UTC+04:00 - Dubai, Baku",
    "UTC+05:00 - Karachi, Tashkent",
    "UTC+05:30 - Mumbai, Delhi, Kolkata",
    "UTC+05:45 - Kathmandu",
    "UTC+06:00 - Dhaka, Almaty",
    "UTC+07:00 - Bangkok, Jakarta, Hanoi",
    "UTC+08:00 - Singapore, Beijing, Hong Kong",
    "UTC+09:00 - Tokyo, Seoul",
    "UTC+10:00 - Sydney, Melbourne",
    "UTC+11:00 - Solomon Islands",
    "UTC+12:00 - Auckland, Fiji",
];

export const validateField = (
    field: string,
    value: string | boolean,
    selectedRegions: string[] = []
): string => {
    let message = "";
    const val = String(value).trim();

    switch (field) {
        case "jobTitle":
            if (!val) message = "This field is required.";
            else if (val.length < 2)
                message = "Job title must be at least 2 characters long.";
            else if (val.length > 50)
                message = "Job title cannot exceed 50 characters.";
            else if (!/^[A-Za-z0-9\s&()\-\/+,.]+$/.test(val))
                message = "Job title contains invalid characters.";
            break;

        case "jobDescription":
            if (!val) message = "This field is required.";
            else if (!/^https?:\/\/.+/i.test(val)) message = "Please enter a valid URL.";
            break;

        case "clientName":
            if (!val) {
                message = "This field is required.";
            } else if (val.length < 2) {
                message = "Client name must be at least 2 characters long.";
            } else if (val.length > 250) {
                message = "Client name must not exceed 250 characters.";
            } else if (!/^[A-Za-z0-9\s&.,\-()@#!%$*/_]+$/.test(val)) {
                message = "Client name contains invalid characters.";
            }
            break;

        case "clientTimezone":
            if (!val) message = "Please select a timezone.";
            break;

        case "searchRegion":
            if (selectedRegions.length === 0)
                message = "Please select at least one region.";
            break;

        case "experience":
            if (!val) message = "This field is required.";
            else if (!/^\d+$/.test(val))
                message = "Experience must contain only digits.";
            else if (parseInt(val, 10) < 0 || parseInt(val, 10) > 60) {
                message = "Experience must be between 0 and 60.";
            }
            break;

        default:
            break;
    }

    return message;
};

interface JobFormData {
    jobTitle: string;
    jobDescription: string;
    clientName: string;
    clientTimezone: string;
    experience: string;
    remarks: string;
    dropdownOpen: boolean;
}

interface Errors {
    jobTitle?: string;
    jobDescription?: string;
    clientName?: string;
    clientTimezone?: string;
    experience?: string;
    searchRegion?: string;
    [key: string]: string | undefined;
}

interface JobFormProps {
    formData: JobFormData;
    errors: Errors;
    handleInputChange: (id: string, value: string | boolean) => void;
    handleValidation: (field: string, value: string | boolean) => void;
    clientLogo: string | null;
    handleLogoChange: (val: string | null) => void;
    selectedRegions: string[];
    handleSelectRegion: (region: string) => void;
    selectedRegionDropdownOpen: boolean;
    setSelectedRegionDropdownOpen: (val: boolean) => void;
    selectedContractType: string;
    setSelectedContractType: (val: string) => void;
    selectedOverlap: string;
    setSelectedOverlap: (val: string) => void;
    selectedJobStatus: string;
    setSelectedJobStatus: (val: string) => void;
    isEditMode: boolean;
    setFormData: React.Dispatch<React.SetStateAction<JobFormData>>;
}

export const JobForm: React.FC<JobFormProps> = ({
    formData,
    errors,
    handleInputChange,
    handleValidation,
    clientLogo,
    handleLogoChange,
    selectedRegions,
    handleSelectRegion,
    selectedRegionDropdownOpen,
    setSelectedRegionDropdownOpen,
    selectedContractType,
    setSelectedContractType,
    selectedOverlap,
    setSelectedOverlap,
    selectedJobStatus,
    setSelectedJobStatus,
    isEditMode,
    setFormData,
}) => {
    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <TextInput
                id="jobTitle"
                label="Job Title"
                placeholder="Enter job title"
                value={formData.jobTitle}
                onChange={handleInputChange}
                error={errors.jobTitle}
                required
                onBlur={() => handleValidation("jobTitle", formData.jobTitle)}
            />

            <TextInput
                id="jobDescription"
                label="Job Description URL"
                placeholder="Enter valid URL"
                value={formData.jobDescription}
                onChange={handleInputChange}
                error={errors.jobDescription}
                required
                onBlur={() =>
                    handleValidation("jobDescription", formData.jobDescription)
                }
            />

            <TextInput
                id="clientName"
                label="Client Name"
                placeholder="Enter client Name"
                value={formData.clientName}
                onChange={handleInputChange}
                error={errors.clientName}
                required
                onBlur={() => handleValidation("clientName", formData.clientName)}
            />

            <FileUpload value={clientLogo} onChange={handleLogoChange} />

            <Dropdown
                id="clientTimezone"
                label="Client Timezone"
                options={timezones}
                value={formData.clientTimezone}
                open={formData.dropdownOpen}
                setOpen={(val) =>
                    setFormData((prev) => ({ ...prev, dropdownOpen: val }))
                }
                onSelect={(val) => {
                    handleInputChange("clientTimezone", val);
                    handleValidation("clientTimezone", val);
                }}
                error={errors.clientTimezone}
            />

            <RadioGroup
                label="Contract Type"
                options={["Full-Time", "Part-Time", "Contract"]}
                selected={selectedContractType}
                onChange={setSelectedContractType}
            />

            <RadioGroup
                label="Overlap Requirement"
                options={["Complete", "Partial", "None"]}
                selected={selectedOverlap}
                onChange={setSelectedOverlap}
            />

            <Dropdown
                id="searchRegion"
                label="Search Region"
                options={regions}
                value={selectedRegions.join(", ")}
                open={selectedRegionDropdownOpen}
                setOpen={setSelectedRegionDropdownOpen}
                onSelect={(val) => {
                    handleSelectRegion(val);
                    handleValidation("searchRegion", "");
                    setSelectedRegionDropdownOpen(false);
                }}
                error={errors.searchRegion}
                selectedOptions={selectedRegions}
                multi
            />

            <TextInput
                id="experience"
                label="Minimum Years Of Experience"
                placeholder="Enter minimum years of experience"
                value={formData.experience}
                onChange={handleInputChange}
                error={errors.experience}
                required
                onBlur={() => handleValidation("experience", formData.experience)}
            />

            <RadioGroup
                label="Job Status"
                options={[
                    { label: "Open", value: "Open" },
                    { label: "On Hold", value: "OnHold" },
                    { label: "Closed Won", value: "ClosedWon" },
                    { label: "Closed Lost", value: "ClosedLost" },
                ]}
                selected={selectedJobStatus}
                onChange={setSelectedJobStatus}
                disabledOptions={
                    isEditMode ? [] : ["OnHold", "ClosedWon", "ClosedLost"]
                }
            />

            <Textarea
                id="remarks"
                label="Remarks"
                placeholder="Enter your message here"
                value={formData.remarks}
                onChange={handleInputChange}
            />
        </div>
    );
};

