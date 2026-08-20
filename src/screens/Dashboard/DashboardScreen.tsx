import React from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppSelector } from '../../redux/hooks';
import { useDashboardSummary } from '../../hooks/dashboard/useDashboardSummary';
import { useDashboardSubscription } from '../../hooks/dashboard/useDashboardSubscription';
import SummaryCard from '../../components/dashboard/SummaryCard';
import MonthlyExpenseChart from '../../components/dashboard/MonthlyExpenseChart';
import CategoryExpenseChart from '../../components/dashboard/CategoryExpenseChart';
import CategoryBreakdownList from '../../components/dashboard/CategoryBreakdownList';
import { formatCompactCurrency, formatCurrency } from '../../utils/currency';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppStackParamList,
  MainTabParamList,
} from '../../navigation/navigationTypes';
import { env } from '../../config/env';
import { Colors, Images } from '../../constants';
import Loader from '../../components/common/Loader';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Dashboard'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function DashboardScreen({ navigation }: Props) {
  const user = useAppSelector(state => state.auth.user);
  const selectedSiteId = useAppSelector(state => state.site.selectedSiteId);
  const siteId = selectedSiteId ?? env.defaultSiteId;

  const query = useDashboardSummary(user?.uid, siteId);
  useDashboardSubscription(user?.uid, siteId);

  if (query.isLoading) {
    return <Loader />;
  }

  if (query.isError) {
    return (
      <View style={styles.center}>
        <Text>Unable to load dashboard.</Text>
      </View>
    );
  }

  if (!query.data) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No expense data yet</Text>
        <Text style={styles.empty}>
          Add your first expense to start seeing insights.
        </Text>
      </View>
    );
  }

  const summary = query.data;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={query.isRefetching}
          onRefresh={query.refetch}
        />
      }
    >
      <View style={styles.wrapper}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.title}>Construction Overview</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={20}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={Images.User}
            resizeMode="contain"
            style={styles.user}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Construction Expense</Text>
        <Text style={styles.totalValue}>
          {formatCurrency(summary.totalExpense)}
        </Text>
        <Text style={styles.totalSub}>
          {summary.expenseCount} recorded expenses
        </Text>
      </View>

      <View style={styles.grid}>
        <SummaryCard
          title="This Month"
          value={formatCompactCurrency(summary.currentMonthExpense)}
          subtitle="Current month spending"
        />
        <SummaryCard
          title="This Year"
          value={formatCompactCurrency(summary.currentYearExpense)}
          subtitle="Current year spending"
        />
      </View>

      <MonthlyExpenseChart data={summary.monthlyTotals} />
      <CategoryExpenseChart categoryTotals={summary.categoryTotals} />
      <CategoryBreakdownList
        categoryTotals={summary.categoryTotals}
        totalExpense={summary.totalExpense}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  content: { padding: 20, paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  greeting: { fontSize: 14, color: Colors.SECONDARY },
  title: { marginTop: 4, fontSize: 26, fontWeight: '700' },
  totalCard: {
    marginTop: 20,
    padding: 22,
    borderRadius: 18,
    backgroundColor: Colors.PRIMARY,
  },
  totalLabel: { color: Colors.GRAY_LIGHT },
  totalValue: {
    marginTop: 10,
    color: Colors.WHITE,
    fontSize: 32,
    fontWeight: '700',
  },
  totalSub: { marginTop: 8, color: Colors.GRAY_MEDIUM },
  grid: { flexDirection: 'row', gap: 12, marginTop: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  empty: { marginTop: 8, textAlign: 'center', color: Colors.SECONDARY },
  wrapper: { flexDirection: 'row', alignItems: 'center' },
  user: { width: 40, height: 40 },
});
