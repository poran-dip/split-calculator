import { useState, useEffect } from "react"
import { Moon, Sun, Calculator } from "lucide-react"

const Navbar = () => {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    return document.documentElement.classList.contains("dark") ? "dark" : "light"
  })

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    localStorage.setItem("theme", mode)
  }, [mode])

  return (
    <nav className="w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-2.5 flex justify-between items-center">
        <a className="flex items-center gap-2 group" href="/">
          <Calculator className="h-5 w-5 text-[hsl(194,100%,65%)]" />
          <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Split Calculator</span>
        </a>
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 p-1.5 rounded transition-colors"
          aria-label="Toggle theme"
        >
          {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </nav>
  )
}



export default Navbar
