import {
  loginFailure,
  loginStart,
  loginSuccess,
  logoutSuccess,
} from "./userRedux";
import { publicRequest, userRequest } from "../requestMethods";
import {
  getProductFailure,
  getProductStart,
  getProductSuccess,
  deleteProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  updateProductFailure,
  updateProductStart,
  updateProductSuccess,
  addProductFailure,
  addProductStart,
  addProductSuccess,
} from "./productRedux";
import {
  getUserFailure,
  getUserStart,
  getUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  addUserFailure,
  addUserStart,
  addUserSuccess,
} from "./userRedux";
import {
  deleteOrderFailure,
  deleteOrderStart,
  deleteOrderSuccess,
  getOrderFailure,
  getOrderStart,
  getOrderSuccess,
  updateOrderFailure,
  updateOrderStart,
  updateOrderSuccess,
} from "./orderRedux";
import {
  deleteMessageFailure,
  deleteMessageStart,
  deleteMessageSuccess,
  getMessageFailure,
  getMessageStart,
  getMessageSuccess,
  updateMessageFailure,
  updateMessageStart,
  updateMessageSuccess,
} from "./messageRedux";
import {
  deleteNewFailure,
  deleteNewStart,
  deleteNewSuccess,
  getNewFailure,
  getNewStart,
  getNewSuccess,
  updateNewFailure,
  updateNewStart,
  updateNewSuccess,
  addNewFailure,
  addNewStart,
  addNewSuccess,
} from "./newRedux";
import {
  getCategoryFailure,
  getCategoryStart,
  getCategorySuccess,
  deleteCategoryFailure,
  deleteCategoryStart,
  deleteCategorySuccess,
  updateCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
  addCategoryFailure,
  addCategoryStart,
  addCategorySuccess,
} from "./categoryRedux";
export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
    document.location.href = "/";
  } catch (err) {
    dispatch(loginFailure());
  }
};
export const logout = async (dispatch) => {
  dispatch(logoutSuccess());
};

export const getProducts = async (dispatch) => {
  dispatch(getProductStart());
  try {
    const res = await publicRequest.get("/products");
    dispatch(getProductSuccess(res.data));
  } catch (err) {
    dispatch(getProductFailure());
  }
};

export const deleteProduct = async (id, dispatch) => {
  dispatch(deleteProductStart());
  try {
    const res = await userRequest.delete(`/products/${id}`);
    dispatch(deleteProductSuccess(res.data));
  } catch (err) {
    dispatch(deleteProductFailure());
  }
};

export const updateProduct = async (id, product, dispatch) => {
  dispatch(updateProductStart());
  try {
    // update
    const res = await userRequest.put(`/products/${id}`, product);
    dispatch(updateProductSuccess(res.data));
  } catch (err) {
    dispatch(updateProductFailure());
  }
};
export const addProduct = async (product, dispatch) => {
  dispatch(addProductStart());
  try {
    const res = await userRequest.post(`/products`, product);
    dispatch(addProductSuccess(res.data));
  } catch (err) {
    dispatch(addProductFailure());
  }
};

// USER
export const getUsers = async (dispatch) => {
  dispatch(getUserStart());
  try {
    const res = await userRequest.get("/users");
    dispatch(getUserSuccess(res.data));
  } catch (err) {
    dispatch(getUserFailure());
  }
};
export const deleteUser = async (id, dispatch) => {
  dispatch(deleteUserStart());
  try {
    const res = await userRequest.delete(`/users/${id}`);
    dispatch(deleteUserSuccess(res.data));
  } catch (err) {
    dispatch(deleteUserFailure());
  }
};

export const updateUser = async (id, user, dispatch) => {
  dispatch(updateUserStart());
  try {
    // update
    const res = await userRequest.put(`/users/${id}`, user);
    dispatch(updateUserSuccess(res.data));
  } catch (err) {
    dispatch(updateUserFailure());
  }
};
export const addUser = async (user, dispatch) => {
  dispatch(addUserStart());
  try {
    const res = await userRequest.post(`/users`, user);
    dispatch(addUserSuccess(res.data));
  } catch (err) {
    dispatch(addUserFailure());
  }
};

// ORDER
export const getOrders = async (dispatch) => {
  dispatch(getOrderStart());
  try {
    const res = await userRequest.get("/orders");
    dispatch(getOrderSuccess(res.data));
  } catch (err) {
    dispatch(getOrderFailure());
  }
};

export const updateOrder = async (id, order, dispatch) => {
  dispatch(updateOrderStart());
  try {
    // update
    const res = await userRequest.put(`/orders/${id}`, order);
    dispatch(updateOrderSuccess(res.data));
  } catch (err) {
    dispatch(updateOrderFailure());
  }
};
export const deleteOrder = async (id, dispatch) => {
  dispatch(deleteOrderStart());
  try {
    const res = await userRequest.delete(`/orders/${id}`);
    dispatch(deleteOrderSuccess(res.data));
  } catch (err) {
    dispatch(deleteOrderFailure());
  }
};

// Category
export const getCategories = async (dispatch) => {
  dispatch(getCategoryStart());
  try {
    const res = await publicRequest.get("/categories");
    dispatch(getCategorySuccess(res.data));
  } catch (err) {
    dispatch(getCategoryFailure());
  }
};

export const deleteCategory = async (id, dispatch) => {
  dispatch(deleteCategoryStart());
  try {
    const res = await userRequest.delete(`/categories/${id}`);
    dispatch(deleteCategorySuccess(res.data));
  } catch (err) {
    dispatch(deleteCategoryFailure());
  }
};

export const updateCategory = async (id, category, dispatch) => {
  dispatch(updateCategoryStart());
  try {
    // update
    const res = await userRequest.put(`/categories/${id}`, category);
    dispatch(updateCategorySuccess(res.data));
  } catch (err) {
    dispatch(updateCategoryFailure());
  }
};
export const addCategory = async (category, dispatch) => {
  dispatch(addCategoryStart());
  try {
    const res = await userRequest.post(`/categories`, category);
    dispatch(addCategorySuccess(res.data));
  } catch (err) {
    dispatch(addCategoryFailure());
  }
};

// NEW
export const getNews = async (dispatch) => {
  dispatch(getNewStart());
  try {
    const res = await userRequest.get("/news");
    dispatch(getNewSuccess(res.data));
  } catch (err) {
    dispatch(getNewFailure());
  }
};

export const updateNew = async (id, order, dispatch) => {
  dispatch(updateNewStart());
  try {
    // update
    const res = await userRequest.put(`/news/${id}`, order);
    dispatch(updateNewSuccess(res.data));
  } catch (err) {
    dispatch(updateNewFailure());
  }
};
export const deleteNew = async (id, dispatch) => {
  dispatch(deleteNewStart());
  try {
    const res = await userRequest.delete(`/news/${id}`);
    dispatch(deleteNewSuccess(res.data));
  } catch (err) {
    dispatch(deleteNewFailure());
  }
};
export const addNew = async (New, dispatch) => {
  dispatch(addNewStart());
  try {
    const res = await userRequest.post(`/news`, New);
    dispatch(addNewSuccess(res.data));
  } catch (err) {
    dispatch(addNewFailure());
  }
};


// MESSAGE
export const getMessages = async (dispatch) => {
  dispatch(getMessageStart());
  try {
    const res = await userRequest.get("/messages");
    dispatch(getMessageSuccess(res.data));
  } catch (err) {
    dispatch(getMessageFailure());
  }
};

export const updateMessage = async (id, message, dispatch) => {
  dispatch(updateMessageStart());
  try {
    // update
    const res = await userRequest.put(`/messages/${id}`, message);
    dispatch(updateMessageSuccess(res.data));
  } catch (err) {
    dispatch(updateMessageFailure());
  }
};
export const deleteMessage = async (id, dispatch) => {
  dispatch(deleteMessageStart());
  try {
    const res = await userRequest.delete(`/messages/${id}`);
    dispatch(deleteMessageSuccess(res.data));
  } catch (err) {
    dispatch(deleteMessageFailure());
  }
};