import React, { useState } from 'react';
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
import { Colors } from '../../constants';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Expenses'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function ExpensesScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const filters = useAppSelector(state => state.expenseFilter);
  const siteId =
    useAppSelector(state => state.site.selectedSiteId) ?? env.defaultSiteId;
  const [filterVisible, setFilterVisible] = useState(false);

  const query = useFilteredExpenses(user?.uid, siteId);
  useExpenseSubscription(user?.uid, siteId);

  if (query.isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  const renderItem = ({ item }: { item: Expense }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('AddExpense', { expenseId: item.id })}
    >
      <View style={styles.headerRow}>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.amount}>
          ₹{item.amount.toLocaleString('en-IN')}
        </Text>
      </View>
      <View style={styles.meta}>
        <Text>{item.category}</Text>
        <Text>{item.paymentMode}</Text>
      </View>
      {item.vendor ? <Text style={styles.vendor}>{item.vendor}</Text> : null}
      <View style={styles.tags}>
        {item.tags.map(tag => (
          <Text key={tag} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>
      <Text style={styles.date}>
        {item.expenseDate.toLocaleDateString('en-IN')}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Expenses</Text>
        <Pressable
          style={styles.add}
          onPress={() => navigation.navigate('AddExpense', {})}
        >
          <Text style={styles.addText}>+ Add</Text>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder="Search title, vendor or tag"
          value={filters.search}
          onChangeText={value => dispatch(setSearch(value))}
        />
        <Pressable style={styles.filter} onPress={() => setFilterVisible(true)}>
          <Text>Filter</Text>
        </Pressable>
      </View>

      <Text style={styles.count}>
        {query.expenses.length} expense{query.expenses.length === 1 ? '' : 's'}
      </Text>

      <FlatList
        data={query.expenses}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No matching expenses</Text>
            <Text>Try changing your search or filters.</Text>
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
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  top: {
    padding: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 28, fontWeight: '700' },
  add: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY,
  },
  addText: { color: Colors.WHITE, fontWeight: '600' },
  searchRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8 },
  search: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
  },
  filter: {
    height: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
  },
  count: { padding: 20, paddingVertical: 12, color: Colors.SECONDARY },
  list: { padding: 20, paddingTop: 0 },
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: Colors.WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.BLUE_LIGHT,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  name: { flex: 1, fontSize: 16, fontWeight: '600' },
  amount: { fontSize: 16, fontWeight: '700' },
  meta: { flexDirection: 'row', gap: 12, marginTop: 8 },
  vendor: { marginTop: 6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: { color: Colors.SLATE },
  date: { marginTop: 10, fontSize: 12, color: Colors.SECONDARY },
  empty: { paddingTop: 80, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
});
