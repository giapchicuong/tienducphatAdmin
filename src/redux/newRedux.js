import { createSlice } from "@reduxjs/toolkit";

export const newSlice = createSlice({
  name: "new",
  initialState: {
    news: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    //GET ALL
    getNewStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getNewSuccess: (state, action) => {
      state.isFetching = false;
      state.news = action.payload;
    },
    getNewFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //DELETE
    deleteNewStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteNewSuccess: (state, action) => {
      state.isFetching = false;
      state.news.splice(
        state.news.findIndex((item) => item._id === action.payload),
        1
      );
    },
    deleteNewFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //UPDATE
    updateNewStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateNewSuccess: (state, action) => {
      state.isFetching = false;
      state.news[
        state.news.findIndex((item) => item._id === action.payload.id)
      ] = action.payload.new;
    },
    updateNewFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //ADD
    addNewStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    addNewSuccess: (state, action) => {
      state.isFetching = false;
      state.news.push(action.payload);
    },
    addNewFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getNewStart,
  getNewSuccess,
  getNewFailure,
  deleteNewStart,
  deleteNewSuccess,
  deleteNewFailure,
  updateNewStart,
  updateNewSuccess,
  updateNewFailure,
  addNewStart,
  addNewSuccess,
  addNewFailure,
} = newSlice.actions;

export default newSlice.reducer;
