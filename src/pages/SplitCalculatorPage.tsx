import { CountrySelect, Footer, Navbar, SplitCalculator } from "@/components"
import { useState } from "react"

const SplitCalculatorPage = () => {
  const [country, setCountry] = useState("india")

  return (
    <div className="min-h-screen flex flex-col bg-slate-200 dark:bg-slate-700 transition-all duration-150">
      <Navbar />
      <main className="grow container flex flex-col gap-4 mx-auto p-4">
        <CountrySelect country={country} setCountry={setCountry} />
        <SplitCalculator country={country} />
      </main>
      <Footer />
    </div>
  )
}

export default SplitCalculatorPage
