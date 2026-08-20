import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../../redux/hooks';
import { useExpenseReport } from '../../hooks/reports/useExpenseReport';
import { formatCurrency } from '../../utils/currency';
import { env } from '../../config/env';
import { Colors } from '../../constants';
import Loader from '../../components/common/Loader';
import { formatPaymentMode } from '../../utils/helper';

export default function ReportsScreen() {
  const user = useAppSelector(state => state.auth.user);
  const siteId =
    useAppSelector(state => state.site.selectedSiteId) ?? env.defaultSiteId;
  const { report, isLoading } = useExpenseReport(user?.uid, siteId);

  if (isLoading) return <Loader />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Expense Reports</Text>
      <Text style={styles.subtitle}>
        Interactive report based on the active expense filters.
      </Text>

      <View style={styles.grid}>
        <Metric
          title="Total Expense"
          value={formatCurrency(report.summary.totalExpense)}
        />
        <Metric
          title="Transactions"
          value={String(report.summary.transactionCount)}
        />
        <Metric
          title="Average"
          value={formatCurrency(report.summary.averageExpense)}
        />
        <Metric
          title="Highest"
          value={formatCurrency(report.summary.highestExpense)}
        />
      </View>

      <Section title="Category Summary">
        {report.categories.map((item, index) => (
          <Row
            key={item.category}
            label={item.category}
            value={formatCurrency(item.amount)}
            secondary={`${item.percentage.toFixed(1)}% • ${item.count} transactions`}
            showBorder={report.categories.length !== index + 1}
          />
        ))}
      </Section>

      <Section title="Payment Mode">
        {report.payments.map((item, index) => (
          <Row
            key={item.paymentMode}
            label={formatPaymentMode(item.paymentMode)}
            value={formatCurrency(item.amount)}
            secondary={`${item.percentage.toFixed(1)}% • ${item.count} transactions`}
            showBorder={report.payments.length !== index + 1}
          />
        ))}
      </Section>

      <Section title="Top Vendors">
        {report.vendors.slice(0, 10).map((item, index) => (
          <Row
            key={item.vendor}
            label={item.vendor}
            value={formatCurrency(item.amount)}
            secondary={`${item.count} transactions`}
            showBorder={report.vendors.slice(0, 10).length !== index + 1}
          />
        ))}
      </Section>

      <Section title="Monthly Summary">
        {report.monthly.map((item, index) => (
          <Row
            key={item.month}
            label={formatMonth(item.month)}
            value={formatCurrency(item.amount)}
            secondary={`${item.count} transactions`}
            showBorder={report.monthly.length !== index + 1}
          />
        ))}
      </Section>
    </ScrollView>
  );
}

function formatMonth(value: string) {
  const [year, month] = value.split('-');
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    'en-IN',
    { month: 'long', year: 'numeric' },
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({
  label,
  value,
  secondary,
  showBorder,
}: {
  label: string;
  value: string;
  secondary: string;
  showBorder: boolean;
}) {
  return (
    <View style={[styles.row, showBorder && styles.border]}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.secondary}>{secondary}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { marginTop: 6, color: Colors.SECONDARY },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 20 },
  metric: {
    width: '47%',
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.BLUE_LIGHT,
  },
  metricTitle: { fontSize: 12, color: Colors.SECONDARY },
  metricValue: { marginTop: 8, fontSize: 19, fontWeight: '700' },
  section: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.BLUE_LIGHT,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.BLUE_LIGHT,
  },
  rowLeft: { flex: 1, paddingRight: 10 },
  rowLabel: { textTransform: 'capitalize', fontWeight: '500' },
  secondary: { marginTop: 4, fontSize: 12, color: Colors.SECONDARY },
  rowValue: { fontWeight: '700' },
});
