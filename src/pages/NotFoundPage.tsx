import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-6 text-center">
        <div className="mb-4">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">404</h1>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">Page Not Found</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
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
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded transition-colors"
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
