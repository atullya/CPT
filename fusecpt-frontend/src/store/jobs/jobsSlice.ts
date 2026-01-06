import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { JobState, JobFilters } from './jobsTypes';

const initialState: JobState = {
  selectedJobId: null,
  filters: {},
};

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSelectedJobId: (state, action: PayloadAction<string | null>) => {
      state.selectedJobId = action.payload;
    },
    setFilters: (state, action: PayloadAction<JobFilters>) => {
      state.filters = action.payload;
    },
  },
});

export const { setSelectedJobId, setFilters } = jobsSlice.actions;

export default jobsSlice.reducer;