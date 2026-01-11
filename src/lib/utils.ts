import type { Item, Person } from "@/lib/types";

export const exportDataAsJSON = (items: Item[], people: Person[], total: number, taxApplied: boolean) => {
  const data = {
    items,
    people,
    total,
    taxApplied,
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "split_calculation.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
