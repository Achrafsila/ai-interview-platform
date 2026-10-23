import type { Metadata } from "next";
import { LoginForm } from "@/components/ui/login-form";

export const metadata: Metadata = {
  title: "Connexion | Interview Platform",
  description: "Retrouvons votre espace de préparation aux entretiens.",
};

export default function LoginPage() {
  return <LoginForm />;
}
