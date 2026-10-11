import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Card, Page, SectionTitle, TransactionRow } from "../components/UI";
import { theme } from "../constants/theme";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      axios
        .get("http://192.168.1.46:8000/api/transactions")
        .then((response) => {
          setTransactions(response.data.data || response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
          setLoading(false);
        });
    }, [])
  );

  const filtered = transactions.filter((item) => {
    if (filter === "Income") return item.type === "income";
    if (filter === "Expenses") return item.type === "expense";
    return true;
  });

  return (
    <Page title="Transactions" subtitle="Track every peso coming in and going out.">
      <Card>
        <SectionTitle>Transaction history</SectionTitle>
        <View style={styles.filters}>
          {["All", "Income", "Expenses"].map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[
                styles.filter,
                filter === item && styles.activeFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: 8 }}>
          {loading ? (
            <Text style={styles.empty}>Loading transactions...</Text>
          ) : (
            filtered.map((item) => (
              <TransactionRow
                key={item.id}
                title={item.description || item.title}
                category={item.category}
                date={item.date}
                amount={item.amount.toString()}
                type={item.type}
              />
            ))
          )}

          {!loading && filtered.length === 0 && (
            <Text style={styles.empty}>No transactions found.</Text>
          )}
        </View>
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", gap: 8, marginBottom: 10 },
  filter: { flex: 1, paddingVertical: 11, borderRadius: 12, backgroundColor: "#F3F5F0", alignItems: "center" },
  activeFilter: { backgroundColor: theme.primary },
  filterText: { color: theme.muted, fontWeight: "700", fontSize: 12 },
  activeText: { color: "#FFFFFF" },
  empty: { color: theme.muted, textAlign: "center", paddingVertical: 25 },
});