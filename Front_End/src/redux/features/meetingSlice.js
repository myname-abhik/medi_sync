import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./userSlice";

const initialState = { owner: null, meeting: [] };

const meetingSlice = createSlice({
  name: "meet",
  initialState,
  reducers: {
    hydrateMeetings: (state, { payload }) => {
      state.owner = payload.owner;
      state.meeting = payload.meetings;
    },
    setMeeting: (state, action) => {
      state.meeting.push(action.payload);
      state.meeting.sort((a, b) => new Date(a.time) - new Date(b.time));
    },
    removeMeeting: (state, { payload }) => {
      state.meeting = state.meeting.filter((m) => m.code !== payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { hydrateMeetings, setMeeting, removeMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;
