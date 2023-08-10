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
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { toast } from "react-toastify";
export default function NewCategory() {
  const [openSuccess, setOpenSuccess] = useState(false);
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState([]);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  function removeVietnameseAccents(input) {
    const map = {
      à: "a",
      á: "a",
      ả: "a",
      ã: "a",
      ạ: "a",
      ă: "a",
      ắ: "a",
      ằ: "a",
      ẵ: "a",
      ặ: "a",
      ẳ: "a",
      â: "a",
      ầ: "a",
      ấ: "a",
      ậ: "a",
      ẫ: "a",
      ẩ: "a",
      è: "e",
      é: "e",
      ẻ: "e",
      ẽ: "e",
      ẹ: "e",
      ê: "e",
      ề: "e",
      ế: "e",
      ệ: "e",
      ễ: "e",
      ể: "e",
      ì: "i",
      í: "i",
      ỉ: "i",
      ĩ: "i",
      ị: "i",
      ò: "o",
      ó: "o",
      ỏ: "o",
      õ: "o",
      ọ: "o",
      ô: "o",
      ồ: "o",
      ố: "o",
      ộ: "o",
      ỗ: "o",
      ổ: "o",
      ơ: "o",
      ờ: "o",
      ớ: "o",
      ợ: "o",
      ỡ: "o",
      ở: "o",
      ù: "u",
      ú: "u",
      ủ: "u",
      ũ: "u",
      ụ: "u",
      ư: "u",
      ừ: "u",
      ứ: "u",
      ự: "u",
      ữ: "u",
      ử: "u",
      ỳ: "y",
      ý: "y",
      ỷ: "y",
      ỹ: "y",
      ỵ: "y",
      đ: "d",
    };

    return input.replace(/[\W\w]/g, (char) => map[char] || char);
  }

  const handleClick = (e) => {
    e.preventDefault();
    e.preventDefault();
    const title = inputs.title || ""; // Get the title value or set it as an empty string
    const cleanTitle = removeVietnameseAccents(title); // Remove accents from title
    const categories =
      inputs.cat || cleanTitle.replace(/\s+/g, "").toLowerCase(); // Use the entered category or generate from cleaned title

    const hasNonEmptyInput = Object.values(inputs).some(
      (value) => value.trim() !== ""
    );

    if (!hasNonEmptyInput) {
      toast.warning("Vui lòng điền vào ít nhất một ô trước khi cập nhật.");
      return;
    }
    if (file != null) {
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
            const category = {
              ...inputs,
              img: downloadURL,
              cat: categories, // Use the categories variable
            };
            setOpenSuccess(true); // Open the popup when the button is clicked
            addCategory(category, dispatch)
              .then(() => {
                setOpenSuccess(false);
              })
              .catch((error) => {
                // Handle error if category addition fails
                toast.warning(error);
                setOpenSuccess(false);
              });
          });
        }
      );
    } else {
      toast.warning("Vui lòng chọn ảnh cần thêm");
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
        {/* <div className="addCategoryItem">
          <label>Categories</label>
          <input
            name="cat"
            type="text"
            placeholder="compression,compressionPath"
            onChange={handleChange}
          />
        </div> */}
        <button onClick={handleClick} className="addCategoryButton">
         Create
        </button>
      </form>
      {openSuccess ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openSuccess}
        >
          <CircularProgress color="info" />
        </Backdrop>
      ) : (
        ""
      )}
    </div>
  );
}
