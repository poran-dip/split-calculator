import { Github, Coffee } from "lucide-react"

const Footer = () => {
  return (
    <footer className="w-full py-6 bg-linear-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-gray-800 dark:text-gray-200 border-t-2 border-slate-300 dark:border-slate-700 shadow-inner transition-all duration-150">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()}
          </p>
          <span className="text-lg font-bold bg-linear-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
            Poran Dip
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/poran-dip" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 dark:from-gray-600 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            aria-label="GitHub"
          >
            <Github size={18} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          
          <a 
            href="https://buymeacoffee.com/poran-dip" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            aria-label="Buy Me a Coffee"
          >
            <Coffee size={18} />
            <span className="hidden sm:inline">Buy Me a Coffee</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
