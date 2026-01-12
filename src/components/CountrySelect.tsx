import { countries } from "@/lib"

interface CountrySelectProps {
  country: string
  setCountry: (country: string) => void
}

const CountrySelect = ({ country, setCountry }: CountrySelectProps) => {
  const selectedCountry = countries.find(c => c.code === country)
  
  return (
    <div className="flex items-center gap-2">
      <label 
        htmlFor="country-select" 
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Country:
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-base">
          {selectedCountry?.flag}
        </span>
        <select 
          id="country-select"
          className="pl-9 pr-8 py-1.5 text-sm border bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map(c => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default CountrySelect