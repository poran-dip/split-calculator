const Footer = () => {
  return (
    <footer className="w-full py-4 bg-slate-300 dark:bg-slate-800 text-gray-800 dark:text-gray-200 border-t border-slate-400 dark:border-slate-900 transition-all duration-150">
      <div className="container mx-auto flex justify-between items-center px-4">
        <p>&copy; {new Date().getFullYear()} <span className="font-bold">Poran Dip</span></p>
        <div className="flex items-center gap-3">
            <a 
              href="https://github.com/poran-dip" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
              aria-label="GitHub"
            >
              <p>View on GitHub</p>
            </a>
            <span className="text-xl font-bold">·</span>
            <a 
              href="https://buymeacoffee.com/poran-dip" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-150"
              aria-label="Buy Me a Coffee"
            >
              <p>Buy Me a Coffee</p>
            </a>
          </div>
      </div>
    </footer>
  )
}

export default Footer
