import { countries } from "@/lib/countries";

interface ApplyTaxProps {
  country: string;
  total: number;
  taxApplied: boolean;
  setTaxApplied: (applied: boolean) => void;
}

const ApplyTax = ({ country, total, taxApplied, setTaxApplied }: ApplyTaxProps) => {  
  const selectedCountry = countries.find(c => c.code === country);
  const taxRate = selectedCountry?.tax?.rate || 0;
  const taxName = selectedCountry?.tax?.name || "Tax";
  const currency = selectedCountry?.currency || "$";

  return (
    <div className="w-full p-4 border bg-slate-100 dark:bg-slate-600 border-gray-300 dark:border-gray-500 transition-all duration-150 rounded-md">
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={() => setTaxApplied(!taxApplied)}
      >
        {!taxApplied ? 
          <p>Apply {(taxRate * 100).toFixed(0)}% {taxName}</p>
          : <p>Remove Tax</p>
        }
      </button>
      <p className="mt-2 text-slate-900 dark:text-slate-100 transition-all duration-150">
        Total after {taxName}: {currency}{(total + total * taxRate).toFixed(2)}
      </p>
    </div>
  )
}

export default ApplyTax
