import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  resetFilters,
  setCategory,
  setPaymentMode,
  setSortBy,
} from '../../redux/expense/expenseFilterSlice';
import {
  EXPENSE_CATEGORIES,
  PAYMENT_MODES,
  ExpenseCategory,
  ExpenseSort,
  PaymentMode,
} from '../../types/expense.types';
import { Colors, Fonts } from '../../constants';
import { formatPaymentMode } from '../../utils/helper';
import { RotateCcw } from 'lucide-react-native';

export default function ExpenseFilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.expenseFilter);

  return (
    <Modal
      visible={visible}
      onRequestClose={() => onClose()}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <Pressable
              style={styles.resetButton}
              hitSlop={20}
              onPress={() => dispatch(resetFilters())}
            >
              <RotateCcw color={Colors.SLATE} size={16} />
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={[styles.section, { marginTop: 12 }]}>Category</Text>
            <View style={styles.chips}>
              <Chip
                label="All"
                selected={filters.category === 'all'}
                onPress={() => dispatch(setCategory('all'))}
              />
              {EXPENSE_CATEGORIES.map(category => (
                <Chip
                  key={category}
                  label={category}
                  selected={filters.category === category}
                  onPress={() =>
                    dispatch(setCategory(category as ExpenseCategory))
                  }
                />
              ))}
            </View>

            <Text style={styles.section}>Payment Mode</Text>
            <View style={styles.chips}>
              <Chip
                label="All"
                selected={filters.paymentMode === 'all'}
                onPress={() => dispatch(setPaymentMode('all'))}
              />
              {PAYMENT_MODES.map(mode => (
                <Chip
                  key={mode}
                  label={formatPaymentMode(mode)}
                  selected={filters.paymentMode === mode}
                  onPress={() => dispatch(setPaymentMode(mode as PaymentMode))}
                />
              ))}
            </View>

            <Text style={styles.section}>Sort By</Text>
            <View style={styles.chips}>
              {(['newest', 'oldest', 'highest', 'lowest'] as ExpenseSort[]).map(
                sort => (
                  <Chip
                    key={sort}
                    label={sort}
                    selected={filters.sortBy === sort}
                    onPress={() => dispatch(setSortBy(sort))}
                  />
                ),
              )}
            </View>
          </ScrollView>

          <Pressable style={styles.apply} onPress={onClose}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.selected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.selectedText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    maxHeight: '85%',
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '700' },
  section: {
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontFamily: Fonts.NOTO_SEMI_BOLD,
    marginTop: 16,
    marginBottom: 10,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
    borderRadius: 20,
  },
  selected: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  chipText: {
    fontFamily: Fonts.NOTO_REGULAR,
    fontSize: 14,
    lineHeight: 14 * 1.4,
    color: Colors.PRIMARY,
  },
  selectedText: {
    color: Colors.WHITE,
    fontFamily: Fonts.NOTO_MEDIUM,
  },
  apply: {
    height: 52,
    marginTop: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PRIMARY,
  },
  applyText: {
    color: Colors.WHITE,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontFamily: Fonts.NOTO_SEMI_BOLD,
  },
  resetButton: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  resetButtonText: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    fontFamily: Fonts.NOTO_MEDIUM,
    color: Colors.SLATE,
  },
});
