import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { Publish } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../requestMethods";
import { updateProduct } from "../../redux/apiCalls";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import JoditEditor from "jodit-react";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { useRef } from "react";
import { toast } from "react-toastify";
export default function Product() {
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [pStats, setPStats] = useState([]);
  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );
  const catSelector = useSelector((state) => state.category.categories);
  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );
  const [descSummary, setDescSummary] = useState(product.descSummary || "");
  const [descDetails, setDescDetails] = useState(product.descDetails || "");

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
  // update product
  const [inputs, setInputs] = useState({
    title: product.title,
    price: product.price,
  });

  const [cat, setCat] = useState([]);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleCat = (e) => {
    setCat(e.target.value.split(","));
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
    const updatedProduct = {};

    // Update the input fields that have non-empty values
    Object.entries(inputs).forEach(([key, value]) => {
      if (value.trim() !== "") {
        updatedProduct[key] = value;
      }
    });
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
          updatedProduct.imgs = downloadURLs; // Update the 'imgs' field with new URLs
          if (cat.length > 0) {
            updatedProduct.categories = cat;
          }
          if (descSummary.trim() !== "") {
            updatedProduct.descSummary = descSummary;
          }
          if (descDetails.trim() !== "") {
            updatedProduct.descDetails = descDetails;
          }

          updateProduct(productId, updatedProduct, dispatch);
        })
        .catch((error) => {
          // Error handling for file uploads
          console.error(error);
          toast.error("Failed to upload images. Please try again.");
        });
    } else {
      // If there are no new files, update the remaining non-empty fields
      if (cat.length > 0) {
        updatedProduct.categories = cat;
      }
      if (descSummary.trim() !== "") {
        updatedProduct.descSummary = descSummary;
      }
      if (descDetails.trim() !== "") {
        updatedProduct.descDetails = descDetails;
      }

      updateProduct(productId, updatedProduct, dispatch);
    }
  };

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get("orders/income?pid=" + productId);
        const list = res.data.sort((a, b) => {
          return a._id - b._id;
        });
        list.map((item) =>
          setPStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], Sales: item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [productId, MONTHS]);
  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product.imgs[0]} alt="" className="productInfoImg" />
            <span className="productName">{product.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{product._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">sales:</span>
              <span className="productInfoValue">5123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">in stock:</span>
              <span className="productInfoValue">{product.inStock}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <label>Product Name</label>
            <input
              type="text"
              name="title"
              placeholder={product.title}
              value={inputs.title} // Use value from state
              onChange={handleChange}
            />

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
            <label>Price</label>
            <input
              name="price"
              type="text"
              placeholder={product.price}
              value={inputs.price} // Use value from state
              onChange={handleChange}
            />
            <label>Categories</label>
            <select name="cat" onChange={handleCat} style={{fontSize:15}}>
              <option value={catSelector[0]}>--Chọn--</option>
              {catSelector.map((category) => (
                <option key={category._id} value={category.cat}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src={product.imgs[0]} alt="" className="productUploadImg" />
              <label for="file">
                <Publish />
              </label>
              <input
                type="file"
                required
                multiple
                id="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <button className="productButton" onClick={handleClick}>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
