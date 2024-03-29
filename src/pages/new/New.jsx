import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import CodeIcon from "@mui/icons-material/Code";
import { Link, useLocation } from "react-router-dom";
import "./new.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { updateNew } from "../../redux/apiCalls";
import "react-quill/dist/quill.snow.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import JoditEditor from "jodit-react";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { useRef } from "react";
import { toast } from "react-toastify";
export default function New() {
  const catSelector = useSelector((state) => state.category.categories);
  const location = useLocation();
  const newId = location.pathname.split("/")[2];
  const New = useSelector((state) =>
    state.new.news.find((New) => New._id === newId)
  );

  // update the new
  const [cat, setCat] = useState([]);
  const [inputs, setInputs] = useState({
    title: New.title,
  });

  const [file, setFile] = useState(null);
  const [descSummary, setDescSummary] = useState(New.descSummary || "");
  const [descDetails, setDescDetails] = useState(New.descDetails || "");

  const [opendescSummary, setOpendescSummary] = useState(false);
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
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleCat = (e) => {
    setCat(e.target.value);
    
  };
  
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let downloadURL = New.img; // Default value if the file is not updated

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
            const updatedNew = {
              ...inputs,
              img: downloadURL,
              categories: cat,
              descSummary: descSummary,
              descDetails: descDetails,
            };
            updateNew(newId, updatedNew, dispatch);
          }
        );
      } else {
        // If no new file is selected, update the category with other fields
        const updatedNew = {
          ...inputs,
          img: downloadURL,
          categories: cat,
          descSummary: descSummary,
          descDetails: descDetails,
        };
        updateNew(newId, updatedNew, dispatch);
      }
    } catch (error) {
      console.error("Error updating category: ", error);
    }
  };

  return (
    <div className="new">
      <div className="newTitleContainer">
        <h1 className="newTitle">Edit New</h1>
        <Link to="/newNew">
          <button className="newAddButton">Create</button>
        </Link>
      </div>
      <div className="newContainer">
        <div className="newShow">
          <div className="newShowTop">
            <img
              src={
                New.img ||
                "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"
              }
              alt={New.title}
              className="newShowImg"
            />
            <div className="newShowTopTitle">
              <span className="newShowNewname">{New.title || "Chưa nhập"}</span>
              {/* <span className="newShowNewTitle">Software Engineer</span> */}
            </div>
          </div>
          <div className="newShowBottom">
            <span className="newShowTitle">New Details</span>
            <div className="newShowInfo">
              <PhoneAndroid className="newShowIcon" />
              <span className="newShowInfoTitle">
                {New.title || "Chưa nhập"}
              </span>
            </div>
            <div className="newShowInfo">
              <CodeIcon className="newShowIcon" />
              <span className="newShowInfoTitle">
                {New.categories || "Chưa nhập"}
              </span>
            </div>
          </div>
        </div>
        <div className="newUpdate">
          <span className="newUpdateTitle">Edit</span>
          <form className="newUpdateForm">
            <div className="newUpdateLeft">
              <div className="newUpdateItem">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder={New.title}
                  value={inputs.title}
                  className="newUpdateInput"
                  onChange={handleChange}
                />
              </div>
              <div className="newUpdateItem">
                <label>Categories</label>
                <select
                  name="cat"
                  onChange={handleCat}
                  style={{ fontSize: 15 }}
                >
                  <option value={catSelector[0]}>--Chọn--</option>
                  {catSelector.map((category) => (
                    <option key={category._id} value={category.cat}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="newUpdateItem">
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
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
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
                      value={descSummary} // Use the stored content
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
              <div className="newUpdateItem">
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
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Mô Tả Chi Tiết Tin Tức
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
                      value={descDetails} // Use the stored content
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
            </div>
            <div className="newUpdateRight">
              <div className="newUpdateUpload">
                <img
                  className="newUpdateImg"
                  src={
                    New.img ||
                    "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"
                  }
                  alt={New.title}
                />
                <label htmlFor="file">
                  <Publish className="newUpdateIcon" />
                </label>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button className="newUpdateButton" onClick={handleClick}>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
