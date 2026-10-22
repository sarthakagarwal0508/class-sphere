import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import FormField from "../../components/FormField";
import ServerWakeHint from "../../components/ServerWakeHint";
import { verifyOtpRequest, resendOtpRequest } from "../../services/authService";
import { isValidEmail } from "../../utils/validators";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;
const STORAGE_KEY = "classsphere_pending_email";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

const [email, setEmail] = useState(
    () => location.state?.email ?? sessionStorage.getItem(STORAGE_KEY) ?? ""
  );
  const hasEmail = Boolean(location.state?.email ?? sessionStorage.getItem(STORAGE_KEY));

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(
    location.state?.justSent ? "We sent a verification code to your email." : ""
  );
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(location.state?.justSent ? RESEND_SECONDS : 0);

  useEffect(() => {
    if (email) sessionStorage.setItem(STORAGE_KEY, email);
  }, [email]);

useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError("Enter the email you registered with.");
      return;
    }
    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code.`);
      return;
    }

    setLoading(true);
    setError("");
    setInfo("");
    try {
      await verifyOtpRequest({ email: email.trim(), otp });
      sessionStorage.removeItem(STORAGE_KEY);
      navigate("/login", { replace: true, state: { verified: true, email: email.trim() } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isValidEmail(email)) {
      setError("Enter the email you registered with.");
      return;
    }

    setResending(true);
    setError("");
    setInfo("");
    try {
      await resendOtpRequest({ email: email.trim() });
      setInfo("A new code has been sent to your email.");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout role="student">
      <h1 className="text-2xl font-extrabold">Verify your email</h1>
      <p className="mt-1 text-sm text-muted">
        {hasEmail ? (
          <>
            Enter the code sent to <span className="font-semibold text-ink">{email}</span>. It expires
            in 10 minutes.
          </>
        ) : (
          "Enter your email and the code we sent you. It expires in 10 minutes."
        )}
      </p>

      <form onSubmit={handleVerify} noValidate className="mt-5 space-y-3.5">
        {!hasEmail && (
          <FormField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <FormField
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={OTP_LENGTH}
          placeholder={`Enter ${OTP_LENGTH}-digit code`}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />

        {info && (
          <p
            role="status"
            className="rounded-xl bg-tone-green px-3 py-2 text-xs font-semibold text-tone-green-fg"
          >
            {info}
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-tone-red px-3 py-2 text-xs font-semibold text-tone-red-fg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-panel py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify email"}
        </button>
        <ServerWakeHint active={loading || resending} />
      </form>

      <div className="mt-4 text-center text-xs text-muted">
        Check your spam folder. Still no code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="font-bold text-ink hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
        >
          {resending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-muted">
        Already verified?{" "}
        <Link to="/login" className="font-bold text-ink hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
