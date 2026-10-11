import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Money, Page, SectionTitle } from "../components/UI";
import { theme } from "../constants/theme";

export default function ReportsScreen() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://192.168.1.46:8000/api/reports")
      .then((response) => {
        setReportData(response.data.data || response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reports data:", error);
        setLoading(false);
      });
  }, []);

  const income = reportData?.total_income || 0;
  const expenses = reportData?.total_expenses || 0;
  
  const net = reportData?.net_balance !== undefined 
    ? reportData.net_balance 
    : income - expenses;

  const period = reportData?.period || "October 2026";
  const total = income + expenses > 0 ? income + expenses : 1; 

  return (
    <Page title="Reports" subtitle="Understand your financial progress.">
      <Card>
        <Text style={styles.eyebrow}>MONTHLY NET BALANCE</Text>
        <Text style={styles.net}>
          ₱{loading ? "..." : net.toLocaleString("en-PH")}.00
        </Text>
        <Text style={styles.caption}>{period} · Sample report</Text>
      </Card>

      <Card>
        <SectionTitle>Income vs. expenses</SectionTitle>
        <View style={styles.row}>
          <Money 
            label="Total income" 
            amount={`₱${loading ? "..." : income.toLocaleString("en-PH")}`} 
            color={theme.income} 
          />
          <Money 
            label="Total expenses" 
            amount={`₱${loading ? "..." : expenses.toLocaleString("en-PH")}`} 
            color={theme.expense} 
          />
        </View>

        <Text style={styles.label}>Income</Text>
        <View style={styles.track}>
          <View style={[styles.bar, {
            width: `${loading ? 0 : (income / total) * 100}%`,
            backgroundColor: theme.income,
          }]} />
        </View>

        <Text style={styles.label}>Expenses</Text>
        <View style={styles.track}>
          <View style={[styles.bar, {
            width: `${loading ? 0 : (expenses / total) * 100}%`,
            backgroundColor: theme.expense,
          }]} />
        </View>
      </Card>

      <Card>
        <SectionTitle>Financial summary</SectionTitle>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.positive}>+ ₱{loading ? "..." : income.toLocaleString("en-PH")}.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={styles.negative}>− ₱{loading ? "..." : expenses.toLocaleString("en-PH")}.00</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Net balance</Text>
          <Text style={styles.totalLabel}>₱{loading ? "..." : net.toLocaleString("en-PH")}.00</Text>
        </View>
      </Card>

      <Card>
        <SectionTitle>Daily balance formula</SectionTitle>
        <Text style={styles.caption}>
          Daily balance = daily income − daily expenses
        </Text>
        <Text style={styles.caption}>
          Monthly balance = monthly income − monthly expenses
        </Text>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: theme.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.3,
  },
  net: {
    color: theme.primary,
    fontSize: 30,
    fontWeight: "800",
    marginTop: 12,
  },
  caption: {
    color: theme.muted,
    fontSize: 12,
    marginTop: 8,
    lineHeight: 19,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    color: theme.text,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  track: {
    height: 10,
    backgroundColor: "#EEF0EB",
    borderRadius: 10,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  summaryLabel: {
    color: theme.muted,
    fontSize: 13,
  },
  positive: {
    color: theme.income,
    fontWeight: "700",
  },
  negative: {
    color: theme.expense,
    fontWeight: "700",
  },
  totalRow: {
    marginTop: 4,
    borderBottomWidth: 0,
  },
  totalLabel: {
    color: theme.text,
    fontWeight: "800",
  },
});