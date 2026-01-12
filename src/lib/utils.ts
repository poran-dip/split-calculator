import type { Item, Person } from "@/lib";

export const exportDataAsJSON = (
  items: Item[], 
  people: Person[], 
  total: number, 
  taxApplied: boolean
) => {
  const timestamp = new Date().toISOString();
  const data = {
    exportInfo: {
      version: "1.0",
      exportedAt: timestamp,
      generatedBy: "Split Calculator",
    },
    calculation: {
      items,
      people,
      total,
      taxApplied,
    },
    metadata: {
      itemCount: items.length,
      participantCount: people.filter(p => p.name).length,
    },
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const downloadAnchorNode = document.createElement("a");
  const filename = `split_calculation_${new Date().toISOString().split("T")[0]}.json`;
  
  downloadAnchorNode.setAttribute("href", url);
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};
