import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import "./category.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { updateCategory } from "../../redux/apiCalls";

export default function Category() {
  const location = useLocation();
  const categoryId = location.pathname.split("/")[2];
  const category = useSelector((state) =>
    state.category.categories.find((category) => category._id === categoryId)
  );

  // update the category
  const [inputs, setInputs] = useState({
    title: category.title,
    cat: category.cat,
  });
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      let downloadURL = category.img; // Default value if the file is not updated

      if (file) {
        const fileName = new Date().getTime() + file.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Monitor the upload progress
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Error uploading file: ", error);
          },
          async () => {
            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const updatedCategory = {
              ...category,
              ...inputs,
              img: downloadURL,
            };
            updateCategory(categoryId, updatedCategory, dispatch);
          }
        );
      } else {
        // If no new file is selected, update the category with other fields
        const updatedCategory = {
          ...category,
          ...inputs,
        };
        updateCategory(categoryId, updatedCategory, dispatch);
      }
    } catch (error) {
      console.error("Error updating category: ", error);
    }
  };

  return (
    <div className="category">
      <div className="categoryTitleContainer">
        <h1 className="categoryTitle">Edit Category</h1>
        <Link to="/newCategory">
          <button className="categoryAddButton">Create</button>
        </Link>
      </div>
      <div className="categoryContainer">
        <div className="categoryShow">
          <div className="categoryShowTop">
            <img
              src={
                category.img ||
                "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"
              }
              alt={category.title}
              className="categoryShowImg"
            />
            <div className="categoryShowTopTitle">
              <span className="categoryShowCategoryname">
                {category.title || "Chưa nhập"}
              </span>
              {/* <span className="categoryShowCategoryTitle">Software Engineer</span> */}
            </div>
          </div>
          <div className="categoryShowBottom">
            <span className="categoryShowTitle">Category Details</span>
            <div className="categoryShowInfo">
              <PhoneAndroid className="categoryShowIcon" />
              <span className="categoryShowInfoTitle">
                {category.title || "Chưa nhập"}
              </span>
            </div>
            <div className="categoryShowInfo">
              <MailOutline className="categoryShowIcon" />
              <span className="categoryShowInfoTitle">
                {category.cat || "Chưa nhập"}
              </span>
            </div>
          </div>
        </div>
        <div className="categoryUpdate">
          <span className="categoryUpdateTitle">Edit</span>
          <form className="categoryUpdateForm">
            <div className="categoryUpdateLeft">
              <div className="categoryUpdateItem">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder={category.title}
                  value={category.title}
                  className="categoryUpdateInput"
                  onChange={handleChange}
                />
              </div>
              <div className="categoryUpdateItem">
                <label>Path</label>
                <input
                  type="text"
                  name="cat"
                  placeholder={category.cat}
                  value={category.cat}
                  className="categoryUpdateInput"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="categoryUpdateRight">
              <div className="categoryUpdateUpload">
                <img
                  className="categoryUpdateImg"
                  src={
                    category.img ||
                    "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"
                  }
                  alt={category.title}
                />
                <label htmlFor="file">
                  <Publish className="categoryUpdateIcon" />
                </label>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button className="categoryUpdateButton" onClick={handleClick}>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
