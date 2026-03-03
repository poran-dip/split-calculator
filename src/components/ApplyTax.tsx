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
    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tax</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">{(taxRate * 100).toFixed(1)}% {taxName}</span>
      </div>

      <button
        className={`w-full px-3 py-1.5 text-sm rounded transition-colors ${
          taxApplied
            ? 'bg-slate-600 hover:bg-slate-700 text-white'
            : 'bg-[hsl(194,100%,65%)] hover:bg-[hsl(194,100%,55%)] text-white'
        }`}
        onClick={() => setTaxApplied(!taxApplied)}
      >
        {taxApplied ? 'Remove Tax' : `Apply ${(taxRate * 100).toFixed(1)}% ${taxName}`}
      </button>

      {taxApplied && (
        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal:</span>
            <span>{currency}{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>{taxName} ({(taxRate * 100).toFixed(1)}%):</span>
            <span className="text-[hsl(194,100%,65%)]">+{currency}{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-100 pt-1 border-t border-slate-200 dark:border-slate-700">
            <span>Total with Tax:</span>
            <span>{currency}{totalWithTax.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyTax;
