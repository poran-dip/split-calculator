import { DollarSign, Percent, TrendingUp } from "lucide-react";
import { countries } from "@/lib";

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
  
  const taxAmount = total * taxRate;
  const totalWithTax = total + taxAmount;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Percent className="text-orange-500" size={18} />
          Tax Options
        </h4>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
          {(taxRate * 100).toFixed(1)}% {taxName}
        </span>
      </div>

      <button 
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105 ${
          taxApplied
            ? 'bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
            : 'bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
        }`}
        onClick={() => setTaxApplied(!taxApplied)}
      >
        {taxApplied ? (
          <>
            <TrendingUp size={18} className="rotate-180" />
            Remove Tax
          </>
        ) : (
          <>
            <TrendingUp size={18} />
            Apply {(taxRate * 100).toFixed(1)}% {taxName}
          </>
        )}
      </button>

      {taxApplied && (
        <div className="mt-4 p-4 bg-linear-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-200 dark:border-orange-700 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                Subtotal:
              </span>
              <span className="text-gray-800 dark:text-gray-100 font-semibold">
                {currency}{total.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {taxName} ({(taxRate * 100).toFixed(1)}%):
              </span>
              <span className="text-orange-600 dark:text-orange-400 font-semibold">
                +{currency}{taxAmount.toFixed(2)}
              </span>
            </div>
            <div className="pt-2 border-t-2 border-orange-300 dark:border-orange-600 flex items-center justify-between">
              <span className="text-gray-800 dark:text-gray-100 font-bold flex items-center gap-1">
                <DollarSign size={16} className="text-green-600 dark:text-green-400" />
                Total with Tax:
              </span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {currency}{totalWithTax.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyTax;
