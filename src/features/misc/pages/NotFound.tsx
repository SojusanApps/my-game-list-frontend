import * as React from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/ui/PageMeta";
import { Button } from "@/components/ui/Button";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-background-200 relative overflow-hidden">
      <PageMeta title="404 - Not Found" />

      {/* Background decoration */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

      <div className="max-w-md w-full mx-4 text-center bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-xl border border-white/50 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-9xl font-extrabold text-primary-600 mb-4 tracking-tighter">404</div>
        <h1 className="text-3xl font-bold text-text-900 mb-4">Oops! Page Not Found</h1>
        <p className="text-lg text-text-600 mb-8 leading-relaxed">
          Lost in the adventure? No worries! Let&apos;s head back home together and continue your quest.
        </p>
        <Link to="/home">
          <Button size="lg" className="px-10">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
