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
// import { useResetPasswordMutation } from "@/store/auth/authApi";
import { useResetPasswordEmailMutation } from "@/store";
import { PasswordRule } from "@/components/ui/PasswordRule";
import { PasswordInput } from "@/components/ui/PasswordInput";

const NewPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const id = searchParams.get("id") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    general?: string;
    new?: string;
    confirm?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordEmailMutation();

  const passwordRules = [
    {
      label: "8 to 20 characters",
      check: (pw: string) => pw.length >= 8 && pw.length <= 20,
    },
    {
      label: "At least one uppercase letter",
      check: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: "At least one lowercase letter",
      check: (pw: string) => /[a-z]/.test(pw),
    },
    { label: "At least one number", check: (pw: string) => /[0-9]/.test(pw) },
    {
      label: "At least one special character",
      check: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    },
  ];

  const allRulesSatisfied = passwordRules.every((rule) =>
    rule.check(newPassword)
  );

  const validateForm = () => {
    const tempErrors: { general?: string; new?: string; confirm?: string } = {};

    if (!token)
      tempErrors.general =
        "Invalid or expired link. Please request a new password reset.";
    if (!newPassword.trim()) tempErrors.new = "New password is required.";
    else if (!allRulesSatisfied)
      tempErrors.new = "Password does not meet all rules.";

    if (!confirmPassword.trim())
      tempErrors.confirm = "Confirm password is required.";
    else if (confirmPassword !== newPassword)
      tempErrors.confirm = "Passwords do not match.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await resetPassword({
        token,
        id,
        password: newPassword,
      }).unwrap();
      navigate("/successPage");
    } catch (err: unknown) {
      setIsSubmitting(false);

      const isErrorWithData = (
        e: unknown
      ): e is { data?: { message?: string } } =>
        typeof e === "object" && e !== null && "data" in e;

      const message =
        isErrorWithData(err) && err.data?.message
          ? err.data.message
          : "Reset password failed";

      setErrors({ general: message });
    }
  };

  const isFormFilled = Boolean(newPassword && confirmPassword);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isFormFilled && !isSubmitting)
      handleChangePassword();
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
          <CardTitle className="font-semibold text-2xl leading-7 text-[#18181B]">
            Set new password
          </CardTitle>
          <CardDescription className="text-sm leading-[22px] text-[#71717A] w-full">
            Your new password must be different from previously used passwords.
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
            id="newPassword"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.new}
            placeholder="Enter new password"
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirm}
            placeholder="Enter your new password"
          />

          <div className="w-[338px] h-[155px] p-2 flex flex-col border border-[#E4E4E7] rounded-lg gap-2 mt-2">
            {passwordRules.map((rule, idx) => {
              const isValid = newPassword ? rule.check(newPassword) : null;
              return (
                <PasswordRule key={idx} label={rule.label} isValid={isValid} />
              );
            })}
          </div>
        </CardContent>

        <CardFooter className="w-full p-0 ">
          <Button
            type="button"
            variant="purple"
            disabled={!isFormFilled || isSubmitting || isLoading}
            onClick={handleChangePassword}
            className="w-full text-[14px] font-semibold rounded-lg"
          >
            {isSubmitting || isLoading ? "Updating..." : "Update password"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewPasswordPage;

