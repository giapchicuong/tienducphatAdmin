import {
    CalendarToday,
    LocationSearching,
    MailOutline,
    PermIdentity,
    PhoneAndroid,
    Publish,
  } from "@material-ui/icons";
  import {
    ChatBubbleOutline,
  } from "@material-ui/icons";
  import { Link, useLocation } from "react-router-dom";
  import "./message.css";
  import { useDispatch, useSelector } from "react-redux";
  import { useState } from "react";
  
  import { updateMessage } from "../../redux/apiCalls";
  
  export default function Message() {
    const location = useLocation();
    const messageId = location.pathname.split("/")[2];
    const message = useSelector((state) =>
      state.message.messages.find((message) => message._id === messageId)
  );
  
  // update the message
  const [inputs, setInputs] = useState({});;
    const dispatch = useDispatch();
    const handleChange = (e) => {
      setInputs((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    };
    
    const handleClick = (e) => {
      e.preventDefault();
      const message = { ...inputs};
      updateMessage(messageId,message, dispatch);
      }; 
      
  
    return (
      <div className="message">
        <div className="messageTitleContainer">
          <h1 className="messageTitle">Edit Message</h1>
        </div>
        <div className="messageContainer">
          <div className="messageShow">
            <div className="messageShowTop">
              <div className="messageShowTopTitle">
                <span className="messageShowMessagename">{message.fullname || "Chưa nhập"}</span>
              </div>
            </div>
            <div className="messageShowBottom">
              <span className="messageShowTitle">Contact Details</span>
              <div className="messageShowInfo">
                <PhoneAndroid className="messageShowIcon" />
                <span className="messageShowInfoTitle">{message.phone|| "Chưa nhập"}</span>
              </div>
              <div className="messageShowInfo">
                <MailOutline className="messageShowIcon" />
                <span className="messageShowInfoTitle">{message.email || "Chưa nhập"}</span>
              </div>
              <div className="messageShowInfo">
                <ChatBubbleOutline className="messageShowIcon" />
                <span className="messageShowInfoTitle">{message.message || "Chưa nhập"}</span>
              </div>
            </div>
          </div>
          <div className="messageUpdate">
            <span className="messageUpdateTitle">Edit</span>
            <form className="messageUpdateForm">
              <div className="messageUpdateLeft">
                <div className="messageUpdateItem">
                  <label>Status</label>
                  <input
                    type="text"
                    name="address"
                    placeholder={message.status}
                    className="messageUpdateInput"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="messageUpdateRight">
                <button className="messageUpdateButton" onClick={handleClick}>Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  