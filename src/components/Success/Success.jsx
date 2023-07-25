import success from "../../assets/images/success.png";
import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
export default function Success({ title, message }) {
  const PopupContainer = styled.div`
    width: 400px;
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  const PopupButton = styled.button`
    width: 100%;
    margin-top: 50px;
    padding: 10px 0;
    background: #6fd649;
    color: #fff;
    border: 0;
    outline: none;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
  `;
  const Popup = styled.div`
    width: 400px;
    background: #fff;
    border-radius: 6px;
    position: absolute;
    top: 65%;
    z-index: 1000;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 0 30px 30px;
    color: #333;
  `;
  const PopupTextH2 = styled.h2`
    font-size: 38px;
    font-weight: 500;
    margin: 30px 0 10px;
  `;
  const PopupTextP = styled.p`
    font-size: 15px;
    padding: 20px 10px 0px 10px;
  `;
  const PopupSuccessImg = styled.img`
    width: 100px;
    margin-top: -150px;
    border-radius: 50%;
    position: relative;
    z-index: 10000;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  `;
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });
  const [open, setOpen] = useState(true);
  const loadPage = () => {
    window.location.reload();
    
  };
  const handleClose = () => {
    setOpen(false);
    loadPage();
  };
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <PopupContainer>
            <Popup>
              <PopupSuccessImg src={success} />
              <PopupTextH2>{title} </PopupTextH2>
              <PopupTextP>{message}</PopupTextP>
              <PopupButton onClick={handleClose}>Oke</PopupButton>
            </Popup>
          </PopupContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
}
