import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import "./order.css";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { updateOrder } from "../../redux/apiCalls";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = ["Nhận đơn hàng", "Đang xử lý", "Đã giải quyết xong"];

const Product = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const ProductName = styled.span`
  font-size: 15px;
`;

const ProductId = styled.span`
  font-size: 15px;
`;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 15px;
  margin: 5px;
`;
export default function Order() {
  const location = useLocation();
  const orderId = location.pathname.split("/")[2];
  const order = useSelector((state) =>
    state.order.orders.find((order) => order._id === orderId)
  );

  // update the order
  const [inputs, setInputs] = useState({});
  console.log(inputs);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    const order = { ...inputs };
    updateOrder(orderId, order, dispatch);
  };
  const [activeStep, setActiveStep] = useState(1);
  
  useEffect(() => {
    if (order.status === "Nhận đơn hàng") {
      setActiveStep(1);
    } else if (order.status === "Đang xử lý") {
      setActiveStep(2);
    } else if (order.status === "Đã giải quyết xong") {
      setActiveStep(3);
    }
  }, [order.status]);

  const [skipped, setSkipped] = useState(new Set());
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // console.log("Bước hiện tại:", steps[activeStep]);
    setSkipped(newSkipped);
    handleChange({ target: { name: "status", value: steps[activeStep] } }); // Lưu bước hiện tại vào inputs
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    handleChange({
      target: { name: "status", value: steps[activeStep - 1] },
    }); // Lưu bước hiện tại vào inputs
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <div className="order">
      <div className="orderTitleContainer">
        <h1 className="orderTitle">Edit Order</h1>
      </div>
      <div className="orderContainer">
        <div className="orderShow">
          <div className="orderShowTop">
            <div className="orderShowTopTitle">
              <span className="orderShowOrdername">
                {order.fullname || "Chưa nhập"}
              </span>
            </div>
          </div>
          <div className="orderShowBottom">
            <span className="orderShowTitle">Contact Details</span>
            <div className="orderShowInfo">
              <PhoneAndroid className="orderShowIcon" />
              <span className="orderShowInfoTitle">
                0{order.phone || "Chưa nhập"}
              </span>
            </div>
            <div className="orderShowInfo">
              <MailOutline className="orderShowIcon" />
              <span className="orderShowInfoTitle">
                {order.email || "Chưa nhập"}
              </span>
            </div>
            <div className="orderShowInfo">
              <LocationSearching className="orderShowIcon" />
              <span className="orderShowInfoTitle">
                {order.address || "Chưa nhập"}
              </span>
            </div>
          </div>
        </div>
        <div className="orderUpdate">
          <span className="orderUpdateTitle">
            Cập nhật tình trạng đơn đặt hàng
          </span>
          <form className="orderUpdateForm">
            <div className="orderUpdateLeft">
              <div className="orderUpdateItem">
                <label>Sản phẩm đã mua</label>
                {order.products.map((product) => (
                  <Product>
                    <ProductDetail>
                      <Image src={product.productImg} />
                      <Details>
                        <ProductName>
                          <b>Tên sản phẩn:</b> {product.productName}
                        </ProductName>
                        <ProductId>
                          <b>Mã ID:</b> {product.productId}
                        </ProductId>
                      </Details>
                    </ProductDetail>
                    <PriceDetail>
                      <ProductAmountContainer>
                        <ProductAmount>
                          {" "}
                          <label>Số lượng: </label>
                          {product.quantity}
                        </ProductAmount>
                      </ProductAmountContainer>
                    </PriceDetail>
                  </Product>
                ))}
              </div>
              <div className="orderUpdateItem">
                <label>Trạng thái</label>
                <Box sx={{ width: "100%" }}>
                  <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                      const stepProps = {};
                      const labelProps = {};
                      if (isStepOptional(index)) {
                        labelProps.optional = (
                          <Typography variant="caption">Optional</Typography>
                        );
                      }
                      if (isStepSkipped(index)) {
                        stepProps.completed = false;
                        handleChange();
                      }
                      return (
                        <Step key={label} {...stepProps}>
                          <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                  {activeStep === steps.length ? (
                    <Fragment>
                      <Typography sx={{ mt: 2, mb: 1 }}>
                        Tất cả các bước đã hoàn thành
                      </Typography>
                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleReset}>Reset</Button>
                      </Box>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <Typography sx={{ mt: 2, mb: 1 }}>
                        Bước {activeStep + 1}
                      </Typography>
                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Button
                          color="inherit"
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Quay lại
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />

                        <Button onClick={handleNext}>
                          {activeStep === steps.length - 1 ? "Finish" : "Tiếp"}
                        </Button>
                      </Box>
                    </Fragment>
                  )}
                </Box>
              </div>
            </div>
            <div className="orderUpdateRight">
              <button className="orderUpdateButton" onClick={handleClick}>
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
