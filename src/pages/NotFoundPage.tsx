import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="mb-4">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2">404</h1>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Page Not Found</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
          <a
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            <Home size={16} />
            Go Home
          </a>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-100 text-sm rounded transition-colors"
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
