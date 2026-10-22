const KEY = "classsphere_tokens";

export const AUTH_EXPIRED_EVENT = "classsphere:auth-expired";

try {
  localStorage.removeItem("classsphere_auth");
} catch (error) {
  console.warn("Could not clear legacy authentication storage:", error);
}

export const tokenStorage = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch {
      return null;
    }
  },
  set(tokens) {
    localStorage.setItem(KEY, JSON.stringify(tokens));
  },
  clear() {
    localStorage.removeItem(KEY);
  },
};
