import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import CategoryList from "./pages/categoryList/CategoryList";
import Category from "./pages/category/Category";
import OrderList from "./pages/orderList/OrderList";
import Order from "./pages/order/Order";
import MessageList from "./pages/messageList/MessageList";
import Message from "./pages/message/Message";
import Login from "./pages/login/Login";
import NewCategory from "./pages/newCategory/NewCategory";
import NewList from "./pages/newList/NewList";
import New from "./pages/new/New";
import NewNew from "./pages/newNew/NewNew";

function App() {
  const admin = useSelector((state) => state.user.currentUser?.isAdmin);
  const isAuthenticated = useSelector((state) => state.user.currentUser !== null);

  return (
    <Router>
      <Switch>
        <Route path="/login">
          {isAuthenticated ? <Redirect to="/" /> : <Login />}
        </Route>
        {admin && (
          <div>
            <Topbar />
            <div className="container">
              <Sidebar />
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/users">
                <UserList />
              </Route>
              <Route path="/user/:userId">
                <User />
              </Route>
              <Route path="/newUser">
                <NewUser />
              </Route>
              <Route path="/products">
                <ProductList />
              </Route>
              <Route path="/product/:productId">
                <Product />
              </Route>
              <Route path="/newproduct">
                <NewProduct/>
              </Route>
              <Route path="/categories">
                <CategoryList />
              </Route>
              <Route path="/category/:categoryId">
                <Category />
              </Route>
              <Route path="/newcategory">
                <NewCategory />
              </Route>
              <Route path="/orders">
                <OrderList />
              </Route>
              <Route path="/order/:orderId">
                <Order />
              </Route>
              <Route path="/messages">
                <MessageList />
              </Route>
              <Route path="/message/:messageId">
                <Message />
              </Route>
              <Route path="/news">
                <NewList />
              </Route>
              <Route path="/new/:newId">
                <New />
              </Route>
              <Route path="/newnew">
                <NewNew/>
              </Route>
            </div>
          </div>
        )}
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
