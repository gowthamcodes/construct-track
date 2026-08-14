import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';

import {
  CreateExpenseInput,
  Expense,
  UpdateExpenseInput,
} from '../types/expense.types';

import {
  mapExpenseDocument,
  mapSingleExpenseDocument,
} from '../services/firestore/expense.mapper';

const COLLECTION = 'expenses';

class ExpenseRepository {
  private readonly db = getFirestore();

  private expensesCollection() {
    return collection(this.db, COLLECTION);
  }

  async getExpenses(ownerId: string, siteId: string): Promise<Expense[]> {
    const expensesQuery = query(
      this.expensesCollection(),
      where('ownerId', '==', ownerId),
      where('siteId', '==', siteId),
      orderBy('expenseDate', 'desc'),
    );

    const snapshot = await getDocs(expensesQuery);

    return snapshot.docs.map(mapExpenseDocument);
  }

  async getExpense(id: string): Promise<Expense | null> {
    const reference = doc(this.db, COLLECTION, id);

    const snapshot = await getDoc(reference);

    return mapSingleExpenseDocument(snapshot);
  }

  async createExpense(input: CreateExpenseInput): Promise<string> {
    const reference = doc(this.expensesCollection());

    const now = Timestamp.now();

    await setDoc(reference, {
      ownerId: input.ownerId,
      siteId: input.siteId,

      title: input.title.trim(),

      amount: input.amount,

      category: input.category,

      tags: input.tags,

      vendor: input.vendor?.trim() || null,

      paymentMode: input.paymentMode,

      expenseDate: Timestamp.fromDate(input.expenseDate),

      notes: input.notes?.trim() || null,

      createdBy: input.ownerId,

      createdAt: now,

      updatedAt: now,
    });

    return reference.id;
  }

  async updateExpense(id: string, input: UpdateExpenseInput): Promise<void> {
    const updates: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
    };

    if (input.title !== undefined) {
      updates.title = input.title.trim();
    }

    if (input.amount !== undefined) {
      updates.amount = input.amount;
    }

    if (input.category !== undefined) {
      updates.category = input.category;
    }

    if (input.tags !== undefined) {
      updates.tags = input.tags;
    }

    if (input.vendor !== undefined) {
      updates.vendor = input.vendor.trim() || null;
    }

    if (input.paymentMode !== undefined) {
      updates.paymentMode = input.paymentMode;
    }

    if (input.expenseDate !== undefined) {
      updates.expenseDate = Timestamp.fromDate(input.expenseDate);
    }

    if (input.notes !== undefined) {
      updates.notes = input.notes.trim() || null;
    }

    const reference = doc(this.db, COLLECTION, id);

    await updateDoc(reference, updates);
  }

  async deleteExpense(id: string): Promise<void> {
    const reference = doc(this.db, COLLECTION, id);

    await deleteDoc(reference);
  }

  subscribe(
    ownerId: string,
    siteId: string,
    onData: (expenses: Expense[]) => void,
    onError?: (error: Error) => void,
  ): () => void {
    const expensesQuery = query(
      this.expensesCollection(),
      where('ownerId', '==', ownerId),
      where('siteId', '==', siteId),
      orderBy('expenseDate', 'desc'),
    );

    return onSnapshot(
      expensesQuery,
      snapshot => {
        onData(snapshot.docs.map(mapExpenseDocument));
      },
      error => {
        onError?.(error);
      },
    );
  }
}

export const expenseRepository = new ExpenseRepository();
