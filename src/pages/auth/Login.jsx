import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import FormField from "../../components/FormField";
import RoleToggle from "../../components/RoleToggle";
import GoogleButton from "../../components/GoogleButton";
import { useAuth } from "../../context/AuthContext";
import { getHomePath } from "../../utils/roleHome";
import { isValidEmail } from "../../utils/validators";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = {};
    if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";

    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const user = await login({ email: email.trim(), password, role });
      navigate(getHomePath(user.role), { replace: true });
    } catch (err) {
      setFormError(err.message || "Could not log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setFormError("");
    setLoading(true);
    try {
      const user = await loginWithGoogle(role);
      navigate(getHomePath(user.role), { replace: true });
    } catch (err) {
      setFormError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout role={role}>
      <h1 className="text-2xl font-extrabold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Login to your ClassSphere account</p>

      <div className="mt-5">
        <RoleToggle value={role} onChange={setRole} />
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3.5">
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {formError && (
          <p role="alert" className="rounded-xl bg-tone-red px-3 py-2 text-xs font-semibold text-tone-red-fg">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-panel py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : `Login as ${role}`}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleButton label="Continue with Google" onClick={handleGoogle} disabled={loading} />

      <p className="mt-5 text-center text-xs text-muted">
        New here?{" "}
        <Link to="/register" className="font-bold text-ink hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}