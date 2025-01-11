"use client";

import { Auth } from "@supabase/auth-ui-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthForm() {
  const supabase = createClientComponentClient();
  const redirectTo = 
    typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "";

  return (
    <Auth
      supabaseClient={supabase}
      view="magic_link"
      showLinks={false}
      providers={[]}
      redirectTo={redirectTo}
      localization={{
        variables: {
          magic_link: {
            loading_button_label: 'Sending magic link... This may take a few minutes.',
          }
        }
      }}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: 'var(--chakra-colors-primary)',
              brandAccent: 'var(--chakra-colors-secondary)',
              brandButtonText: 'var(--chakra-colors-primaryContrast)'
            },
          },
        },
      }}
    />
  );
}
