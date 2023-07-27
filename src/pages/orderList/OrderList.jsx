import "./orderList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders, deleteOrder } from "../../redux/apiCalls";
import { Visibility } from "@material-ui/icons";
import moment from "moment";

export default function OrderList() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);

  useEffect(() => {
    getOrders(dispatch);
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id, dispatch);
      getOrders(dispatch);
    } catch (error) {}
    getOrders(dispatch);
  };
  const columns = [
    { field: "fullname", headerName: "Họ tên", width: 250 },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "date",
      headerName: "Ngày đặt hàng",
      width: 220,
      valueFormatter: (params) => moment(params.value).fromNow(),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 220,
    },
    {
      field: "action",
      headerName: "Action",
      width: 220,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/order/" + params.row._id}>
              {/* <button className="orderListEdit">Xem</button> */}
              <button className="widgetSmButton">
                <Visibility className="orderListVisibility" />
              </button>
            </Link>

            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="orderList">
      <div className="orderTitleContainer">
        <h1 className="orderTitle">Đơn đặt hàng</h1>
      </div>
      <DataGrid
        rows={orders}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
