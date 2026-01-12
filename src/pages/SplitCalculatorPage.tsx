import { useState } from "react"
import { Navbar, Footer, CountrySelect, SplitCalculator } from "@/components"

const App = () => {
  const [country, setCountry] = useState("india")

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <main className="grow lg:min-h-0 container mx-auto flex flex-col gap-3 p-3">
        <CountrySelect country={country} setCountry={setCountry} />
        <SplitCalculator country={country} />
      </main>
      <Footer />
    </div>
  )
}

export default App
