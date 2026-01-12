import { countries } from "@/lib"

interface CountrySelectProps {
  country: string
  setCountry: (country: string) => void
}

const CountrySelect = ({ country, setCountry }: CountrySelectProps) => {
  const selectedCountry = countries.find(c => c.code === country)
  
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <label 
        htmlFor="country-select" 
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        Select Country:
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xl">
          {selectedCountry?.flag}
        </div>
        <select 
          id="country-select"
          className="w-full sm:w-64 pl-12 pr-10 py-2.5 border-2 bg-white dark:bg-slate-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 transition-all duration-150 rounded-lg shadow-sm hover:border-gray-400 dark:hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map(c => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default CountrySelect
