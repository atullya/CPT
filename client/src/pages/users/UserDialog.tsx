import React, { useState, useEffect } from "react";
import { FormDialog } from "@/components/ui/Dialog";
import { TextInput } from "@/components/ui/TextInput";
import { ChevronDown, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { useCreateUserMutation, useUpdateUserMutation } from "@/store/users/usersApi";
import type { User } from "@/store/users/usersTypes";


const UserRoleEnum = {
    SUPER_ADMIN: 'super-admin',
    ADMIN: 'admin',
    USER: 'user'
} as const;

type UserRoleEnum = typeof UserRoleEnum[keyof typeof UserRoleEnum];

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    user?: User | null;
}

const roleOptions = [
    {
        value: UserRoleEnum.SUPER_ADMIN,
        label: "Super Admin",
        description: "Full access to manage users, roles, jobs, and candidates across the system."
    },
    {
        value: UserRoleEnum.ADMIN,
        label: "Admin",
        description: "Manage all jobs and candidates, with view-only access to other user profiles."
    },
    {
        value: UserRoleEnum.USER,
        label: "User",
        description: "Read-only access to jobs, candidates, and user profiles."
    }
];

const UserDialog: React.FC<UserDialogProps> = ({ open, onOpenChange, onSuccess, user }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<UserRoleEnum | "">("");
    const [errors, setErrors] = useState<{ name?: string; email?: string; role?: string }>({});

    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const isLoading = isCreating || isUpdating;
    const isEditMode = !!user;

    useEffect(() => {
        if (open) {
            if (user) {
                setName(user.name);
                setEmail(user.email);
                setRole(user.role);
            } else {
                setName("");
                setEmail("");
                setRole("");

            }
            setErrors({});
        }
    }, [open, user]);


    const validate = () => {
        const newErrors: typeof errors = {};
        if (!name.trim()) newErrors.name = "Full Name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
        if (!role) newErrors.role = "User role is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            if (isEditMode && user) {
                await updateUser({
                    _id: user._id,
                    name,
                    email,
                    role: role as UserRoleEnum,
                }).unwrap();
            } else {
                await createUser({
                    name,
                    email,
                    role: role as UserRoleEnum,
                }).unwrap();
            }

            onOpenChange(false);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error("Failed to save user:", error);
            if (error?.data?.message) {
                alert(error.data.message);
            }
        }
    };

    const selectedRoleOption = roleOptions.find(r => r.value === role);

    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Edit User" : "Add New User"}
            onSave={handleSubmit}
            saveText={isEditMode ? "Save Changes" : "Add user"}
            cancelText="Cancel"
            isSaving={isLoading}
            saveEnabled={true}
            contentClassName="max-w-[592px]"
            bodyClassName="gap-6 flex flex-col"
            saveButtonClass="bg-[#7C3AED] hover:bg-[#6D28D9]"
        >
            <TextInput
                id="name"
                label="Full Name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Enter full name"
                required
                error={errors.name}
            />

            <TextInput
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
                error={errors.email}
            />

            <div className="flex flex-col w-full gap-1">
                <label className="font-plus-jakarta block text-gray-900 font-semibold text-[15px] leading-[22px]">
                    User role <span className="text-red-600">*</span>
                </label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className={`w-full h-9 min-h-9 rounded-md border px-3 py-[7.5px] bg-white text-sm flex items-center justify-between focus:outline-none ${errors.role ? "border-red-500" : "border-[#E4E4E7]"}`}
                        >
                            <span className={`font-plus-jakarta ${role ? "text-gray-900" : "text-[#71717A]"}`}>
                                {selectedRoleOption ? selectedRoleOption.label : "Select user role"}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#E5E5E5] rounded-md shadow-lg p-1 z-[100]">
                        {roleOptions.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => setRole(option.value)}
                                className="cursor-pointer px-3 py-2 rounded text-sm hover:bg-gray-50 flex items-start flex-col gap-0.5 outline-none data-[highlighted]:bg-gray-50"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-plus-jakarta font-medium text-gray-900 text-[14px] leading-[20px]">
                                        {option.label}
                                    </span>
                                    {role === option.value && <Check className="w-4 h-4 text-[#7C3AED]" />}
                                </div>
                                <span className="font-plus-jakarta text-[#71717A] text-[12px] leading-[18px]">
                                    {option.description}
                                </span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {errors.role && (
                    <p className="font-plus-jakarta flex items-center gap-1 mt-1 text-red-600 text-xs">
                        {errors.role}
                    </p>
                )}
            </div>


        </FormDialog>
    );
};

export default UserDialog;

