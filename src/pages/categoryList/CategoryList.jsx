import "./categoryList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getCategories } from "../../redux/apiCalls";

export default function CategoryList() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  useEffect(() => {
    getCategories(dispatch);
  }, [dispatch]);

  const handleDelete = (id) => {
    deleteCategory(id, dispatch);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 300 },
    {
      field: "category",
      headerName: "Tên danh mục",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="categoryListItem">
            <img className="categoryListImg" src={params.row.img} alt="" />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "cat", headerName: "Đường dẫn", width: 300 },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/category/" + params.row._id}>
              <button className="categoryListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="categoryListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="categoryList">
      <div className="categoryTitleContainer">
        <h1 className="categoryTitle">Danh mục</h1>
        <Link to="/newcategory">
          <button className="categoryAddButton">Tạo mới</button>
        </Link>
      </div>
      <DataGrid
        rows={categories}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}