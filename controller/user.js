const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const imageupload = require("../config/fileUpload");

let user = new Users();
const auctionSettle = async (req, res, next) => {
  let productId = req.body.productId;
  let auctionId = req.body.auctionId;
  let reserveQuantity = req.body.reserveQuantity;

  if (productId) {
    try {
      const [getData] = await user.fetchSingleProduct(productId);

      let newQuantity = getData[0].quantity - reserveQuantity;

      const result = await user.settleAuction(auctionId);
      const updateProductQuantity = await user.updateProductQuantity(
        productId,
        newQuantity
      );

      if (result) {
        return res
          .status(201)
          .json({ message: "Auction Settled Successfully" });
      } else {
        return next({ code: 404, message: "no data found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const createdProducts = async (req, res, next) => {
  try {
    const productInfo = [];
    let userId = req.params.userId;
    const [result] = await user.createdPprducts(userId);
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          userId: rowsData.userId,
          username: rowsData.username,
          productId: rowsData.productId,
          productTitle: rowsData.title,
          productDescription: rowsData.description,
          rate: rowsData.rate,
          quantity: rowsData.quantity,
          image: rowsData.image,
          status: rowsData.status,
          isListed: rowsData.isListed,
          reservePrice: rowsData.reservePrice,
          reserveQuantity: rowsData.reserveQuantity,
          highestBid: rowsData.highestBid,
          endTime: rowsData.endTime,
          createdAt: rowsData.createdAt,
        };
        productInfo.push(data);
      });

      return res.status(201).json({
        createdProducts: productInfo,
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const searchProduct = async (req, res, next) => {
  let title = req.query.title;
  if (title) {
    try {
      const products = [];

      const [result] = await user.searchProduct(title);
      if (result.length > 0) {
        result.forEach((rowsData) => {
          let data = {
            productId: rowsData.productId,
            productTitle: rowsData.title,
            productDescription: rowsData.description,
            rate: rowsData.rate,
            quantity: rowsData.quantity,
            image: rowsData.image,
            status: rowsData.status,
            isListed: rowsData.isListed,
            createdAt: rowsData.createdAt,
          };
          products.push(data);
        });

        return res.status(201).json({
          products: products,
        });
      } else {
        return next({ products: products });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 401, message: "no data found" });
  }
};
const deleteProducts = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
     * - `productId`
   
    
 
     */
  let productId = req.params.productId;

  if (productId) {
    try {
      const result = await user.deleteProduct(productId);

      if (result) {
        return res
          .status(201)
          .json({ message: " Product deleted Successfully" });
      } else {
        return next({ code: 404, message: "no data found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const deleteUsers = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
     * - `userId`
   
    
 
     */
  let userId = req.params.userId;

  if (userId) {
    try {
      const result = await user.deleteUser(userId);

      if (result) {
        return res.status(201).json({ message: " User deleted Successfully" });
      } else {
        return next({ code: 404, message: "no data found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

const fetchAllProducts = async (req, res, next) => {
  try {
    const productInfo = [];

    const [result] = await user.fetchAllProducts();
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          userId: rowsData.userId,
          username: rowsData.username,
          productId: rowsData.productId,
          productTitle: rowsData.title,
          productDescription: rowsData.description,
          rate: rowsData.rate,
          quantity: rowsData.quantity,
          image: rowsData.image,
          status: rowsData.status,
          isListed: rowsData.isListed,
          reservePrice: rowsData.reservePrice,
          reserveQuantity: rowsData.reserveQuantity,
          highestBid: rowsData.highestBid,
          endTime: rowsData.endTime,
          createdAt: rowsData.createdAt,
        };
        productInfo.push(data);
      });

      return res.status(201).json({
        productInfo: productInfo,
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const fetchAlUsers = async (req, res, next) => {
  try {
    const users = [];

    const [result] = await user.fetchAll();
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          userId: rowsData.userId,
          username: rowsData.username,
          email: rowsData.email,
          description: rowsData.description,
          location: rowsData.location,
          role: rowsData.role,
          cnic: rowsData.cnic,
          image: rowsData.image,
        };
        users.push(data);
      });

      return res.status(201).json({
        users: users,
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};

const fetchSingleProduct = async (req, res, next) => {
  let id = req.params.id;

  try {
    const [data] = await user.fetchSingleProduct(id);
    if (data.length > 0) {
      data.forEach((rowsData) => {
        let data1 = {
          userId: rowsData.userId,
          username: rowsData.username,
          productId: rowsData.productId,
          productTitle: rowsData.title,
          productDescription: rowsData.description,
          rate: rowsData.rate,
          quantity: rowsData.quantity,
          image: rowsData.image,
          status: rowsData.status,
          isListed: rowsData.isListed,
          auctionId: rowsData.auctionId,
          reservePrice: rowsData.reservePrice,
          reserveQuantity: rowsData.reserveQuantity,
          highestBid: rowsData.highestBid,
          endTime: rowsData.endTime,
          createdAt: rowsData.createdAt,
        };

        return res.status(201).json({
          productInfo: data1,
        });
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (err) {
    return next({ code: 401, message: err });
  }
};

const fetchSingleUser = async (req, res, next) => {
  let id = req.params.id;

  try {
    const [data] = await user.fetchSingleUser(id);
    if (data.length > 0) {
      data.forEach((rowsData) => {
        let data1 = {
          userId: rowsData.userId,
          username: rowsData.username,
          email: rowsData.email,
          description: rowsData.description,
          location: rowsData.location,
          role: rowsData.role,
          cnic: rowsData.cnic,
          image: rowsData.image,
        };

        return res.status(201).json({
          userInfo: data1,
        });
      });
    } else {
      return next({ code: 404, message: "no data found" });
    }
  } catch (err) {
    return next({ code: 401, message: err });
  }
};
const addProduct = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
     * - `title`,
     * - `description`,
     * - `rate`,
     * - `quantity`,
     * - `userId`
 
     */
  let payload = req.body;
  let image = req.file.filename;
  if (payload.title && payload.description && payload.userId) {
    try {
      const result = await user.addProduct(payload, image);
      if (result) {
        return res.status(201).json({ message: " Product Added Successfully" });
      } else {
        return next({ code: 404, message: "no data found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const addBid = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
     * - `userId`,
     * - `productId`,
     * - `price`,
     * - `auctionId`,
   
    
 
     */
  let payload = req.body;

  if (payload.productId && payload.price && payload.userId) {
    try {
      const result = await user.addBid(payload);
      const updateTb = await user.updateAuctionBidding(payload);
      if (result && updateTb) {
        return res.status(201).json({ message: " Bid Added Successfully" });
      } else {
        return next({ code: 404, message: "no data found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const listOnAuction = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
     * - `userId`,
     * - `productId`,
     * - `reservePrice`,
     * - `quantity`,
    
 
     */
  let payload = req.body;

  if (payload.productId && payload.reservePrice && payload.userId) {
    try {
      const result = await user.listOnAuction(payload);
      const updateListing = await user.updateListing(payload.productId);
      if (result && updateListing) {
        return res
          .status(201)
          .json({ message: "Listed on Auction Successfully" });
      } else {
        return next({ code: 404, message: "no data found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const updateUserInfo = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    

     * - `description`,
     * - `cnic`,
     * - `location`,
     * - `email`,
     * - `userId`,
   
 
     */
  let payload = req.body;

  if (payload.userId) {
    try {
      const result = await user.updateInfo(payload);
      if (result) {
        return res.status(201).json({ message: " Updated Successfully" });
      } else {
        return next({ code: 404, message: "no data found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const updateProfilePic = async (req, res, next) => {
  try {
    if (req.file == undefined) {
      return next({ code: 400, message: "Please upload a file!" });
    }
    let userId = req.body.userId;

    let image = req.file.filename;

    if (userId && image) {
      try {
        const result = await user.uploadProfilePicture(userId, image);
        if (result) {
          return res.status(201).json({ message: "Picture Updated" });
        } else {
          return next({ code: 404, message: "no data found" });
        }
      } catch (error) {
        return next({ code: 401, message: error });
      }
    } else {
      return next({ code: 400, message: "No Request Found" });
    }
  } catch (err) {
    return res.status(500).json({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};
const signUp = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
     * - `username`,
     * - `email`,
     * - `password`,
     * - `role`,
   
 
     */
  let payload = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({
      code: 401,
      message: errors,
    });
  }
  const salt = await bcrypt.genSalt(10);
  payload.password = await bcrypt.hash(payload.password, salt);
  if (payload.email && payload.password) {
    try {
      const result = await user.singUp(payload);
      if (result) {
        return res.status(201).json({ message: " Registered Successfully" });
      } else {
        return next({ code: 404, message: "no data found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

const logIn = async (req, res, next) => {
  let email = req.body.email;

  let password = req.body.password;

  if (typeof email != "undefined" && typeof password != "undefined") {
    try {
      // console.log(password);
      const [data] = await user.logIn(email);
      if (data.length > 0) {
        let check = await bcrypt.compare(password, data[0].password);
        if (!check) {
          return next({ code: 403, message: "Invalid Email or Password" });
        }
        data.forEach((rowsData) => {
          let data1 = {
            userId: rowsData.userId,
            username: rowsData.username,
            email: rowsData.email,
            description: rowsData.description,
            location: rowsData.location,
            role: rowsData.role,
            cnic: rowsData.cnic,
            image: rowsData.image,
          };

          jwt.sign(
            { data1 },
            "secretKey",
            { expiresIn: "1d" },
            (err, token) => {
              if (err) {
                return res.status(401).json({ message: err });
              }
              return res.status(201).json({ userInfo: data1, token: token });
            }
          );
        });
      } else {
        return next({ code: 404, message: "Invalid Email or Password" });
      }
    } catch (err) {
      return next({ code: 401, message: err });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

const authentication = async (req, res, next) => {
  let email = req.data.data1.email;

  if (email) {
    try {
      // console.log(password);
      const [data] = await user.logIn(email);
      if (data.length > 0) {
        data.forEach((rowsData) => {
          let data1 = {
            userId: rowsData.userId,
            username: rowsData.username,
            email: rowsData.email,
            description: rowsData.description,
            location: rowsData.location,
            role: rowsData.role,
            image: rowsData.image,
          };

          return res.status(201).json({ userInfo: data1 });
        });
      } else {
        return next({ code: 404, message: "Invalid Email or Password" });
      }
    } catch (err) {
      return next({ code: 401, message: err });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
module.exports = {
  userLogin: logIn,
  authentication: authentication,
  signUp: signUp,
  addProduct: addProduct,
  fetchAllProducts: fetchAllProducts,
  fetchSingleProduct: fetchSingleProduct,
  addBid: addBid,
  listOnAuction: listOnAuction,
  updateUserInfo: updateUserInfo,
  fetchSingleUser: fetchSingleUser,
  deleteProducts: deleteProducts,
  deleteUsers: deleteUsers,
  searchProduct: searchProduct,
  fetchAlUsers: fetchAlUsers,
  updateProfilePic: updateProfilePic,
  createdProducts: createdProducts,
  auctionSettle: auctionSettle,
};
