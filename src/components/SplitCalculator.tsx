import { useEffect, useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RotateCcw, ShoppingCart, Trash, Upload, Users, X, Download, FileJson } from "lucide-react";
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
    
    const taxAmount = taxApplied ? subtotal * taxRate : 0;
    const total = subtotal + taxAmount;
    
    const peopleWithOwes = people.map(p => {
      const baseOwes = peopleMap.get(p.name) || 0;
      const owesWithTax = taxApplied ? baseOwes * (1 + taxRate) : baseOwes;
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
    if (window.confirm('Are you sure you want to reset everything?')) {
      setItems([{ name: "", cost: 0, quantity: 0, splitAmong: [] }]);
      setPeople([{ name: "", owes: 0 }]);
      setTaxApplied(false);
      setShowPeopleManager(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 flex-1 lg:overflow-hidden">
      {/* Left Panel */}
      <div className="lg:w-3/5 flex flex-col bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-gray-700 lg:max-h-full lg:overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Items & People</h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50">
          <div className="flex gap-2">
            <button 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
              onClick={() => setItems([...items, { name: "", cost: 0, quantity: 0, splitAmong: [] }])}
            >
              <ShoppingCart className="hidden sm:block" size={16} />
              Add Item ({items.length})
            </button>
            
            <button
              onClick={() => setShowPeopleManager(!showPeopleManager)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
            >
              <Users className="hidden sm:block" size={16} />
              People ({people.length})
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              <RotateCcw className="hidden sm:block" size={16} />
              Reset
            </button>
          </div>
          
          <label 
            htmlFor="jsonUpload"
            className="ml-auto max-w-80 sm:max-w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors cursor-pointer"
          >
            <Upload size={16} />
            Upload
          </label>
          <input
            type="file"
            id="jsonUpload"
            accept=".json"
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
        <div className="overflow-y-auto lg:flex-1 p-4 space-y-3 lg:max-h-[calc(100vh-220px)]">
          {/* People Manager */}
          {showPeopleManager && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Manage People</h3>
                <div className="flex items-center gap-2">
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1 text-sm rounded transition-colors"
                    onClick={() => setPeople([...people, { name: "", owes: 0 }])}
                  >
                    Add Person
                  </button>
                  <button
                    onClick={() => setShowPeopleManager(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {people.map((person, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-6">{index + 1}.</span>
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => {
                        const newPeople = [...people];
                        newPeople[index].name = e.target.value;
                        setPeople(newPeople);
                      }}
                      placeholder="Person name"
                      className="flex-1 px-2 py-1.5 text-sm border bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => setPeople(people.filter((_, i) => i !== index))}
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
                
                {people.length === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                    No people added yet
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Items List */}
          {items.map((item, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-gray-700 rounded">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Item {index + 1}</span>
                <button
                  onClick={() => setItems(items.filter((_, i) => i !== index))}
                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash size={14} />
                </button>
              </div>

              <div className="flex flex-col sm:grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].name = e.target.value;
                    setItems(newItems);
                  }}
                  placeholder="Item name"
                  className="w-full px-2 py-1.5 text-sm border bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={item.cost || ''}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].cost = parseFloat(e.target.value) || 0;
                      setItems(newItems);
                    }}
                    placeholder={`Cost (${currency})`}
                    step="0.01"
                    className="px-2 py-1.5 text-sm border bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  
                  <input
                    type="number"
                    value={item.quantity || ''}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].quantity = parseInt(e.target.value) || 0;
                      setItems(newItems);
                    }}
                    placeholder="Qty"
                    min="1"
                    className="px-2 py-1.5 text-sm border bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                {people.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Split among ({item.splitAmong.length} selected)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
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
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            item.splitAmong.includes(person.name)
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          {person.name || `Person ${personIndex + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {item.cost > 0 && item.quantity > 0 && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                  Subtotal: <span className="font-semibold text-gray-900 dark:text-gray-100">{currency}{(item.cost * item.quantity).toFixed(2)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="lg:w-2/5 flex flex-col bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-gray-700 lg:max-h-full lg:overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Summary</h2>
        </div>

        <div className="flex-1 overflow-y-auto lg:max-h-[calc(100vh-220px)] p-4 space-y-3">
          {/* Cost Breakdown */}
          <div className="p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-gray-700 rounded">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Costs</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{currency}{subtotal.toFixed(2)}</span>
              </div>
              {taxApplied && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax ({taxRate * 100}%):</span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">{currency}{taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1.5 border-t border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Total:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{currency}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* People's Share */}
          <div className="p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-gray-700 rounded">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Individual Shares</h3>
            {peopleWithOwes.length > 0 && peopleWithOwes.some(p => p.name) ? (
              <div className="space-y-1.5 text-sm">
                {peopleWithOwes.map((person, index) => (
                  person.name && (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{person.name}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{currency}{person.owes.toFixed(2)}</span>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                Add people and items to see shares
              </p>
            )}
          </div>

          {/* Tax Toggle */}
          <ApplyTax country={country} total={total} taxApplied={taxApplied} setTaxApplied={setTaxApplied} />

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <PDFDownloadLink
              document={
                <InvoicePDF
                  items={items}
                  people={peopleWithOwes}
                  total={total}
                  taxApplied={taxApplied}
                  currency={currency}
                />
              }
              fileName="split-invoice.pdf"
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded transition-colors"
            >
              <Download size={16} />
              Download PDF
            </PDFDownloadLink>

            <button 
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded transition-colors"
              onClick={() => exportDataAsJSON(items, peopleWithOwes, total, taxApplied)}
            >
              <FileJson size={16} />
              Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitCalculator;
