import { useState } from "react";
import "./newCategory.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { addCategory } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";
import Success from "../../components/Success/Success";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { toast } from "react-toastify";
export default function NewCategory() {
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState([]);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
//   const handleCat = (e) => {
//     setCat(e.target.value.split(","));
//   };

  const handleClick = (e) => {
    e.preventDefault();
    if(file != null) {
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const category = { ...inputs, img: downloadURL };
          addCategory(category, dispatch);
          setOpenSuccess(true);
            setTimeout(() => {
              setOpenPopup(true);
            }, 1000);
        });
      }
    );
    
  }else {
      toast.warning("Vui lòng chọn ảnh cần thêm")
  }
  };

  return (
    <div className="newCategory">
      <h1 className="addCategoryTitle">New Category</h1>
      <form className="addCategoryForm">
        <div className="addCategoryItem">
          <label>Image</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="addCategoryItem">
          <label>Title</label>
          <input
            name="title"
            type="text"
            placeholder="Máy nén khí"
            onChange={handleChange}
          />
        </div>
        <div className="addCategoryItem">
          <label>Categories</label>
          <input name="cat" type="text" placeholder="compression,compressionPath" onChange={handleChange} />
        </div>
        <button onClick={handleClick} className="addCategoryButton">
          Create
        </button>
      </form>
    </div>
  );
}
