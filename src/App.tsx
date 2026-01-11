import { useState } from "react"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import CountrySelect from "./components/CountrySelect"
import SplitCalculator from "./components/SplitCalculator"

const App = () => {
  const [country, setCountry] = useState("india")

  return (
    <div className="min-h-screen flex flex-col bg-slate-200 dark:bg-slate-700 transition-all duration-150">
      <Navbar />
      <main className="grow container mx-auto p-4">
        <CountrySelect country={country} setCountry={setCountry} />
        <div>
          <SplitCalculator country={country} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
