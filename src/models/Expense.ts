import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { ExpenseCategory, PaymentMode } from '../types/expense.types';

export interface ExpenseDocument {
  ownerId: string;
  siteId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  tags: string[];
  vendor: string | null;
  paymentMode: PaymentMode;
  expenseDate: FirebaseFirestoreTypes.Timestamp;
  notes: string | null;
  createdBy: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}
