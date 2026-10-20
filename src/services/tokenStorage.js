const KEY = "classsphere_tokens";

// Jab access/refresh token dono kharab ho jayein to api.js ye event bhejta hai,
// aur AuthContext user ko logout kar deta hai.
export const AUTH_EXPIRED_EVENT = "classsphere:auth-expired";

// Purane mock login ka data hata do (ab iski zarurat nahi)
try {
  localStorage.removeItem("classsphere_auth");
} catch {
  // storage band ho to koi baat nahi
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