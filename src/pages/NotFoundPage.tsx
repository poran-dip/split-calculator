import { Hop as Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 p-6 text-center">
        <div className="mb-4">
          <h1 className="text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">404</h1>
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Page Not Found</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
          <a
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[hsl(194,100%,65%)] hover:bg-[hsl(194,100%,55%)] text-white text-sm rounded transition-colors"
          >
            <Home size={16} />
            Go Home
          </a>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm rounded transition-colors"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
