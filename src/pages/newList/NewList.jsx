import "./newList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteNew, getNews } from "../../redux/apiCalls";
import moment from "moment";
export default function NewList() {
  const dispatch = useDispatch();
  const news = useSelector((state) => state.new.news);

  useEffect(() => {
    getNews(dispatch);
  }, [dispatch]);

  const handleDelete = (id) => {
    deleteNew(id, dispatch);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "new",
      headerName: "Tựa đề",
      width: 350,
      renderCell: (params) => {
        return (
          <div className="newListItem">
            <img className="newListImg" src={params.row.img} alt="" />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "categories", headerName: "Đường dẫn", width: 200 },
    {
      field: "Date",
      headerName: "Ngày đăng",
      width: 250,
      valueFormatter: (params) => moment(params.value).fromNow(),
    },
    {
      field: "action",
      headerName: "Hành động",
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/new/" + params.row._id}>
              <button className="newListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="newListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="newList">
      <div className="newTitleContainer">
        <h1 className="newTitle">Tin tức</h1>
        <Link to="/newnew">
          <button className="newAddButton">Tạo mới</button>
        </Link>
      </div>
      <DataGrid
        rows={news}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}