import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  MainTabParamList,
  AppStackParamList,
} from '../../navigation/navigationTypes';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSearch } from '../../redux/expense/expenseFilterSlice';
import { useFilteredExpenses } from '../../hooks/expenses/useFilteredExpenses';
import { useExpenseSubscription } from '../../hooks/expenses/useExpenseSubscription';
import ExpenseFilterModal from '../../components/expenses/ExpenseFilterModal';
import { Expense } from '../../types/expense.types';
import { env } from '../../config/env';
import { Colors, Fonts } from '../../constants';
import {
  formatCategory,
  formatDateHeader,
  formatPaymentMode,
  getDateKey,
} from '../../utils/helper';
import Loader from '../../components/common/Loader';
import {
  Fence,
  Package,
  Plug2,
  Search,
  Settings,
  Truck,
  UserRoundCog,
  Wrench,
} from 'lucide-react-native';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Expenses'>,
  NativeStackScreenProps<AppStackParamList>
>;

const CATEGORY_ICONS: Record<string, React.ReactElement> = {
  materials: <Fence size={21} color={Colors.PRIMARY} />,
  labor: <UserRoundCog size={21} color={Colors.PRIMARY} />,
  equipment: <Settings size={21} color={Colors.PRIMARY} />,
  transport: <Truck size={21} color={Colors.PRIMARY} />,
  electrical: <Plug2 size={21} color={Colors.PRIMARY} />,
  plumbing: <Wrench size={21} color={Colors.PRIMARY} />,
  miscellaneous: <Package size={21} color={Colors.PRIMARY} />,
};

export default function ExpensesScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const filters = useAppSelector(state => state.expenseFilter);
  const siteId =
    useAppSelector(state => state.site.selectedSiteId) ?? env.defaultSiteId;
  const [filterVisible, setFilterVisible] = useState(false);

  const query = useFilteredExpenses(user?.uid, siteId);
  useExpenseSubscription(user?.uid, siteId);

  const totalAmount = useMemo(
    () =>
      query.expenses.reduce(
        (total, expense) => total + Number(expense.amount || 0),
        0,
      ),
    [query.expenses],
  );

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, Expense[]> = {};

    query.expenses.forEach(expense => {
      const key = getDateKey(expense.expenseDate);

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(expense);
    });

    return Object.entries(groups).flatMap(([date, expenses]) => [
      {
        type: 'header' as const,
        id: `header-${date}`,
        date,
      },
      ...expenses.map(expense => ({
        type: 'expense' as const,
        id: expense.id,
        expense,
      })),
    ]);
  }, [query.expenses]);

  if (query.isLoading) {
    return <Loader />;
  }

  const renderItem = ({
    item,
  }: {
    item:
      | { type: 'header'; id: string; date: string }
      | { type: 'expense'; id: string; expense: Expense };
  }) => {
    if (item.type === 'header') {
      return (
        <Text style={styles.dateHeader}>{formatDateHeader(item.date)}</Text>
      );
    }

    const expense = item.expense;
    const categoryKey = expense.category?.toLowerCase() ?? 'miscellaneous';
    const icon = CATEGORY_ICONS[categoryKey] ?? (
      <Package size={21} color={Colors.PRIMARY} />
    );

    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() =>
          navigation.navigate('AddExpense', { expenseId: expense.id })
        }
      >
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={styles.categoryRow}>
              <View
                style={[styles.iconContainer, { backgroundColor: '#64748B15' }]}
              >
                {icon}
              </View>

              <View style={styles.cardTitleContainer}>
                <Text style={styles.category} numberOfLines={1}>
                  {formatCategory(expense.category)}
                </Text>

                <Text style={styles.name} numberOfLines={2}>
                  {expense.title}
                </Text>
              </View>
            </View>

            <Text style={styles.amount}>
              ₹{Number(expense.amount || 0).toLocaleString('en-IN')}
            </Text>
          </View>

          {/* {expense.vendor ? (
            <Text style={styles.vendor} numberOfLines={1}>
              {expense.vendor}
            </Text>
          ) : null}

          {expense.tags?.length ? (
            <View style={styles.tags}>
              {expense.tags.slice(0, 3).map(tag => (
                <Text key={tag} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
              {expense.tags.length > 3 ? (
                <Text style={styles.moreTags}>+{expense.tags.length - 3}</Text>
              ) : null}
            </View>
          ) : null} */}

          <View style={styles.footer}>
            <View style={styles.metaGroup}>
              <Text style={styles.meta}>
                {expense.expenseDate.toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>

              <View style={styles.metaDot} />

              <Text style={styles.meta}>
                {formatPaymentMode(expense.paymentMode)}
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View>
          <Text style={styles.title}>Expenses</Text>
          <Text style={styles.subtitle}>
            {query.expenses.length}{' '}
            {query.expenses.length === 1 ? 'expense' : 'expenses'}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.add, pressed && styles.buttonPressed]}
          onPress={() => navigation.navigate('AddExpense', {})}
        >
          <Text style={styles.addText}>+ Add</Text>
        </Pressable>
      </View>

      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryLabel}>Total expenses</Text>
          <Text style={styles.summaryAmount}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>

        <View style={styles.summaryCount}>
          <Text style={styles.summaryLabel}>Showing</Text>
          <Text style={styles.summaryValue}>{query.expenses.length}</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Search size={14} color={Colors.SECONDARY} />
          <TextInput
            style={styles.search}
            placeholder="Search expenses, vendor or tags"
            placeholderTextColor={'#a6a09b'}
            value={filters.search}
            onChangeText={value => dispatch(setSearch(value))}
          />

          {!!filters.search && (
            <Pressable hitSlop={20} onPress={() => dispatch(setSearch(''))}>
              <Text style={styles.clear}>×</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.filter,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={styles.filterIcon}>☷</Text>
          <Text style={styles.filterText}>Filter</Text>
        </Pressable>
      </View>

      <FlatList
        data={groupedExpenses}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🧾</Text>
            <Text style={styles.emptyTitle}>No matching expenses</Text>
            <Text style={styles.emptyText}>
              Try changing your search or filters.
            </Text>
          </View>
        }
      />

      <ExpenseFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: Colors.SECONDARY,
  },
  add: {
    minHeight: 42,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: Colors.WHITE,
    fontWeight: '700',
    fontSize: 14,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  summary: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.BLUE_LIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.SECONDARY,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  summaryCount: {
    alignItems: 'flex-end',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
  searchContainer: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {
    flex: 1,
    height: 48,
    paddingHorizontal: 4,
    color: Colors.BLACK,
    fontSize: 14,
    lineHeight: 14 * 1.4,
  },
  clear: {
    fontSize: 24,
    lineHeight: 24,
    color: Colors.SECONDARY,
    paddingHorizontal: 3,
  },
  filter: {
    height: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
  },
  filterIcon: {
    fontSize: 17,
    color: '#334155',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 32,
  },
  dateHeader: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.SECONDARY,
  },
  card: {
    marginBottom: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.BLUE_LIGHT,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.995 }],
  },
  accent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 13,
    paddingVertical: 13,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitleContainer: {
    flex: 1,
    minWidth: 0,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 0.35,
  },
  name: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginRight: 16,
  },
  amount: {
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontWeight: '600',
    color: '#0F766E',
    marginHorizontal: 8,
  },
  vendor: {
    marginTop: 8,
    marginLeft: 50,
    fontSize: 12,
    color: Colors.SECONDARY,
  },
  tags: {
    marginTop: 8,
    marginLeft: 50,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    fontSize: 11,
    color: Colors.SLATE,
  },
  moreTags: {
    fontSize: 11,
    color: Colors.SECONDARY,
  },
  footer: {
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    fontSize: 11,
    color: Colors.SECONDARY,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.GRAY_MEDIUM,
    marginHorizontal: 7,
  },
  chevron: {
    marginLeft: 'auto',
    fontSize: 22,
    lineHeight: 20,
    color: Colors.GRAY_MEDIUM,
  },
  empty: {
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.SECONDARY,
    textAlign: 'center',
  },
});
