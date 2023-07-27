import "./messageList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, deleteMessage } from "../../redux/apiCalls";
import { Visibility } from "@material-ui/icons";
import moment from "moment";
export default function MessageList() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages);

  useEffect(() => {
    getMessages(dispatch);
  }, [dispatch]);


  const handleDelete = async (id) => {
    try {
      await deleteMessage(id, dispatch);
      getMessages(dispatch);
    } catch (error) {}
    getMessages(dispatch);
  };
  const columns = [
    { field: "fullname", headerName: "Họ tên", width: 250 },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      width: 250,
    },
    {
      field: "Date",
      headerName: "Ngày gửi",
      width: 250,
      valueFormatter: (params) => moment(params.value).fromNow(),
    },
    {
      field: "Hành động",
      headerName: "Action",
      width: 160,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/message/" + params.row._id}>
              <button className="messageListEdit">Edit</button>
            </Link>
            {/* <button className="widgetSmButton"> */}
            {/* <Visibility /> */}
            {/* </button> */}

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
    <div className="messageList">
      <div className="messageTitleContainer">
        <h1 className="messageTitle">Tin nhắn</h1>
      </div>
      <DataGrid
        rows={messages}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
