
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { verifyOtpRequest, resendOtpRequest } from "../../services/authService";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    setLoading(true);

    try {
      await verifyOtpRequest({ email: cleanEmail, otp: otp.trim() });
      navigate("/login", {
        replace: true,
        state: { email: cleanEmail, message: "Email verified! Please log in." },
      });
    } catch (err) {
      setError(err.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setResending(true);

    try {
      await resendOtpRequest({ email: email.trim() });
      setMessage("A new OTP has been requested. Check your email.");
      setCooldown(60);
    } catch (err) {
      setError(err.message || "Could not resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout role="student">
      <h1 className="text-2xl font-extrabold">Verify your email</h1>
      <p className="mt-1 text-sm text-muted">
        Enter the OTP sent to your registered email address.
      </p>

      <form onSubmit={handleVerify} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="otp-email" className="mb-1 block text-sm font-semibold">
            Email
          </label>
          <input
            id="otp-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@college.edu"
            className="w-full rounded-xl border border-line bg-transparent px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-panel"
            required
          />
        </div>

        <div>
          <label htmlFor="otp-code" className="mb-1 block text-sm font-semibold">
            Verification OTP
          </label>
          <input
            id="otp-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="Enter OTP"
            className="w-full rounded-xl border border-line bg-transparent px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-panel"
            required
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-tone-red px-3 py-2 text-xs font-semibold text-tone-red-fg">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="rounded-xl px-3 py-2 text-xs font-semibold">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-panel py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify email"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleResend}
        disabled={resending || cooldown > 0}
        className="mt-4 w-full text-sm font-semibold text-ink hover:underline disabled:cursor-not-allowed disabled:opacity-60"
      >
        {resending
          ? "Requesting OTP..."
          : cooldown > 0
            ? `Resend OTP in ${cooldown}s`
            : "Resend OTP"}
      </button>

      <p className="mt-5 text-center text-xs text-muted">
        Already verified?{" "}
        <Link to="/login" className="font-bold text-ink hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
