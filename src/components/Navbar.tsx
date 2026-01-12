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
    <nav className="w-full bg-linear-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 shadow-lg transition-all duration-150 border-b-2 border-slate-300 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a className="flex items-center gap-3 group" href="/">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-green-400 to-blue-500 rounded-xl blur group-hover:blur-lg transition-all duration-300"></div>
            <div className="relative bg-linear-to-br from-green-500 to-blue-600 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200">
              <Calculator className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-linear-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-150">
              Split Calculator
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Split bills effortlessly
            </span>
          </div>
        </a>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            className="relative text-gray-800 dark:text-gray-200 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 p-3 rounded-xl transition-all duration-200 hover:scale-110 group shadow-md hover:shadow-lg"
            aria-label="Toggle theme"
          >
            <div className="relative">
              {mode === "light" ? (
                <Moon className="group-hover:rotate-12 transition-transform duration-200" size={22} />
              ) : (
                <Sun className="group-hover:rotate-45 transition-transform duration-200" size={22} />
              )}
            </div>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
