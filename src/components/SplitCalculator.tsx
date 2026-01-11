import { useEffect, useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RotateCcw, ShoppingCart, Trash, Upload, Users, X } from "lucide-react";
import { countries, exportDataAsJSON, type Item, type Person } from "@/lib";
import { ApplyTax, InvoicePDF } from "@/components";

interface SplitCalculatorProps {
  country: string;
}

const SplitCalculator = ({ country }: SplitCalculatorProps) => {
  const [mounted, setMounted] = useState(false);
  const [showPeopleManager, setShowPeopleManager] = useState(false)
  
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
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem('splitCalculatorItems', JSON.stringify(items));
    localStorage.setItem('splitCalculatorPeople', JSON.stringify(people));
    localStorage.setItem('splitCalculatorTaxApplied', JSON.stringify(taxApplied));
  }, [items, people, taxApplied]);

  const { total, peopleWithOwes } = useMemo(() => {
    let total = 0;
    const peopleMap = new Map(people.map(p => [p.name, 0]));
    
    items.forEach(item => {
      const itemTotal = item.cost * item.quantity;
      total += itemTotal;
      if (item.splitAmong.length > 0) {
        const split = itemTotal / item.splitAmong.length;
        item.splitAmong.forEach(name => {
          peopleMap.set(name, (peopleMap.get(name) || 0) + split);
        });
      }
    });
    
    return {
      total: parseFloat(total.toFixed(2)),
      peopleWithOwes: people.map(p => ({ ...p, owes: peopleMap.get(p.name) || 0 }))
    };
  }, [items, people]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-1/2 flex flex-col p-2 border-r-2 border-gray-300 dark:border-gray-500 transition-all duration-150">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-all duration-150 mb-4">Costs and People</h2>
        <div className="overflow-y-auto flex-1 max-h-[calc(100vh-250px)]">
          <div className="mb-4 flex gap-2">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              onClick={() => setItems([...items, { name: "", cost: 0, quantity: 0, splitAmong: [] }])}
            >
              <ShoppingCart size={18} />
              Add Item ({items.length})
            </button>
            <button
              onClick={() => setShowPeopleManager(!showPeopleManager)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
            >
              <Users size={18} />
              Manage People ({people.length})
            </button>
            
            <button
              onClick={() => {
                setItems([{ name: "", cost: 0, quantity: 0, splitAmong: [] }]);
                setPeople([{ name: "", owes: 0 }]);
                setTaxApplied(false);
                setShowPeopleManager(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              <RotateCcw size={18} />
              Reset
            </button>
            <label 
              htmlFor="jsonUpload"
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors cursor-pointer"
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
              }}
              className="hidden"
            />
          </div>
          <div className="mb-6">
            {showPeopleManager && (
              <div className="mt-4 p-4 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">People</h3>
                  <div className="flex items-center gap-6">
                    <button 
                      className="bg-purple-500 text-white px-4 py-2 rounded-md"
                      onClick={() => setPeople([...people, { name: "", owes: 0 }])}
                    >
                      Add Person
                    </button>
                    <button
                      onClick={() => setShowPeopleManager(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                {people.map((person, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-20">
                      Person {index + 1}
                    </label>
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => {
                        const newPeople = [...people];
                        newPeople[index].name = e.target.value;
                        setPeople(newPeople);
                      }}
                      placeholder={`Enter name`}
                      className="flex-1 px-3 py-2 border bg-slate-100 dark:bg-slate-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                    />
                    <button
                      onClick={() => setPeople(people.filter((_, i) => i !== index))}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      aria-label="Remove person"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                ))}
                
                {people.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No people added yet. Click "Add Person" to get started.
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="p-4 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].name = e.target.value;
                            setItems(newItems);
                          }}
                          placeholder="e.g., Pizza"
                          className="w-full px-3 py-2 border bg-slate-100 dark:bg-slate-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-150"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost ({currency})</label>
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
                            className="w-full px-3 py-2 border bg-slate-100 dark:bg-slate-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-150"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
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
                            className="w-full px-3 py-2 border bg-slate-100 dark:bg-slate-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-150"
                          />
                        </div>
                      </div>

                      {people.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Split Among</label>
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
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                  item.splitAmong.includes(person.name)
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-500'
                                }`}
                              >
                                {person.name || `Person ${personIndex + 1}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setItems(items.filter((_, i) => i !== index))}
                      className="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-1/2 p-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-all duration-150">Summary</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-800 dark:text-gray-200 transition-all duration-150">Total Cost: {currency}{total}</p>
          </div>
          <div>
            {peopleWithOwes.map((person, index) => (
              <p key={index} className="text-gray-800 dark:text-gray-200 transition-all duration-150">{person.name} Owes: {currency}{person.owes.toFixed(2)}</p>
            ))}
          </div>
          <ApplyTax country={country} total={total} taxApplied={taxApplied} setTaxApplied={setTaxApplied} />

          <div className="flex flex-col md:flex-row gap-4 mt-4">
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
              className="inline-block mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Generate Invoice
            </PDFDownloadLink>

            <button 
              className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-md transition-colors"
              onClick={() => exportDataAsJSON(items, people, total, taxApplied)}
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplitCalculator
