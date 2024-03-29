import axios from "axios";

const BASE_URL = "https://tienducphatbackend.onrender.com/api/";
// const BASE_URL = "http://localhost:5000/api/";
const localStorageValue = localStorage.getItem("persist:root");
const currentUser = localStorageValue ? JSON.parse(JSON.parse(localStorageValue).user).currentUser : null;
const TOKEN = currentUser?.accessToken;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});

  // Thêm sự kiện beforeunload vào mã của bạn
  window.addEventListener("beforeunload", () => {
    // Xóa thông tin đăng nhập khỏi localStorage khi người dùng thoát trình duyệt
    localStorage.removeItem("persist:root");
  });