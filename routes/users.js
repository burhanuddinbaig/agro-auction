const express = require("express");
const auth = require("../middleware/validation");
const userController = require("../controller/user");
const validate = require("../helper/validate");
const { upload } = require("../controller/upload");
const fileUpload = require("../config/fileUpload");
const router = express.Router();

router.get("/checkSession", auth, userController.authentication);

router.post("/singUp", [validate.signUp], userController.signUp);

router.post("/login", userController.userLogin);

router.post("/addProduct", upload.single("image"), userController.addProduct);
router.post("/uploadProfilePic", fileUpload, userController.updateProfilePic);
router.post("/addBid", userController.addBid);
router.post("/listOnAuction", userController.listOnAuction);
router.post("/updateUserInfo", userController.updateUserInfo);
router.get("/getAllProducts", userController.fetchAllProducts);
router.get("/getAllUsers", userController.fetchAlUsers);
router.get("/getSingleProduct/:id", userController.fetchSingleProduct);
router.get("/getSingleUser/:id", userController.fetchSingleUser);
router.get("/deleteUser/:userId", userController.deleteUsers);
router.get("/deleteProduct/:productId", userController.deleteProducts);
router.get("/searchProduct", userController.searchProduct);
router.get("/createdProducts/:userId", userController.createdProducts);
router.post("/settleAuction", userController.auctionSettle);

module.exports = router;
