import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Money, Page, SectionTitle, TransactionRow } from "../components/UI";
import { theme } from "../constants/theme";

export default function DashboardScreen() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      
    
      axios
        .get("http://192.168.1.46:8000/api/dashboard")
        .then((response) => {
          setDashboardData(response.data.data);
        })
        .catch((error) => console.error("Error fetching dashboard data:", error));

     
      axios
        .get("http://192.168.1.46:8000/api/transactions")
        .then((response) => {
          const allTx = response.data.data || [];
          setRecentTransactions(allTx.slice(0, 3)); // Grab top 3 recent
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
          setLoading(false);
        });
    }, [])
  );

  return (
    <Page title="Overview" subtitle="Here's your money at a glance.">
      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
        <Text style={styles.balance}>
          ₱{loading ? "..." : dashboardData?.monthly_balance?.toLocaleString()}
        </Text>
        <Text style={styles.balanceNote}>Your available balance</Text>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Money 
            label="Income this month" 
            amount={`₱${loading ? "..." : dashboardData?.monthly_income?.toLocaleString()}`} 
            color="#BDE9CE" 
          />
          <Money 
            label="Expenses this month" 
            amount={`₱${loading ? "..." : dashboardData?.monthly_expenses?.toLocaleString()}`} 
            color="#FFD0CB" 
          />
        </View>
      </Card>

      <View>
        <SectionTitle>Today's summary</SectionTitle>
        <Card>
          <View style={styles.row}>
            <Money 
              label="Income" 
              amount={`₱${loading ? "..." : dashboardData?.today_income?.toLocaleString()}`} 
              color={theme.income} 
            />
            <Money 
              label="Expenses" 
              amount={`₱${loading ? "..." : dashboardData?.today_expenses?.toLocaleString()}`} 
              color={theme.expense} 
            />
          </View>
          <View style={styles.todayNet}>
            <Text style={styles.todayLabel}>Today's net balance</Text>
            <Text style={styles.todayAmount}>
              ₱{loading ? "..." : dashboardData?.today_balance?.toLocaleString()}
            </Text>
          </View>
        </Card>
      </View>

      <View>
        <SectionTitle>Recent transactions</SectionTitle>
        <Card>
          {recentTransactions.map((item) => (
            <TransactionRow
              key={item.id}
              title={item.description}
              category={item.category}
              date={item.date}
              amount={item.amount.toLocaleString()}
              type={item.type}
            />
          ))}
          {recentTransactions.length === 0 && !loading && (
            <Text style={{ color: theme.muted, textAlign: "center", padding: 10 }}>No transactions yet.</Text>
          )}
        </Card>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  balanceCard: { backgroundColor: theme.primary, borderColor: theme.primary, padding: 22 },
  balanceLabel: { color: "#D3E6DA", fontSize: 11, letterSpacing: 1.5, fontWeight: "700" },
  balance: { color: "#FFFFFF", fontSize: 33, fontWeight: "800", marginTop: 12 },
  balanceNote: { color: "#D3E6DA", fontSize: 12, marginTop: 4 },
  divider: { height: 1, backgroundColor: "#527C69", marginVertical: 20 },
  row: { flexDirection: "row", gap: 12 },
  todayNet: { backgroundColor: "#F5F7F3", padding: 14, borderRadius: 12, marginTop: 18 },
  todayLabel: { color: theme.muted, fontSize: 12 },
  todayAmount: { color: theme.primary, fontWeight: "800", fontSize: 21, marginTop: 5 },
});