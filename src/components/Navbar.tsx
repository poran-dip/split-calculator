import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

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
    <nav className="w-full bg-slate-300 dark:bg-slate-800 shadow-md transition-all duration-150">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a className="flex items-center gap-2 group" href="/">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2 group-hover:scale-105 transition-all duration-200" />
          <div className="text-xl font-semibold text-gray-800 dark:text-gray-200 group-hover:scale-105 transition-all duration-150">Split Calculator</div>
        </a>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            className="text-gray-800 dark:text-gray-200 hover:bg-gray-400/40 dark:hover:bg-gray-600/40 p-2 rounded-lg transition-all duration-150"
          >
            {mode === "light" ? (
              <Moon />
            ) : (
              <Sun />
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
