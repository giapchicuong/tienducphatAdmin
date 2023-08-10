import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/apiCalls";
import "./login.css";
import wave from "../../assets/images/wave.png";
import bg from "../../assets/images/bg.svg";
import avatar from "../../assets/images/avatar.svg";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { Visibility } from "@material-ui/icons";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const addClass = (event) => {
      const parent = event.target.parentNode.parentNode;
      parent.classList.add("focus");
    };

    const removeClass = (event) => {
      const parent = event.target.parentNode.parentNode;
      if (event.target.value === "") {
        parent.classList.remove("focus");
      }
    };

    const inputs = document.querySelectorAll(".input");
    inputs.forEach((input) => {
      input.addEventListener("focus", addClass);
      input.addEventListener("blur", removeClass);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", addClass);
        input.removeEventListener("blur", removeClass);
      });
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    login(dispatch, { username, password });
  };
  const handleShowPassword = () => {
    // Function to toggle the value of showPassword state
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      <img className="Loginwave" src={wave} alt="wave" />
      <div className="Logincontainer">
        <div className="Loginimg">
          <img src={bg} alt="background" />
        </div>
        <div className="login-content">
          <form className="form">
            <img src={avatar} alt="avatar" />
            <h2 className="title">Welcome</h2>
            <div className="input-div one">
              <div className="Icon">
                <PersonIcon style={{ transition: ".3s", color: "#ccc" }} />
              </div>
              <div className="div">
                <h5>Username</h5>
                <input
                  type="text"
                  className="input"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="input-div pass">
              <div className="Icon">
                <LockIcon style={{ transition: ".3s", color: "#ccc" }} />
              </div>
              <div className="div">
                <h5>Password</h5>
                <input
                  type={showPassword ? "text" : "password"} // Use the showPassword state to determine the input type
                  className="input"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="show-password-icon"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <VisibilityOffIcon
                      style={{ transition: ".3s", color: "#ccc" }}
                    />
                  ) : (
                    <Visibility style={{ transition: ".3s", color: "#ccc" }} />
                  )}
                </div>
              </div>
            </div>
            <div className="ForgotPassword">Forgot Password?</div>
            <input
              type="submit"
              className="LoginButton"
              value="Login"
              onClick={handleClick}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
