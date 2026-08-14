import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MonthlyTotal } from '../../types/dashboard.types';
import { Colors } from '../../constants';

const WIDTH = Dimensions.get('window').width;

export default function MonthlyExpenseChart({
  data,
}: {
  data: MonthlyTotal[];
}) {
  const chart = useMemo(() => {
    const months = data.slice(-6);
    return {
      labels: months.map(item => {
        const [year, month] = item.month.split('-');
        return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
          'en-IN',
          { month: 'short' },
        );
      }),
      datasets: [
        { data: months.length ? months.map(item => item.amount) : [0] },
      ],
    };
  }, [data]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Monthly Expenses</Text>
      <Text style={styles.subtitle}>Last 6 months</Text>
      {data.length ? (
        <LineChart
          data={chart}
          width={WIDTH - 72}
          height={220}
          yAxisLabel="₹"
          chartConfig={{
            backgroundGradientFrom: Colors.WHITE,
            backgroundGradientTo: Colors.WHITE,
            decimalPlaces: 0,
            color: opacity => `rgba(15,23,42,${opacity})`,
            labelColor: opacity => `rgba(100,116,139,${opacity})`,
          }}
          bezier
          withOuterLines={false}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.empty}>No monthly expense data.</Text>
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
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { marginTop: 4, marginBottom: 16, color: Colors.SECONDARY },
  chart: { marginLeft: -12, borderRadius: 16 },
  empty: { paddingVertical: 40, textAlign: 'center', color: Colors.SECONDARY },
});
