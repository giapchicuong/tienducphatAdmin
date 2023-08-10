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
import { toast } from "react-toastify";
export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
    document.location.href = "/";
    toast.success("Đăng nhập thành công!"); // Show success notification
  } catch (err) {
    dispatch(loginFailure());
    toast.error("Đăng nhập thất bại, hãy thử lại."); // Show success
  }
};
export const logout = async (dispatch) => {
  dispatch(logoutSuccess());
  toast.success("Đăng xuất thành công!"); // Show success notification
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
    toast.success("Xóa sản phẩm thành công!");
  } catch (err) {
    dispatch(deleteProductFailure());
    toast.error("Xóa sản phẩm thất bại, hãy thử lại.");
  }
};

export const updateProduct = async (id, product, dispatch) => {
  dispatch(updateProductStart());
  try {
    // update
    const res = await userRequest.put(`/products/${id}`, product);
    dispatch(updateProductSuccess(res.data));
    toast.success("Cập nhật sản phẩm thành công!");

  } catch (err) {
    dispatch(updateProductFailure());
    toast.error("Cập nhật sản phẩm thất bại, hãy thử lại.");

  }
};
export const addProduct = async (product, dispatch) => {
  dispatch(addProductStart());
  try {
    const res = await userRequest.post(`/products`, product);
    dispatch(addProductSuccess(res.data));
    toast.success("Thêm sản phẩm thành công!");

  } catch (err) {
    dispatch(addProductFailure());
    toast.error("Thêm sản phẩm thất bại, hãy thử lại.");

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
    toast.success("Xóa user thành công!");

  } catch (err) {
    dispatch(deleteUserFailure());
    toast.error("Xóa user thất bại, hãy thử lại.");

  }
};

export const updateUser = async (id, user, dispatch) => {
  dispatch(updateUserStart());
  try {
    // update
    const res = await userRequest.put(`/users/${id}`, user);
    dispatch(updateUserSuccess(res.data));
    toast.success("Cập nhật user thành công!");

  } catch (err) {
    dispatch(updateUserFailure());
    toast.error("Cập nhật user thất bại, hãy thử lại.");

  }
};
export const addUser = async (user, dispatch) => {
  dispatch(addUserStart());
  try {
    const res = await userRequest.post(`/users`, user);
    dispatch(addUserSuccess(res.data));
    toast.success("Thêm user thành công!");

  } catch (err) {
    dispatch(addUserFailure());
    toast.error("Thêm user thất bại, hãy thử lại.");

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
    toast.success("Cập nhật đơn đặt hàng thành công!");

  } catch (err) {
    dispatch(updateOrderFailure());
    toast.error("Cập nhật đơn đặt hàng thất bại, hãy thử lại.");

  }
};
export const deleteOrder = async (id, dispatch) => {
  dispatch(deleteOrderStart());
  try {
    const res = await userRequest.delete(`/orders/${id}`);
    dispatch(deleteOrderSuccess(res.data));
    toast.success("Xóa đơn đặt hàng thành công!");

  } catch (err) {
    dispatch(deleteOrderFailure());
    toast.error("Xóa đơn đặt hàng thất bại, hãy thử lại.");

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
    toast.success("Xóa danh mục thành công!");

  } catch (err) {
    dispatch(deleteCategoryFailure());
    toast.error("Xóa danh mục thất bại, hãy thử lại.");

  }
};

export const updateCategory = async (id, category, dispatch) => {
  dispatch(updateCategoryStart());
  try {
    // update
    const res = await userRequest.put(`/categories/${id}`, category);
    dispatch(updateCategorySuccess(res.data));
    toast.success("Cập nhật danh mục thành công!");

  } catch (err) {
    dispatch(updateCategoryFailure());
    toast.error("Cập nhật danh mục thất bại, hãy thử lại.");

  }
};
export const addCategory = async (category, dispatch) => {
  dispatch(addCategoryStart());
  try {
    const res = await userRequest.post(`/categories`, category);
    dispatch(addCategorySuccess(res.data));
    toast.success("Thêm danh mục thành công!");

  } catch (err) {
    dispatch(addCategoryFailure());
    toast.error("Thêm danh mục thất bại, hãy thử lại.");

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
    toast.success("Cập nhật tin tức thành công!");

  } catch (err) {
    dispatch(updateNewFailure());
    toast.error("Cập nhật tin tức thất bại, hãy thử lại.");

  }
};
export const deleteNew = async (id, dispatch) => {
  dispatch(deleteNewStart());
  try {
    const res = await userRequest.delete(`/news/${id}`);
    dispatch(deleteNewSuccess(res.data));
    toast.success("Xóa tin tức thành công!");

  } catch (err) {
    dispatch(deleteNewFailure());
    toast.error("Xóa tin tức thất bại, hãy thử lại.");

  }
};
export const addNew = async (New, dispatch) => {
  dispatch(addNewStart());
  try {
    const res = await userRequest.post(`/news`, New);
    dispatch(addNewSuccess(res.data));
    toast.success("Thêm tin tức thành công!");

  } catch (err) {
    dispatch(addNewFailure());
    toast.error("Thêm tin tức thất bại, hãy thử lại.");

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
    toast.success("Cập nhật tin nhắn thành công!");

  } catch (err) {
    dispatch(updateMessageFailure());
    toast.error("Cập nhật tin nhắn thất bại, hãy thử lại.");

  }
};
export const deleteMessage = async (id, dispatch) => {
  dispatch(deleteMessageStart());
  try {
    const res = await userRequest.delete(`/messages/${id}`);
    dispatch(deleteMessageSuccess(res.data));
    toast.success("Xóa tin nhắn thành công!");

  } catch (err) {
    dispatch(deleteMessageFailure());
    toast.error("Xóa tin nhắn thất bại, hãy thử lại.");

  }
};
