import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<FirebaseAuthTypes.User | null>) {
      state.user = action.payload;
      state.initialized = true;
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.initialized = true;
    },
  },
});

export const { setUser, setInitialized, clearAuth } = authSlice.actions;
export default authSlice.reducer;
