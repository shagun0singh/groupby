"use client";

import { AuthUI } from "@/components/ui/auth-fuse";

export default function AuthDemoPage() {
  return (
    <AuthUI 
      signInContent={{
        image: {
          src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
          alt: "Custom sign-in background"
        },
        quote: {
          text: "Welcome back to GroupBy - Connect, Plan, and Celebrate Together!",
          author: "GroupBy Team"
        }
      }}
      signUpContent={{
        image: {
          src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
          alt: "Custom sign-up background"
        },
        quote: {
          text: "Join our community and start organizing amazing events today!",
          author: "GroupBy Team"
        }
      }}
    />
  );
}

