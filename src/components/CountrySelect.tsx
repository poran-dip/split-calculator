import { countries } from "@/lib/countries"

interface CountrySelectProps {
  country: string
  setCountry: (country: string) => void
}

const CountrySelect = ({ country, setCountry }: CountrySelectProps) => {
  return (
    <select 
      className="border bg-slate-100 dark:bg-slate-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 transition-all duration-150 rounded-md p-1"
      value={country}
      onChange={(e) => setCountry(e.target.value)}
    >
      {countries.map(c => (
        <option key={c.code} value={c.code}>
          {c.flag} {c.name}
        </option>
      ))}
    </select>
  )
}

export default CountrySelect
