import { createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    //GET ALL
    getMessageStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getMessageSuccess: (state, action) => {
      state.isFetching = false;
      state.messages = action.payload;
    },
    getMessageFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //DELETE
    deleteMessageStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteMessageSuccess: (state, action) => {
      state.isFetching = false;
      state.messages.splice(
        state.messages.findIndex((item) => item._id === action.payload),
        1
      );
    },
    deleteMessageFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //UPDATE
    updateMessageStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateMessageSuccess: (state, action) => {
      state.isFetching = false;
      state.messages[
        state.messages.findIndex((item) => item._id === action.payload.id)
      ] = action.payload.message;
    },
    updateMessageFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getMessageStart,
  getMessageSuccess,
  getMessageFailure,
  deleteMessageStart,
  deleteMessageSuccess,
  deleteMessageFailure,
  updateMessageStart,
  updateMessageSuccess,
  updateMessageFailure,
} = messageSlice.actions;

export default messageSlice.reducer;
