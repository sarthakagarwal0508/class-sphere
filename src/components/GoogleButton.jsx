import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";

export default function GoogleButton({ 
  mode = "signin_with", 
  role, 
  onSuccess, 
  onError, 
  disabled 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

  if (!clientId) {
    return (
      <p role="status" className="text-center text-xs text-rose-500 py-2">
        Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID in .env and restart.
      </p>
    );
  }

  const handleSuccess = async (credentialResponse) => {
    try {
      // 1. Detect target role from:
      //    a) Explicit 'role' prop passed to <GoogleButton role={...} />
      //    b) URL query parameter (?role=teacher)
      //    c) Saved localStorage/sessionStorage from active login tab
      const queryParams = new URLSearchParams(location.search);
      const targetRole = (
        role ||
        queryParams.get("role") ||
        localStorage.getItem("selectedRole") ||
        localStorage.getItem("role") ||
        sessionStorage.getItem("role") ||
        "student"
      ).toLowerCase();

      // Persist chosen role so all guards & components recognize it
      localStorage.setItem("role", targetRole);

      // 2. Call parent onSuccess handler if provided
      if (typeof onSuccess === "function") {
        await onSuccess(credentialResponse, targetRole);
      }

      // 3. Update any saved user object in localStorage to reflect the correct role
      try {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
          const userObj = JSON.parse(rawUser);
          userObj.role = targetRole;
          localStorage.setItem("user", JSON.stringify(userObj));
        }
      } catch (err) {
        console.warn("Could not sync user role:", err);
      }

      // 4. Guaranteed role-based redirect
      setTimeout(() => {
        if (targetRole === "teacher") {
          navigate("/teacher/dashboard", { replace: true });
        } else {
          navigate("/student/dashboard", { replace: true });
        }
      }, 120);

    } catch (err) {
      console.error("Google Authentication Error:", err);
      if (typeof onError === "function") {
        onError(err);
      }
    }
  };

  return (
    <div className={`w-full flex justify-center items-center ${disabled ? "pointer-events-none opacity-60" : ""}`}>
      <GoogleLogin
        text={mode}
        theme="outline"
        size="large"
        shape="rectangular"
        width="320"
        onSuccess={handleSuccess}
        onError={onError || (() => console.error("Google Login Failed"))}
        useOneTap={false}
      />
    </div>
  );
}