import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { theme } from "../constants/theme";

export function Page({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.brand}>DAILYTRACK</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {children}
        <View style={{ height: 24 }} />
      </ScrollView>
      <BottomNav />
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children }: {
  children: React.ReactNode;
}) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function Money({
  label,
  amount,
  color = theme.text,
}: {
  label: string;
  amount: string;
  color?: string;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={[styles.money, { color }]}>{amount}</Text>
    </View>
  );
}

export function TransactionRow({
  title,
  category,
  date,
  amount,
  type,
}: {
  title: string;
  category: string;
  date: string;
  amount: string;
  type: "income" | "expense";
}) {
  const isIncome = type === "income";

  return (
    <View style={styles.transaction}>
      <View style={styles.transactionIcon}>
        <Ionicons
          name={isIncome ? "arrow-down-outline" : "arrow-up-outline"}
          size={20}
          color={isIncome ? theme.income : theme.expense}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.muted}>
          {category} · {date}
        </Text>
      </View>
      <Text
        style={{
          fontWeight: "700",
          color: isIncome ? theme.income : theme.expense,
        }}
      >
        {isIncome ? "+" : "-"}₱{amount}
      </Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

function BottomNav() {
  const pathname = usePathname();

  const items = [
    { label: "Home", href: "/", icon: "grid-outline" as const },
    {
      label: "Activity",
      href: "/transactions",
      icon: "receipt-outline" as const,
    },
    {
      label: "Plans",
      href: "/plans",
      icon: "calendar-outline" as const,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: "bar-chart-outline" as const,
    },
    {
      label: "Categories",
      href: "/categories",
      icon: "pricetags-outline" as const,
    },
  ];

  return (
    <View style={styles.nav}>
      {items.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href;

        return (
          <Link key={item.href} href={item.href as any} asChild>
            <Pressable style={styles.navItem}>
              <Ionicons
                name={item.icon}
                size={21}
                color={active ? theme.primary : theme.muted}
              />
              <Text
                style={[
                  styles.navText,
                  active && { color: theme.primary },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: 54,
  },
  header: {
    paddingHorizontal: 22,
    paddingBottom: 18,
  },
  brand: {
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "800",
    color: theme.primary,
    marginBottom: 14,
  },
  title: {
    fontSize: 29,
    fontWeight: "800",
    color: theme.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.muted,
    marginTop: 5,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.text,
    marginBottom: 12,
  },
  muted: {
    color: theme.muted,
    fontSize: 12,
  },
  money: {
    fontSize: 19,
    fontWeight: "800",
    marginTop: 7,
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: theme.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    color: theme.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  button: {
    backgroundColor: theme.primary,
    padding: 16,
    alignItems: "center",
    borderRadius: 14,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: 10,
    paddingBottom: 22,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  navText: {
    fontSize: 10,
    color: theme.muted,
    fontWeight: "600",
  },
});