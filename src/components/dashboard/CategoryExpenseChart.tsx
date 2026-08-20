import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { CategoryTotals } from '../../types/dashboard.types';
import { Colors } from '../../constants';

const WIDTH = Dimensions.get('window').width;

const COLORS = [
  '#2563EB',
  '#16A34A',
  '#F59E0B',
  '#7C3AED',
  '#DC2626',
  '#0891B2',
  Colors.SECONDARY,
];

const chartConfig = {
  backgroundColor: Colors.WHITE,
  backgroundGradientFrom: Colors.WHITE,
  backgroundGradientTo: Colors.WHITE,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
};

export default function CategoryExpenseChart({
  categoryTotals,
}: {
  categoryTotals: CategoryTotals;
}) {
  const expenses = useMemo(() => {
    if (!categoryTotals || typeof categoryTotals !== 'object') {
      return [];
    }

    return Object.entries(categoryTotals)
      .filter(([, amount]) => Number(amount) > 0)
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .map(([name, amount], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        amount: Number(amount),
        color: COLORS[index % COLORS.length],
        legendFontColor: Colors.SLATE,
        legendFontSize: 12,
      }));
  }, [categoryTotals]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Category Breakdown</Text>

      {expenses?.length > 0 ? (
        <>
          <View style={styles.chartContainer}>
            <PieChart
              data={expenses}
              width={WIDTH}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="100"
              hasLegend={false}
              absolute
            />
          </View>

          <View style={styles.legend}>
            {expenses.map(item => (
              <View key={item.name} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <Text style={styles.empty}>No category data.</Text>
      )}
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: Colors.SLATE,
  },
  empty: {
    paddingVertical: 40,
    textAlign: 'center',
    color: Colors.SECONDARY,
  },
});
