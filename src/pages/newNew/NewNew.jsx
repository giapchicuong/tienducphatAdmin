import { useState, useRef, useMemo } from "react";
import "./newNew.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { addNew } from "../../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import "react-quill/dist/quill.snow.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import JoditEditor from "jodit-react";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Success from "../../components/Success/Success";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { toast } from "react-toastify";
export default function NewNew() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
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
    setCat(e.target.value.split(","));
  };
  const [opendescSummary, setOpendescSummary] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const handleOpendescSummary = () => setOpendescSummary(true);
  const handleClosedescSummary = () => setOpendescSummary(false);
  const [opendescDetails, setOpendescDetails] = useState(false);
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
    uploader: { insertImageAsBase64URI: true},
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
  const handleClick = (e) => {
    e.preventDefault();
    
    const hasNonEmptyInput = Object.values(inputs).some(
      (value) => value.trim() !== ""
    );

    if (!hasNonEmptyInput) {
      toast.warning("Vui lòng điền vào ít nhất một ô trước khi tạo mới.");
      return;
    }
    if (file !== null) {
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
            const New = {
              ...inputs,
              img: downloadURL,
              categories: cat,
              descSummary: descSummary,
              descDetails: descDetails,
            };

            setOpenSuccess(true); // Open the popup when the button is clicked
            addNew(New, dispatch)
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
      toast.warning("Vui lòng nhập đầy đủ thông tin")
    }
  };

  return (
    <div className="newNew">
      <h1 className="addNewTitle">New New</h1>
      <form className="addNewForm">
        <div className="addNewLeft">
          <div className="addNewItem">
            <label>Image</label>
            <input
              required
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="addNewItem">
            <label>Title</label>
            <input
              required
              name="title"
              type="text"
              placeholder="Máy nén khí Ceccato"
              onChange={handleChange}
            />
          </div>
          <div className="addNewItem">
            <label>Categories</label>
            <select name="cat" onChange={handleCat}>
              <option value={cattt[0]}>--Chọn--</option>
              {cattt.map((category) => (
                <option value={category.cat}>{category.title}</option>
              ))}
            </select>
          </div>
          <div className="addNewItem">
            <label>Description Summary</label>
            <Button
              onClick={handleOpendescSummary}
              variant="outlined"
              style={{ color: "#000" }}
            >
              Nhập Mô Tả Tóm Tắt Tin Tức
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
                  Mô Tả Tóm Tắt Tin Tức
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
          <div className="addNewItem">
            <label>Description Details</label>
            <Button
              onClick={handleOpendescDetails}
              variant="outlined"
              style={{ color: "#000" }}
            >
              Nhập Mô Tả Chi Tiết Tin Tức
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
                  Mô Tả Chi Tiết Chi Tiết
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
          <button type="submit" onClick={handleClick} className="addNewButton">
            Create
          </button>
        </div>
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
