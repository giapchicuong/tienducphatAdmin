import { useState, useRef, useMemo } from "react";
import "./newProduct.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { addProduct } from "../../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import "react-quill/dist/quill.snow.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import JoditEditor from "jodit-react";
import Success from "../../components/Success/Success";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { toast } from "react-toastify";
export default function NewProduct() {
  const [inputs, setInputs] = useState({});
  const [cat, setCat] = useState([]);
  const [descSummary, setDescSummary] = useState("");
  const [descDetails, setDescDetails] = useState("");
  const dispatch = useDispatch();
  const cattt = useSelector((state) => state.category.categories);
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleCat = (e) => {
    setCat(e.target.value);
  };
  const [opendescSummary, setOpendescSummary] = useState(false);
  const [opendescDetails, setOpendescDetails] = useState(false);
  const handleOpendescSummary = () => setOpendescSummary(true);
  const handleClosedescSummary = () => setOpendescSummary(false);
  const handleOpendescDetails = () => setOpendescDetails(true);
  const handleClosedescDetails = () => setOpendescDetails(false);
  const editor = useRef(null);
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    height: "450px",
    width: "100%",
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "font",
      "fontsize",
      'outdent', 'indent',  '|',
       "lineHeight",
      "brush",
      "paragraph",
      "|",
      "image",
      "table",
      "link",
      "|",
      "left",
      "center",
      "right",
      "justify",
      "|",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
    ],
    enableDragAndDropFileToEditor: true,
    uploader: { insertImageAsBase64URI: true },
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    toolbarAdaptive: true,
    toolbarSticky: true,
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const orderedFiles = selectedFiles.sort((a, b) => {
      // Sắp xếp tệp tin theo thứ tự chọn của người dùng
      return a.lastModified - b.lastModified;
    });
    setFiles(orderedFiles);
  };
  
  const handleClick = (e) => {
    e.preventDefault();
  // Check if at least one input field is non-empty
    const hasNonEmptyInput = Object.values(inputs).some(
      (value) => value.trim() !== ""
    );

    if (!hasNonEmptyInput) {
      // Display an error message or take appropriate action when no inputs are filled
      toast.warning("Vui lòng điền vào ít nhất một ô  trước khi cập nhật.");
      return;
    }
    if (files.length > 0) {
      const uploadPromises = files.map((file) => {
        const fileName = new Date().getTime() + file.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Observe state change events
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
              reject(error);
            },
            () => {
              // Handle successful uploads on complete
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  resolve(downloadURL);
                })
                .catch((error) => {
                  reject(error);
                });
            }
          );
        });
      });
  
      Promise.all(uploadPromises)
        .then((downloadURLs) => {
          const product = {
            ...inputs,
            imgs: downloadURLs, // Lưu trữ các URL tải xuống trong imgs
            categories: cat,
            descSummary: descSummary,
            descDetails: descDetails,
          };
          addProduct(product, dispatch);
        })
        .catch((error) => {
          // Xử lý lỗi khi tải lên không thành công
          console.error(error);
        });
    } else {
      toast.warning("Vui lòng chọn ít nhất một tệp ảnh")
    }
  };
  
  

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Product</h1>
      <form className="addProductForm">
        <div className="addProductLeft">
          <div className="addProductItem">
            <label>Image</label>
            <input
              required
              type="file"
              id="file"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <div className="addProductItem">
            <label>Title</label>
            <input
              required
              name="title"
              type="text"
              placeholder="Máy nén khí Ceccato"
              onChange={handleChange}
            />
          </div>
          <div className="addProductItem">
            <label>Model</label>
            <input
              required
              name="model"
              type="text"
              placeholder="Model:CSM 5.5 – CSM100"
              onChange={handleChange}
            />
          </div>
          <div className="addProductItem">
            <label>Xuất xứ</label>
            <input
              required
              name="code"
              type="text"
              placeholder="Xuất xứ :Ceccato"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="addProductRight">
          <div className="addProductItem">
            <label>Price</label>
            <input
              required
              name="price"
              type="text"
              placeholder="Liên Hệ"
              onChange={handleChange}
            />
          </div>
          <div className="addProductItem">
            <label>Categories</label>
            <select name="cat" onChange={handleCat}>
              <option value={cattt[0]}>--Chọn--</option>
              {cattt.map((category) => (
                <option key={category._id} value={category.cat}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          <div className="addProductItem">
            <label>Description Summary</label>
            <Button
              onClick={handleOpendescSummary}
              variant="outlined"
              style={{ color: "#000" }}
            >
              Nhập Mô Tả Tóm Tắt Sản Phẩm
            </Button>
            <Modal
              keepMounted
              open={opendescSummary}
              onClose={handleClosedescSummary}
              aria-labelledby="keep-mounted-modal-title"
              aria-describedby="keep-mounted-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Mô Tả Tóm Tắt Sản Phẩm
                  <br />
                </Typography>
                <Button
                  onClick={handleClosedescSummary}
                  style={{
                    marginBottom: "10px",
                    position: "absolute",
                    right: "0",
                    top: 0,
                  }}
                >
                  <CloseIcon />
                </Button>
                <JoditEditor
                  ref={editor}
                  value={descSummary}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) => setDescSummary(newContent)}
                  onChange={(newContent) => {}}
                />
                <Button
                  onClick={handleClosedescSummary}
                  color="success"
                  variant="contained"
                  style={{
                    position: "absolute",
                    right: "30px",
                    bottom: "20px",
                  }}
                >
                  Thêm
                </Button>
              </Box>
            </Modal>
          </div>
          <div className="addProductItem">
            <label>Description Details</label>
            <Button
              onClick={handleOpendescDetails}
              variant="outlined"
              style={{ color: "#000" }}
            >
              Nhập Mô Tả Chi Tiết Sản Phẩm
            </Button>
            <Modal
              keepMounted
              open={opendescDetails}
              onClose={handleClosedescDetails}
              aria-labelledby="keep-mounted-modal-title"
              aria-describedby="keep-mounted-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Mô Tả Chi Tiết Sản Phẩm
                  <br />
                </Typography>
                <Button
                  onClick={handleClosedescDetails}
                  style={{
                    marginBottom: "10px",
                    position: "absolute",
                    right: "0",
                    top: 0,
                  }}
                >
                  <CloseIcon />
                </Button>
                <JoditEditor
                  ref={editor}
                  value={descDetails}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) => setDescDetails(newContent)}
                  onChange={(newContent) => {}}
                />
                <Button
                  onClick={handleClosedescDetails}
                  color="success"
                  variant="contained"
                  style={{
                    position: "absolute",
                    right: "30px",
                    bottom: "20px",
                  }}
                >
                  Thêm
                </Button>
              </Box>
            </Modal>
          </div>
          <button
            type="submit"
            onClick={handleClick}
            className="addProductButton"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
