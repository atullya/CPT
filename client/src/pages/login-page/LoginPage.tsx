import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cpt_logo_large from "@/assets/cpt_logo_extended.svg";
import sampleImage from "@/assets/login.svg";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useLoginMutation } from "@/store/auth/authApi";
import { loginSuccess } from "@/store/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const validateEmail = (value: string) => {
    if (!value) return "Email is required.";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return "Invalid email";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required.";
    return "";
  };

  const handleLogin = async () => {
    setSubmitted(true);

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) return;

    setIsSubmitting(true);
    try {
      const result = await login({ email, password }).unwrap();

      dispatch(loginSuccess(result));
      navigate("/homepage");
    } catch (err: unknown) {
      setIsSubmitting(false);

      const isErrorWithData = (
        e: unknown
      ): e is { data?: { message?: string } } =>
        typeof e === "object" && e !== null && "data" in e;

      const msg =
        isErrorWithData(err) && err.data?.message
          ? err.data.message.toLowerCase()
          : "";

      if (msg.includes("email")) setEmailError("Email not found");
      else if (msg.includes("password")) setPasswordError("Password not correct");
      else setPasswordError("Invalid email or password");
    }
  };

  const isFormFilled = email.trim() !== "" && password.trim() !== "";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isFormFilled && !isSubmitting) handleLogin();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#F9FAFB]" onKeyDown={handleKeyDown} tabIndex={0}>
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
              Login to your account
            </CardTitle>
            <CardDescription className="text-[14px] leading-6 font-plus-jakarta font-normal text-[#71717A] mt-1">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-4">
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
            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={(e) => {
                const val = e.target.value;
                setPassword(val);
                if (submitted) setPasswordError(validatePassword(val));
              }}
              error={submitted ? passwordError : ""}
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => navigate("/forgetPassword")}
              className="
                text-[#7C3AED] font-semibold text-sm text-left w-fit h-[22px] pb-1
                hover:border-b hover:border-[#7C3AED]
                active:text-[#5b2ac3]
                focus:outline-none focus:border-b focus:border-[#7C3AED]
                transition-all duration-200
              "
            >
              Forgot password?
            </button>

            <Button
              type="button"
              variant="purple"
              disabled={!isFormFilled}
              onClick={handleLogin}
              className="w-full text-[14px] font-semibold rounded-lg mt-4"
              style={(isLoading || isSubmitting) ? { pointerEvents: 'none' } : {}}
            >
              {(isLoading || isSubmitting) ? "Logging..." : "Log in"}
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

export default LoginPage;
