import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Card, Page, SectionTitle } from "../components/UI";
import { theme } from "../constants/theme";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    axios
      .get("http://192.168.1.46:8000/api/categories")
      .then((response) => {
        setCategories(response.data.data || response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  const filtered = categories.filter(
    (item) => filter === "All" || item.type?.toLowerCase() === filter.toLowerCase()
  );

  function getCategoryIcon(name: string): keyof typeof Ionicons.glyphMap {
    const lower = name.toLowerCase();
    if (lower.includes("salary")) return "wallet-outline";
    if (lower.includes("freelance")) return "laptop-outline";
    if (lower.includes("business")) return "storefront-outline";
    if (lower.includes("food")) return "restaurant-outline";
    if (lower.includes("transport")) return "car-outline";
    if (lower.includes("bill")) return "receipt-outline";
    if (lower.includes("shop")) return "bag-outline";
    return "apps-outline";
  }

  return (
    <Page title="Categories" subtitle="Keep your money organized.">
      <Card>
        <SectionTitle>Transaction categories</SectionTitle>

        <View style={styles.filters}>
          {["All", "Income", "Expense"].map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[
                styles.filter,
                filter === item && styles.activeFilter,
              ]}
            >
              <Text style={[
                styles.filterText,
                filter === item && styles.activeText,
              ]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        {loading ? (
          <Text style={styles.empty}>Loading categories...</Text>
        ) : (
          filtered.map((item) => {
            const iconName = item.icon || getCategoryIcon(item.name);
            const itemType = item.type || "Expense";
            return (
              <View key={item.id || item.name} style={styles.categoryRow}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name={iconName}
                    size={21}
                    color={itemType.toLowerCase() === "income" ? theme.income : theme.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.type}>{itemType}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.muted}
                />
              </View>
            );
          })
        )}

        {!loading && filtered.length === 0 && (
          <Text style={styles.empty}>No categories found.</Text>
        )}
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filter: {
    flex: 1,
    alignItems: "center",
    padding: 11,
    backgroundColor: "#F3F5F0",
    borderRadius: 12,
  },
  activeFilter: {
    backgroundColor: theme.primary,
  },
  filterText: {
    color: theme.muted,
    fontWeight: "700",
    fontSize: 12,
  },
  activeText: {
    color: "#FFFFFF",
  },
  categoryRow: {
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
  type: {
    color: theme.muted,
    fontSize: 12,
    marginTop: 4,
  },
  empty: {
    color: theme.muted,
    textAlign: "center",
    paddingVertical: 25,
  },
});