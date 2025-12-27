import * as React from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/ui/PageMeta";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="bg-[url('/src/assets/images/Background404.jpg')] bg-fixed bg-cover bg-center bg-no-repeat flex items-center justify-center min-h-screen">
      <PageMeta title="404 - Not Found" />
      <div className="max-w-md mx-auto text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <div className="text-9xl font-bold text-secondary-950 mb-4">404</div>
        <h1 className="text-4xl font-bold text-text-800 mb-6">Oops! Page Not Found</h1>
        <p className="text-lg text-text-500 mb-8">
          Lost in the adventure? No worries! Let&apos;s head back home together.
          <br />
          <br />
          Click the link below to return to familiar territory and continue your quest. Safe travels!
        </p>
        <Link
          to="/home"
          className="inline-block bg-primary-900 text-white font-semibold px-6 py-3 rounded-md hover:bg-primary-950 transition-colors duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
