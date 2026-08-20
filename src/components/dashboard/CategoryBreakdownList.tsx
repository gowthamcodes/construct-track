import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CategoryTotals } from '../../types/dashboard.types';
import { formatCurrency } from '../../utils/currency';
import { Colors } from '../../constants';

export default function CategoryBreakdownList({
  categoryTotals,
  totalExpense,
}: {
  categoryTotals: CategoryTotals;
  totalExpense: number;
}) {
  const categories = useMemo(
    () =>
      Object.entries(categoryTotals)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: totalExpense ? (amount / totalExpense) * 100 : 0,
        }))
        .filter(item => item.amount > 0)
        .sort((a, b) => b.amount - a.amount),
    [categoryTotals, totalExpense],
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Expense by Category</Text>
      {categories.map((item, index) => (
        <View
          key={item.category}
          style={[
            styles.row,
            categories?.length !== index + 1 && styles.border,
          ]}
        >
          <View style={styles.left}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.percent}>{item.percentage.toFixed(1)}%</Text>
          </View>
          <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
        </View>
      ))}
      {!categories.length ? (
        <Text style={styles.empty}>No expenses yet.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BLUE_LIGHT,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  row: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.BLUE_LIGHT,
  },
  left: { flex: 1 },
  category: { textTransform: 'capitalize', fontWeight: '500' },
  percent: { marginTop: 3, fontSize: 12, color: Colors.SECONDARY },
  amount: { fontWeight: '600' },
  empty: { paddingVertical: 24, textAlign: 'center', color: Colors.SECONDARY },
});
