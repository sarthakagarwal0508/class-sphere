import { GoogleLogin } from "@react-oauth/google";

export default function GoogleButton({ mode, onSuccess, onError, disabled }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

  if (!clientId) {
    return (
      <p role="status" className="text-center text-xs text-muted">
        Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID and restart the app.
      </p>
    );
  }

  return (
    <div className={disabled ? "pointer-events-none w-full opacity-60" : "w-full"}>
      <GoogleLogin
        text={mode}
        theme="outline"
        size="large"
        shape="rectangular"
        width="320"
        onSuccess={onSuccess}
        onError={onError}
      />
    </div>
  );
}