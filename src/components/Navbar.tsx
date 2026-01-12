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
    <nav className="w-full bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-2.5 flex justify-between items-center">
        <a className="flex items-center gap-2 group" href="/">
          <Calculator className="h-5 w-5 text-green-600 dark:text-green-500" />
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Split Calculator</span>
        </a>
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 p-1.5 rounded transition-colors"
          aria-label="Toggle theme"
        >
          {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </nav>
  )
}



export default Navbar
