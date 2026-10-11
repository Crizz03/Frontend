import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Page, SectionTitle } from "../components/UI";
import { theme } from "../constants/theme";

export default function PlansScreen() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://192.168.1.46:8000/api/plans")
      .then((response) => {
        setPlans(response.data.data || response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching spending plans:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Page title="Tomorrow's Plan" subtitle="Budget guidelines and expected expenses.">
      <Card>
        <SectionTitle>Spending budget for tomorrow</SectionTitle>
        <Text style={styles.subtitleText}>
          Plan ahead to keep your daily savings on track. Here is your suggested allocation:
        </Text>

        {loading ? (
          <Text style={styles.empty}>Loading plans...</Text>
        ) : (
          plans.map((item) => (
            <View key={item.id} style={styles.planRow}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="calendar-outline"
                  size={21}
                  color={theme.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.category}</Text>
                <Text style={styles.note}>{item.note}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.amount}>₱{item.budget}</Text>
                <Text style={styles.priority}>{item.priority} Priority</Text>
              </View>
            </View>
          ))
        )}

        {!loading && plans.length === 0 && (
          <Text style={styles.empty}>No planned expenses found.</Text>
        )}
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  subtitleText: {
    color: theme.muted,
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 18,
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  iconBox: {
    width: 42,
    height: 42,
    backgroundColor: theme.primaryLight,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: theme.text,
    fontWeight: "700",
    fontSize: 14,
  },
  note: {
    color: theme.muted,
    fontSize: 12,
    marginTop: 4,
  },
  amount: {
    color: theme.primary,
    fontWeight: "800",
    fontSize: 14,
  },
  priority: {
    color: theme.muted,
    fontSize: 10,
    marginTop: 4,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  empty: {
    color: theme.muted,
    textAlign: "center",
    paddingVertical: 25,
  },
});