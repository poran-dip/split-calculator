import { Github, Coffee } from "lucide-react"

const Footer = () => {
  return (
    <footer className="w-full py-3 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 gap-2 text-sm">
        <p>&copy; {new Date().getFullYear()} <span className="font-semibold">Poran Dip</span></p>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/poran-dip"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-neutral-600 hover:text-[hsl(194,100%,65%)] dark:text-neutral-400 dark:hover:text-[hsl(194,100%,65%)] transition-colors"
            aria-label="GitHub"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>

          <span className="text-neutral-300 dark:text-neutral-700">·</span>

          <a
            href="https://buymeacoffee.com/poran-dip"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-neutral-600 hover:text-[hsl(194,100%,65%)] dark:text-neutral-400 dark:hover:text-[hsl(194,100%,65%)] transition-colors"
            aria-label="Buy Me a Coffee"
          >
            <Coffee size={16} />
            <span>Buy Me a Coffee</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
