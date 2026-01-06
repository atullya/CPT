import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAppSelector } from "../store/hooks";

import LoginPage from "../pages/login-page/LoginPage";
import Dashboard from "../pages/home-page/Dashboard";
import AppLayout from "../layouts/AppLayout";
import { Outlet } from "react-router-dom";

import CandidatePage from "../pages/candidate-page/Candidate";
import JobListingPage from "../pages/job-form/JobListingPage";
import ForgetPasswordPage from "@/pages/forgot-password-page/forgetPassword";
import EmailPage from "@/pages/forgot-password-page/emailPage";
import NewPasswordPage from "@/pages/forgot-password-page/newPassword";
import PasswordSuccessPage from "@/pages/change-password-page/successPage";
import ChangePasswordPage from "@/pages/change-password-page/changePassword";
import Users from "@/pages/users/users";

const AppRoutes = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/src/pages/home-page/dashboard.tsx" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgetPassword" element={<ForgetPasswordPage />} />
      <Route path="/emailPage" element={<EmailPage />} />
      <Route path="/newPassword" element={<NewPasswordPage />} />
      <Route path="/successPage" element={<PasswordSuccessPage />} />
      <Route path="/changePassword" element={<ChangePasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <AppLayout>
              <Outlet />
            </AppLayout>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<JobListingPage />} />
          <Route path="/users" element={<Users />} />
        </Route>
        <Route path="/candidates" element={<CandidatePage />} />
      </Route>
      <Route path="/changePassword" element={<ChangePasswordPage />} />

      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
};

export default AppRoutes;
