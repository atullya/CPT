import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cpt_logo_large from "@/assets/cpt_logo_extended.svg";
import sampleImage from "@/assets/login.svg";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { useSendResetEmailMutation } from "@/store/auth/authApi";

interface ApiError {
  data?: {
    message?: string;
    error?: string;
  };
}

const ForgetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [sendResetEmail, { isLoading }] = useSendResetEmailMutation();

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const handleReset = async () => {
    setSubmitted(true);
    setGeneralError("");

    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    try {
      await sendResetEmail({ email }).unwrap();

      navigate("/emailPage", { state: { email } });
    } catch (error: unknown) {
      console.error(error);
      const e = error as ApiError;
      const msg =
        e?.data?.message ||
        e?.data?.error ||
        "Failed to send reset link. Please try again.";
      setGeneralError(msg);
    }
  };

  const handleBackToLogin = () => navigate("/login");

  const isFormFilled = email.trim() !== "";

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#F9FAFB]">
      <div className="h-screen md:w-1/2 w-full bg-[#FFFFFF] flex flex-col items-center justify-center px-4 md:px-0">
        <div className="flex h-10 w-[165px] items-center justify-center gap-2 mb-6 sm:mb-8">
          <img
            src={cpt_logo_large}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <Card className="w-full max-w-[384px] p-6 rounded-lg border border-[#E4E4E7] shadow-sm">
          <CardHeader className="text-center p-0 mb-6">
            <CardTitle className="text-[24px] leading-7 font-plus-jakarta font-semibold text-[#18181B]">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-[14px] leading-6 font-plus-jakarta font-normal text-[#71717A] mt-1 whitespace-nowrap">
              No worries, we will send you a reset password link.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-4">
            {generalError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-1">
                {generalError}
              </div>
            )}

            <TextInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                setEmail(val);
                if (submitted) setEmailError(validateEmail(val));
              }}
              error={submitted ? emailError : ""}
              placeholder="Enter email"
            />

            <Button
              type="button"
              variant="purple"
              disabled={!isFormFilled || isLoading}
              onClick={handleReset}
              className="w-full text-[14px] font-semibold rounded-lg mt-4"
            >
              {isLoading ? "Sending..." : "Reset password"}
            </Button>

            <Button
              type="button"
              variant="white"
              className="w-full text-[#000000] text-[14px] border border-[#E4E4E7] rounded-lg min-h-9 transition-all duration-0 hover:bg-[#00000008] hover:shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] active:shadow-[0px_0px_0px_3px_#C4B5FD] focus:shadow-[0px_0px_0px_3px_#C4B5FD]"
              onClick={handleBackToLogin}
            >
              Back to Log in
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="hidden md:flex w-full md:w-1/2 h-full bg-[#F4F4F5] flex-col items-center justify-center gap-10 px-4 md:px-12 py-6">
        <img
          src={sampleImage}
          alt="Sample"
          className="w-full max-w-md h-64 md:h-72 object-cover rounded-lg shadow-lg"
        />
        <div className="flex flex-col gap-3 w-full max-w-md text-center">
          <h3 className="text-2xl font-semibold text-[#111827]">
            Sign in to your account
          </h3>
          <p className="text-sm text-[#4B5563]">
            Sign in to track the candidate progress in the job.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
