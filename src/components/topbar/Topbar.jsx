import React from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings,Person,SupervisorAccountSharp,ExitToApp } from "@material-ui/icons";
import { useDispatch,useSelector } from "react-redux";
import { logout } from "../../redux/apiCalls";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItemMatterial from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Avatar} from "@material-ui/core";
export default function Topbar() {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const logoutHandler = (e) => {
    e.preventDefault();
    logout(dispatch);
    document.location.href = "/login"
  };
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">admin</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          {user ? (
            <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button variant="outlined" {...bindTrigger(popupState)}>
                <Avatar style={{width:25,height:25,marginRight:5}}/>{user.username}
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItemMatterial onClick={popupState.close}>
                  <Person style={{paddingRight:10}}/> Profile
                  </MenuItemMatterial>
                  <MenuItemMatterial onClick={popupState.close}>
                  <SupervisorAccountSharp style={{paddingRight:10}}/>My account
                  </MenuItemMatterial>
                  <MenuItemMatterial onClick={popupState.close}>
                  <Settings style={{paddingRight:10}} /> Settings
                  </MenuItemMatterial>
                  <MenuItemMatterial onClick={logoutHandler}>
                  <ExitToApp style={{paddingRight:10}}/> Logout
                  </MenuItemMatterial>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
          ) : document.location.href = "/login"}
        </div>
      </div>
    </div>
  );
}
