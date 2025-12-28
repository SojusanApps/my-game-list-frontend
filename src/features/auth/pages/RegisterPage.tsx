import * as React from "react";

import AppLogo from "@/components/ui/AppLogo";
import RegisterForm from "../components/RegisterForm";
import { PageMeta } from "@/components/ui/PageMeta";

export default function RegisterPage(): React.JSX.Element {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background-200 relative overflow-hidden">
      <PageMeta title="Register" />

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full transform -scale-x-100 bg-cover bg-center opacity-10 blur-xs -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 animate-in fade-in zoom-in duration-500">
        <div className="mb-8">
          <AppLogo classNameSojusan="text-primary-600 text-3xl" classNameGameList="text-text-900 text-4xl" />
          <p className="text-center text-text-500 mt-2">Join our community and start tracking your games.</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
