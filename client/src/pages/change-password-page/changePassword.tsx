import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import cpt_logo_large from "@/assets/cpt_logo_extended.svg";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { AlertCircle } from "lucide-react";
import { useResetPasswordMutation } from "@/store/auth/authApi";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordRule } from "@/components/ui/PasswordRule";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<{ temp?: string; new?: string[]; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const passwordRules = [
    { label: "8 to 20 characters", check: (pw: string) => pw.length >= 8 && pw.length <= 20 },
    { label: "At least one uppercase letter", check: (pw: string) => /[A-Z]/.test(pw) },
    { label: "At least one lowercase letter", check: (pw: string) => /[a-z]/.test(pw) },
    { label: "At least one number", check: (pw: string) => /[0-9]/.test(pw) },
    { label: "At least one special character", check: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  ];

  const allRulesSatisfied = passwordRules.every((rule) => rule.check(newPassword));

  const validateForm = () => {
    const tempErrors: { temp?: string; new?: string[]; general?: string } = {};
    const newErrors: string[] = [];

    if (!token) tempErrors.general = "Invalid or expired link. Please request a new invite/reset email.";
    if (!temporaryPassword.trim()) tempErrors.temp = "Temporary password is required";
    if (newPassword === temporaryPassword && newPassword !== "") newErrors.push("Can't use previous password.");
    if (newErrors.length > 0) tempErrors.new = newErrors;

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm() || !allRulesSatisfied) return;

    setIsSubmitting(true);
    try {
      await resetPassword({ token, tempPassword: temporaryPassword, newPassword }).unwrap();
      navigate("/successPage");
    } catch (err: any) {
      setIsSubmitting(false);
      const message = err?.data?.message || "Reset password failed";
      if (message.toLowerCase().includes("temporary password")) setErrors(prev => ({ ...prev, temp: message }));
      else setErrors(prev => ({ ...prev, general: message }));
    }
  };

  const isFormFilled = Boolean(temporaryPassword && newPassword);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isFormFilled && !isSubmitting) handleChangePassword();
  };

  return (
    <div className="flex min-h-screen w-full bg-[#FFFFFF] flex-col items-center justify-center px-4 py-8">
      <div className="flex h-10 w-[165px] items-center justify-center gap-2 mb-6 sm:mb-8">

        <img
          src={cpt_logo_large}
          alt="Logo"
          className="w-full h-full object-contain"
        />


      </div>

      <Card
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-lg shadow-md flex flex-col items-center h-[530px] w-[386px] p-6 gap-6"
      >
        <CardHeader className="flex flex-col items-center text-center w-full max-w-[336px] gap-1 p-0">
          <CardTitle className="font-semibold text-2xl leading-7 text-[#18181B]">Change Password</CardTitle>
          <CardDescription className="text-sm leading-[22px] text-[#71717A] w-full">
            Your new password must be different to previously used passwords.
          </CardDescription>
        </CardHeader>

        {errors.general && (
          <div className="flex items-center gap-2 text-[#DC2626] text-sm bg-[#FEF2F2] border border-[#FECACA] rounded p-2 w-full max-w-[336px]">
            <AlertCircle className="shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <CardContent className="flex flex-col items-start justify-center gap-3 p-0">
          <PasswordInput
            id="temporarypassword"
            label="Temporary Password"
            value={temporaryPassword}
            onChange={(e) => setTemporaryPassword(e.target.value)}
            error={errors.temp}
            placeholder="Enter temporary password"
          />

          <PasswordInput
            id="newpassword"
            label="New Password"
            value={newPassword}
            onChange={(e) => {
              const value = e.target.value;
              setNewPassword(value);

              setErrors((prev) => {
                const updatedErrors = { ...prev };
                if (updatedErrors.new && updatedErrors.new.includes("Can't use previous password.") && value !== temporaryPassword) {
                  updatedErrors.new = updatedErrors.new.filter(
                    (msg) => msg !== "Can't use previous password."
                  );
                }
                return updatedErrors;
              });
            }}
            error={errors.new?.join(", ")}
            placeholder="Enter new password"
          />

          <div className="w-[338px] h-[155px] p-2 flex flex-col border border-[#E4E4E7] rounded-lg gap-2 mt-2">
            {passwordRules.map((rule, idx) => {
              const isValid = newPassword
                ? rule.check(newPassword)
                : null;
              return <PasswordRule key={idx} label={rule.label} isValid={isValid} />;
            })}
          </div>
        </CardContent>

        <CardFooter className="w-full p-0 ">
          <Button
            type="button"
            variant="purple"
            disabled={!isFormFilled}
            onClick={handleChangePassword}
            className="w-full text-[14px] font-semibold rounded-lg"
            style={(isLoading || isSubmitting) ? { pointerEvents: 'none' } : {}}
          >
            {(isLoading || isSubmitting) ? "Resetting..." : "Reset password"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
