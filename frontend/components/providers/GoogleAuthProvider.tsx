"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  // Get the Google Client ID from environment variables
  // Use a dummy value if not set to prevent build errors
  // The actual Google login will fail gracefully with an error message
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy-client-id-for-build";

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    console.warn("⚠️ NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google OAuth will not work.");
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}

