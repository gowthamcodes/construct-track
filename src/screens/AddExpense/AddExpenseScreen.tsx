import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/navigationTypes';
import { useAppSelector } from '../../redux/hooks';
import { useExpense } from '../../hooks/expenses/useExpense';
import { useCreateExpense } from '../../hooks/expenses/useCreateExpense';
import { useUpdateExpense } from '../../hooks/expenses/useUpdateExpense';
import { useDeleteExpense } from '../../hooks/expenses/useDeleteExpense';
import { ExpenseCategory, PaymentMode } from '../../types/expense.types';
import { env } from '../../config/env';
import { Colors, Fonts } from '../../constants';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { formatPaymentMode } from '../../utils/helper';
import { ArrowLeft, CalendarDays, Trash2 } from 'lucide-react-native';

type Props = NativeStackScreenProps<AppStackParamList, 'AddExpense'>;

export default function AddExpenseScreen({ navigation, route }: Props) {
  const expenseId = route.params?.expenseId;
  const editing = Boolean(expenseId);
  const user = useAppSelector(state => state.auth.user);
  const siteId =
    useAppSelector(state => state.site.selectedSiteId) ?? env.defaultSiteId;

  const existing = useExpense(expenseId);
  const create = useCreateExpense();
  const update = useUpdateExpense();
  const remove = useDeleteExpense();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('materials');
  const [tags, setTags] = useState('');
  const [vendor, setVendor] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [notes, setNotes] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    const value = existing.data;

    if (!value) return;
    setTitle(value.title);
    setAmount(String(value.amount));
    setCategory(value.category);
    setTags(value.tags.join(', '));
    setVendor(value.vendor ?? '');
    setPaymentMode(value.paymentMode);
    setNotes(value.notes ?? '');
    setExpenseDate(value.expenseDate);
  }, [existing.data]);

  async function handleSubmit() {
    if (!user) return;
    const numeric = Number(amount);
    if (!title.trim() || !Number.isFinite(numeric) || numeric <= 0) {
      Alert.alert('Alert', 'Enter a valid title and amount.');
      return;
    }

    const parsedTags = tags
      .split(',')
      .map(x => x.trim().toLowerCase())
      .filter(Boolean);

    try {
      if (editing && expenseId) {
        await update.mutateAsync({
          expenseId,
          ownerId: user.uid,
          siteId,
          data: {
            title,
            amount: numeric,
            category,
            tags: parsedTags,
            vendor,
            paymentMode,
            expenseDate,
            notes,
          },
        });
      } else {
        await create.mutateAsync({
          ownerId: user.uid,
          siteId,
          title,
          amount: numeric,
          category,
          tags: parsedTags,
          vendor,
          paymentMode,
          expenseDate,
          notes,
        });
      }
      navigation.goBack();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unable to save expense.';
      Alert.alert('Alert', errorMessage);
    }
  }

  function confirmDelete() {
    if (!expenseId || !user) return;

    Alert.alert('Alert', 'Delete this expense?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'destructive',
      },
      {
        text: 'Yes, Delete',
        onPress: async () => {
          try {
            await remove.mutateAsync({ expenseId, ownerId: user.uid, siteId });
            navigation.goBack();
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unable to delete.';
            Alert.alert('Alert', errorMessage);
          }
        },
      },
    ]);
  }

  const saving = create.isPending || update.isPending;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={20}
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <ArrowLeft size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Expense</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Date</Text>

        <TouchableOpacity
          style={styles.date}
          activeOpacity={0.6}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Text style={styles.dateText}>
            {expenseDate.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Text>

          <CalendarDays color={Colors.SECONDARY} size={16} />
        </TouchableOpacity>

        <Field
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. 50 Bags Cement"
        />
        <Field
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder="₹ 0"
          keyboardType="decimal-pad"
        />
        <Field
          label="Tags"
          value={tags}
          onChangeText={setTags}
          placeholder="cement, foundation"
        />
        <Field
          label="Vendor"
          value={vendor}
          onChangeText={setVendor}
          placeholder="Vendor name"
        />
        <Field
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional notes"
          multiline
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.chips}>
          {(
            [
              'materials',
              'labor',
              'equipment',
              'transport',
              'electrical',
              'plumbing',
              'miscellaneous',
            ] as ExpenseCategory[]
          ).map(item => (
            <Chip
              key={item}
              label={item}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          ))}
        </View>

        <Text style={styles.label}>Payment Mode</Text>
        <View style={styles.chips}>
          {(
            [
              'cash',
              'upi',
              'bank_transfer',
              'credit_card',
              'other',
            ] as PaymentMode[]
          ).map(item => (
            <Chip
              key={item}
              label={formatPaymentMode(item)}
              selected={paymentMode === item}
              onPress={() => setPaymentMode(item)}
            />
          ))}
        </View>

        <Pressable
          style={[styles.save, saving && styles.disabled]}
          disabled={saving}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Saving...' : editing ? 'Update Expense' : 'Add Expense'}
          </Text>
        </Pressable>

        {editing ? (
          <Pressable
            style={styles.delete}
            disabled={remove.isPending}
            onPress={confirmDelete}
          >
            <Trash2 size={18} color={'#DC3642'} />
            <Text style={[styles.buttonText, styles.deleteText]}>
              {remove.isPending ? 'Deleting...' : 'Delete Expense'}
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        accentColor={Colors.PRIMARY}
        date={expenseDate}
        maximumDate={new Date()}
        themeVariant={'light'}
        onConfirm={date => {
          setDatePickerVisibility(prev => false);
          setExpenseDate(date);
        }}
        onCancel={() => setDatePickerVisibility(prev => false)}
      />
    </View>
  );
}

function Field({
  label,
  multiline,
  ...props
}: { label: string; multiline?: boolean } & React.ComponentProps<
  typeof TextInput
>) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.notes]}
        placeholderTextColor={'#a6a09b'}
        multiline={multiline}
        {...props}
      />
    </>
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
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    lineHeight: 26 * 1.4,
    fontFamily: Fonts.NOTO_BOLD,
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginLeft: 8,
  },
  content: { paddingHorizontal: 10 },
  label: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    fontFamily: Fonts.NOTO_SEMI_BOLD,
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
    borderRadius: 10,
    paddingHorizontal: 14,
    color: Colors.BLACK,
    fontFamily: Fonts.NOTO_MEDIUM,
  },
  date: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    flex: 1,
    color: Colors.BLACK,
    fontFamily: Fonts.NOTO_MEDIUM,
  },
  notes: { minHeight: 100, paddingTop: 14, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
    borderRadius: 20,
    backgroundColor: Colors.WHITE,
  },
  selected: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  save: {
    height: 52,
    marginTop: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PRIMARY,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontFamily: Fonts.NOTO_SEMI_BOLD,
  },
  deleteText: {
    color: '#DC3642',
  },
  disabled: { opacity: 0.6 },
  delete: {
    height: 52,
    marginTop: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BACKGROUND,
    flexDirection: 'row',
    columnGap: 8,
  },
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
});
