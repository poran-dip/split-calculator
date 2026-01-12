import { useEffect, useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RotateCcw, ShoppingCart, Trash, Upload, Users, X, FileJson, Receipt, DollarSign, Calculator } from "lucide-react";
import { countries, exportDataAsJSON, type Item, type Person } from "@/lib";
import { ApplyTax, InvoicePDF } from "@/components";

interface SplitCalculatorProps {
  country: string;
}

const SplitCalculator = ({ country }: SplitCalculatorProps) => {
  const [mounted, setMounted] = useState(false);
  const [showPeopleManager, setShowPeopleManager] = useState(false);
  
  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('splitCalculatorItems');
    return saved ? JSON.parse(saved) : [{ name: "", cost: 0, quantity: 0, splitAmong: [] }];
  });

  const [people, setPeople] = useState<Person[]>(() => {
    const saved = localStorage.getItem('splitCalculatorPeople');
    return saved ? JSON.parse(saved) : [{ name: "", owes: 0 }];
  });
  
  const [taxApplied, setTaxApplied] = useState(() => {
    const saved = localStorage.getItem('splitCalculatorTaxApplied');
    return saved ? JSON.parse(saved) : false;
  });

  const selectedCountry = countries.find(c => c.code === country);
  const currency = selectedCountry?.currency || "$";
  const taxRate = selectedCountry?.tax?.rate || 0;
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem('splitCalculatorItems', JSON.stringify(items));
    localStorage.setItem('splitCalculatorPeople', JSON.stringify(people));
    localStorage.setItem('splitCalculatorTaxApplied', JSON.stringify(taxApplied));
  }, [items, people, taxApplied, mounted]);

  const { subtotal, taxAmount, total, peopleWithOwes } = useMemo(() => {
    let subtotal = 0;
    const peopleMap = new Map(people.map(p => [p.name, 0]));
    
    items.forEach(item => {
      const itemTotal = item.cost * item.quantity;
      subtotal += itemTotal;
      if (item.splitAmong.length > 0) {
        const split = itemTotal / item.splitAmong.length;
        item.splitAmong.forEach(name => {
          peopleMap.set(name, (peopleMap.get(name) || 0) + split);
        });
      }
    });
    
    const taxAmount = taxApplied ? subtotal * (taxRate / 100) : 0;
    const total = subtotal + taxAmount;
    
    // Apply tax proportionally to each person's share
    const peopleWithOwes = people.map(p => {
      const baseOwes = peopleMap.get(p.name) || 0;
      const owesWithTax = taxApplied ? baseOwes * (1 + taxRate / 100) : baseOwes;
      return { ...p, owes: owesWithTax };
    });
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      peopleWithOwes
    };
  }, [items, people, taxApplied, taxRate]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset everything? This cannot be undone.')) {
      setItems([{ name: "", cost: 0, quantity: 0, splitAmong: [] }]);
      setPeople([{ name: "", owes: 0 }]);
      setTaxApplied(false);
      setShowPeopleManager(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
      {/* Left Panel - Items & People */}
      <div className="lg:w-3/5 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-all duration-150">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShoppingCart className="text-green-500" size={28} />
            Items & People
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            onClick={() => setItems([...items, { name: "", cost: 0, quantity: 0, splitAmong: [] }])}
          >
            <ShoppingCart size={18} />
            Add Item ({items.length})
          </button>
          
          <button
            onClick={() => setShowPeopleManager(!showPeopleManager)}
            className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <Users size={18} />
            Manage People ({people.length})
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          
          <label 
            htmlFor="jsonUpload"
            className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
          >
            <Upload size={18} />
            Upload JSON
          </label>
          <input
            type="file"
            id="jsonUpload"
            accept=".json,application/json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const json = JSON.parse(event.target?.result as string);
                  if (json.items && json.people && typeof json.total === "number" && typeof json.taxApplied === "boolean") {
                    setItems(json.items);
                    setPeople(json.people);
                    setTaxApplied(json.taxApplied);
                  } else {
                    alert("Invalid JSON structure.");
                  }
                } catch (error) {
                  alert("Error parsing JSON file.");
                }
              };
              reader.readAsText(file);
              e.target.value = '';
            }}
            className="hidden"
          />
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto flex-1 pr-2 space-y-4">
          {/* People Manager */}
          {showPeopleManager && (
            <div className="p-5 bg-linear-to-br from-purple-50 to-purple-100 dark:from-slate-700 dark:to-slate-600 border-2 border-purple-200 dark:border-purple-500 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Users className="text-purple-600 dark:text-purple-400" size={24} />
                  People Manager
                </h3>
                <div className="flex items-center gap-3">
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all transform hover:scale-105"
                    onClick={() => setPeople([...people, { name: "", owes: 0 }])}
                  >
                    Add Person
                  </button>
                  <button
                    onClick={() => setShowPeopleManager(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-500 rounded-lg transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {people.map((person, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => {
                        const newPeople = [...people];
                        newPeople[index].name = e.target.value;
                        setPeople(newPeople);
                      }}
                      placeholder={`Enter person's name`}
                      className="flex-1 px-4 py-2.5 border-2 bg-slate-50 dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-150"
                    />
                    <button
                      onClick={() => setPeople(people.filter((_, i) => i !== index))}
                      className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                      aria-label="Remove person"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                ))}
                
                {people.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="mx-auto text-gray-400 mb-2" size={48} />
                    <p className="text-gray-500 dark:text-gray-400">
                      No people added yet. Click "Add Person" to get started.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="p-5 bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 border-2 border-gray-200 dark:border-slate-500 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Item {index + 1}
                    </h4>
                  </div>
                  <button
                    onClick={() => setItems(items.filter((_, i) => i !== index))}
                    className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                    aria-label="Remove item"
                  >
                    <Trash size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].name = e.target.value;
                        setItems(newItems);
                      }}
                      placeholder="e.g., Pizza, Coffee, Movie Tickets"
                      className="w-full px-4 py-2.5 border-2 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-150"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Cost ({currency})
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
                          {currency}
                        </span>
                        <input
                          type="number"
                          value={item.cost || ''}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].cost = parseFloat(e.target.value) || 0;
                            setItems(newItems);
                          }}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full pl-8 pr-4 py-2.5 border-2 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-150"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].quantity = parseInt(e.target.value) || 0;
                          setItems(newItems);
                        }}
                        placeholder="1"
                        min="1"
                        className="w-full px-4 py-2.5 border-2 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-150"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Split Among
                      </label>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.splitAmong.length} selected
                      </span>
                    </div>
                    {people.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {people.map((person, personIndex) => (
                          <button
                            key={personIndex}
                            type="button"
                            onClick={() => {
                              const newItems = [...items];
                              if (item.splitAmong.includes(person.name)) {
                                newItems[index].splitAmong = newItems[index].splitAmong.filter(p => p !== person.name);
                              } else {
                                newItems[index].splitAmong = [...newItems[index].splitAmong, person.name];
                              }
                              setItems(newItems);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                              item.splitAmong.includes(person.name)
                                ? 'bg-linear-to-r from-green-500 to-green-600 text-white shadow-md'
                                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                            }`}
                          >
                            {person.name || `Person ${personIndex + 1}`}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Add people first to split this item
                      </p>
                    )}
                  </div>

                  {item.cost > 0 && item.quantity > 0 && (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Item Total:
                      </span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {currency}{(item.cost * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Summary */}
      <div className="lg:w-2/5 flex flex-col bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 rounded-xl shadow-lg p-6 transition-all duration-150">
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="text-blue-600 dark:text-blue-400" size={28} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Summary
          </h2>
        </div>

        <div className="space-y-6 flex-1">
          {/* Cost Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <DollarSign className="text-green-500" size={20} />
              Cost Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {currency}{subtotal.toFixed(2)}
                </span>
              </div>
              {taxApplied && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-300">
                    Tax ({taxRate}%):
                  </span>
                  <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                    {currency}{taxAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Total:
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {currency}{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* People's Share */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Users className="text-purple-500" size={20} />
              Individual Shares
            </h3>
            {peopleWithOwes.length > 0 && peopleWithOwes.some(p => p.name) ? (
              <div className="space-y-3">
                {peopleWithOwes.map((person, index) => (
                  person.name && (
                    <div key={index} className="flex justify-between items-center p-3 bg-linear-to-r from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {person.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-100">
                          {person.name}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {currency}{person.owes.toFixed(2)}
                      </span>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="mx-auto text-gray-400 mb-2" size={40} />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Add people and assign items to see individual shares
                </p>
              </div>
            )}
          </div>

          {/* Tax Toggle */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md">
            <ApplyTax country={country} total={total} taxApplied={taxApplied} setTaxApplied={setTaxApplied} />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <PDFDownloadLink
              document={
                <InvoicePDF
                  items={items}
                  people={people}
                  total={total}
                  taxApplied={taxApplied}
                  currency={currency}
                />
              }
              fileName="split-invoice.pdf"
              className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Receipt size={20} />
              Generate Invoice PDF
            </PDFDownloadLink>

            <button 
              className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              onClick={() => exportDataAsJSON(items, people, total, taxApplied)}
            >
              <FileJson size={20} />
              Export as JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitCalculator;
