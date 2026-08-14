import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SiteState {
  selectedSiteId: string | null;
}

const initialState: SiteState = {
  selectedSiteId: null,
};

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    setSelectedSiteId(state, action: PayloadAction<string | null>) {
      state.selectedSiteId = action.payload;
    },
    clearSelectedSite(state) {
      state.selectedSiteId = null;
    },
  },
});

export const { setSelectedSiteId, clearSelectedSite } = siteSlice.actions;
export default siteSlice.reducer;
