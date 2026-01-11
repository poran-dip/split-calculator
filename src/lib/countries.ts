export type Country = {
  code: string
  flag: string
  name: string
  currency: string
  tax?: {
    name: string
    rate: number
  }
}

export const countries: Country[] = [
  {
    code: "india",
    flag: "🇮🇳",
    name: "India",
    currency: "₹",
    tax: {
      name: "GST",
      rate: 0.18,
    },
  },
  {
    code: "uk",
    flag: "🇬🇧",
    name: "United Kingdom",
    currency: "£",
    tax: {
      name: "VAT",
      rate: 0.20,
    },
  },
  {
    code: "germany",
    flag: "🇩🇪",
    name: "Germany",
    currency: "€",
    tax: {
      name: "VAT",
      rate: 0.19,
    },
  },
  {
    code: "france",
    flag: "🇫🇷",
    name: "France",
    currency: "€",
    tax: {
      name: "VAT",
      rate: 0.20,
    },
  },
  {
    code: "italy",
    flag: "🇮🇹",
    name: "Italy",
    currency: "€",
    tax: {
      name: "VAT",
      rate: 0.22,
    },
  },
  {
    code: "spain",
    flag: "🇪🇸",
    name: "Spain",
    currency: "€",
    tax: {
      name: "VAT",
      rate: 0.21,
    },
  },
  {
    code: "netherlands",
    flag: "🇳🇱",
    name: "Netherlands",
    currency: "€",
    tax: {
      name: "VAT",
      rate: 0.21,
    },
  },
  {
    code: "sweden",
    flag: "🇸🇪",
    name: "Sweden",
    currency: "kr",
    tax: {
      name: "VAT",
      rate: 0.25,
    },
  },
  {
    code: "japan",
    flag: "🇯🇵",
    name: "Japan",
    currency: "¥",
    tax: {
      name: "Consumption Tax",
      rate: 0.10,
    },
  },
  {
    code: "singapore",
    flag: "🇸🇬",
    name: "Singapore",
    currency: "$",
    tax: {
      name: "GST",
      rate: 0.09,
    },
  },
  {
    code: "australia",
    flag: "🇦🇺",
    name: "Australia",
    currency: "$",
    tax: {
      name: "GST",
      rate: 0.10,
    },
  },
  {
    code: "newzealand",
    flag: "🇳🇿",
    name: "New Zealand",
    currency: "$",
    tax: {
      name: "GST",
      rate: 0.15,
    },
  },
  {
    code: "uae",
    flag: "🇦🇪",
    name: "United Arab Emirates",
    currency: "د.إ",
    tax: {
      name: "VAT",
      rate: 0.05,
    },
  },
  {
    code: "southafrica",
    flag: "🇿🇦",
    name: "South Africa",
    currency: "R",
    tax: {
      name: "VAT",
      rate: 0.15,
    },
  },
  {
    code: "indonesia",
    flag: "🇮🇩",
    name: "Indonesia",
    currency: "Rp",
    tax: {
      name: "VAT",
      rate: 0.12,
    },
  },
  {
    code: "thailand",
    flag: "🇹🇭",
    name: "Thailand",
    currency: "฿",
    tax: {
      name: "VAT",
      rate: 0.07,
    },
  },
  {
    code: "philippines",
    flag: "🇵🇭",
    name: "Philippines",
    currency: "₱",
    tax: {
      name: "VAT",
      rate: 0.12,
    },
  },
  {
    code: "malaysia",
    flag: "🇲🇾",
    name: "Malaysia",
    currency: "RM",
    tax: {
      name: "SST",
      rate: 0.06,
    },
  },
  {
    code: "southkorea",
    flag: "🇰🇷",
    name: "South Korea",
    currency: "₩",
    tax: {
      name: "VAT",
      rate: 0.10,
    },
  },
]
