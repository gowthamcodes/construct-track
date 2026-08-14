import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { ExpenseDocument } from '../../models/Expense';
import { Expense } from '../../types/expense.types';

export function mapExpenseDocument(
  document: FirebaseFirestoreTypes.QueryDocumentSnapshot,
): Expense {
  const data = document.data() as ExpenseDocument;

  return {
    id: document.id,
    ownerId: data.ownerId,
    siteId: data.siteId,
    title: data.title,
    amount: data.amount,
    category: data.category,
    tags: data.tags ?? [],
    vendor: data.vendor ?? null,
    paymentMode: data.paymentMode,
    expenseDate: data.expenseDate.toDate(),
    notes: data.notes ?? null,
    createdBy: data.createdBy,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
}

export function mapSingleExpenseDocument(
  document: FirebaseFirestoreTypes.DocumentSnapshot,
): Expense | null {
  if (!document.exists()) {
    return null;
  }

  const data = document.data() as ExpenseDocument;

  if (!data) {
    return null;
  }

  return {
    id: document.id,
    ownerId: data.ownerId,
    siteId: data.siteId,
    title: data.title,
    amount: data.amount,
    category: data.category,
    tags: data.tags ?? [],
    vendor: data.vendor ?? null,
    paymentMode: data.paymentMode,
    expenseDate: data.expenseDate.toDate(),
    notes: data.notes ?? null,
    createdBy: data.createdBy,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
}
