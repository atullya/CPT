import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Candidate, CandidateState } from './candidatesTypes';

const initialState: CandidateState = {
  list: [],
  selectedId: null,
};

export const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setCandidates: (state, action: PayloadAction<Candidate[]>) => {
      state.list = action.payload;
    },
    selectCandidate: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
});

export const { setCandidates, selectCandidate } = candidatesSlice.actions;
export default candidatesSlice.reducer;