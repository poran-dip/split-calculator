import { Document, Font, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Item, Person } from "@/lib";

interface InvoicePDFProps {
  items: Item[];
  people: Person[];
  total: number;
  taxApplied: boolean;
  currency: string;
}

Font.register({
  family: "NotoSans",
  src: "/fonts/NotoSans-Regular.ttf",
});

Font.register({
  family: "NotoSans",
  src: "/fonts/NotoSans-Bold.ttf",
  fontWeight: "bold",
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "NotoSans",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: "2 solid #000000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: "#666666",
  },
  metadata: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    fontSize: 9,
  },
  metadataBox: {
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  table: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 8,
    fontWeight: "bold",
    fontSize: 9,
    borderBottom: "1 solid #cccccc",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1 solid #e0e0e0",
    fontSize: 9,
  },
  tableRowAlt: {
    backgroundColor: "#fafafa",
  },
  col1: {
    width: "10%",
  },
  col2: {
    width: "40%",
  },
  col3: {
    width: "15%",
    textAlign: "right",
  },
  col4: {
    width: "15%",
    textAlign: "right",
  },
  col5: {
    width: "20%",
    textAlign: "right",
  },
  splitCol1: {
    width: "60%",
  },
  splitCol2: {
    width: "40%",
    textAlign: "right",
  },
  totalsSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTop: "2 solid #000000",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    fontSize: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 10,
    borderTop: "1 solid #cccccc",
    fontSize: 8,
    color: "#666666",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notesSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fffbf0",
    borderLeft: "3 solid #ffc107",
  },
  noteText: {
    fontSize: 8,
    color: "#666666",
  },
});

export default function InvoicePDF({ items, people, total, taxApplied, currency }: InvoicePDFProps) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.cost * item.quantity, 0);
  const taxAmount = taxApplied ? total - subtotal : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SPLIT INVOICE</Text>
          <Text style={styles.subtitle}>Expense Split Summary</Text>
        </View>

        {/* Metadata */}
        <View style={styles.metadata}>
          <View style={styles.metadataBox}>
            <Text style={{ fontWeight: "bold", marginBottom: 2 }}>Invoice Date</Text>
            <Text>{date}</Text>
          </View>
          <View style={styles.metadataBox}>
            <Text style={{ fontWeight: "bold", marginBottom: 2 }}>Currency</Text>
            <Text>{currency}</Text>
          </View>
          <View style={styles.metadataBox}>
            <Text style={{ fontWeight: "bold", marginBottom: 2 }}>Participants</Text>
            <Text>{people.filter(p => p.name).length} people</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>#</Text>
              <Text style={styles.col2}>Description</Text>
              <Text style={styles.col3}>Qty</Text>
              <Text style={styles.col4}>Price</Text>
              <Text style={styles.col5}>Amount</Text>
            </View>
            {items.map((item, i) => (
              <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={styles.col1}>{i + 1}</Text>
                <Text style={styles.col2}>{item.name || "Unnamed Item"}</Text>
                <Text style={styles.col3}>{item.quantity}</Text>
                <Text style={styles.col4}>{currency}{item.cost.toFixed(2)}</Text>
                <Text style={styles.col5}>{currency}{(item.cost * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsRow}>
            <Text>Subtotal</Text>
            <Text>{currency}{subtotal.toFixed(2)}</Text>
          </View>
          {taxApplied && (
            <View style={styles.totalsRow}>
              <Text>Tax</Text>
              <Text>{currency}{taxAmount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text>TOTAL</Text>
            <Text>{currency}{total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Split Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Split</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.splitCol1}>Person</Text>
              <Text style={styles.splitCol2}>Amount Owed</Text>
            </View>
            {people.filter(p => p.name).map((person, i) => (
              <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={styles.splitCol1}>{person.name}</Text>
                <Text style={styles.splitCol2}>{currency}{person.owes.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Notes */}
        {taxApplied && (
          <View style={styles.notesSection}>
            <Text style={styles.noteText}>
              * Tax has been applied and distributed proportionally among all participants
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Split Calculator</Text>
          <Text>{date}</Text>
        </View>
      </Page>
    </Document>
  );
}
