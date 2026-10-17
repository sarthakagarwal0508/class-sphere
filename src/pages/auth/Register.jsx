import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import FormField from "../../components/FormField";
import RoleToggle from "../../components/RoleToggle";
import GoogleButton from "../../components/GoogleButton";
import { useAuth } from "../../context/AuthContext";
import { getHomePath } from "../../utils/roleHome";
import { isValidEmail } from "../../utils/validators";

const MIN_PASSWORD = 8;

export default function Register() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (password.length < MIN_PASSWORD) {
      next.password = `Password must be at least ${MIN_PASSWORD} characters.`;
    }
    if (confirm !== password) next.confirm = "Passwords do not match.";

    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const user = await register({ name: name.trim(), email: email.trim(), password, role });
      navigate(getHomePath(user.role), { replace: true });
    } catch (err) {
      setFormError(err.message || "Could not create your account. Please try again.");
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
      setFormError(err.message || "Google sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout role={role}>
      <h1 className="text-2xl font-extrabold">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Join ClassSphere as a student or a teacher</p>

      <div className="mt-5">
        <RoleToggle value={role} onChange={setRole} />
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3.5">
        <FormField
          label="Full name"
          autoComplete="name"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

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
          autoComplete="new-password"
          placeholder="Create a password"
          hint={`At least ${MIN_PASSWORD} characters`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <FormField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
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
          {loading ? "Creating account..." : `Create ${role} account`}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleButton label="Sign up with Google" onClick={handleGoogle} disabled={loading} />

      <p className="mt-5 text-center text-xs text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-ink hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}