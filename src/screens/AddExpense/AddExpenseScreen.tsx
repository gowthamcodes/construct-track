import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Alert from '../../components/common/Alert';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/navigationTypes';
import { useAppSelector } from '../../redux/hooks';
import { useExpense } from '../../hooks/expenses/useExpense';
import { useCreateExpense } from '../../hooks/expenses/useCreateExpense';
import { useUpdateExpense } from '../../hooks/expenses/useUpdateExpense';
import { useDeleteExpense } from '../../hooks/expenses/useDeleteExpense';
import { ExpenseCategory, PaymentMode } from '../../types/expense.types';
import { env } from '../../config/env';
import { Colors } from '../../constants';

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

  async function save() {
    if (!user) return;
    const numeric = Number(amount);
    if (!title.trim() || !Number.isFinite(numeric) || numeric <= 0) {
      Alert.show({ message: 'Enter a valid title and amount.' });
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
      Alert.show({ message: errorMessage });
    }
  }

  function confirmDelete() {
    if (!expenseId || !user) return;

    Alert.show({
      message: 'Delete this expense?',
      showCancelButton: true,
      onConfirmPressed: async () => {
        try {
          await remove.mutateAsync({ expenseId, ownerId: user.uid, siteId });
          navigation.goBack();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unable to delete.';
          Alert.show({ message: errorMessage });
        }
      },
    });
  }

  const saving = create.isPending || update.isPending;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Field
        label="Expense Title"
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
            label={item}
            selected={paymentMode === item}
            onPress={() => setPaymentMode(item)}
          />
        ))}
      </View>

      <Pressable
        style={[styles.save, saving && styles.disabled]}
        disabled={saving}
        onPress={save}
      >
        <Text style={styles.saveText}>
          {saving ? 'Saving...' : editing ? 'Update Expense' : 'Add Expense'}
        </Text>
      </Pressable>

      {editing ? (
        <Pressable
          style={styles.delete}
          disabled={remove.isPending}
          onPress={confirmDelete}
        >
          <Text style={styles.deleteText}>
            {remove.isPending ? 'Deleting...' : 'Delete Expense'}
          </Text>
        </Pressable>
      ) : null}
    </ScrollView>
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
      <Text style={selected ? styles.selectedText : undefined}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  content: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 14, marginBottom: 8 },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  notes: { minHeight: 100, paddingTop: 14, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
    borderRadius: 20,
  },
  selected: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  selectedText: { color: Colors.WHITE },
  save: {
    height: 52,
    marginTop: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PRIMARY,
  },
  saveText: { color: Colors.WHITE, fontWeight: '600' },
  disabled: { opacity: 0.6 },
  delete: {
    height: 52,
    marginTop: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  deleteText: { fontWeight: '600' },
});
