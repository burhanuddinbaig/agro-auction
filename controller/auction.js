const jwt = require("jsonwebtoken");
const Auction = require("../model/auction");
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

module.exports = {
  addProduct: addProduct,
  fetchAllProducts: fetchAllProducts,
  fetchSingleProduct: fetchSingleProduct,
  addBid: addBid,
  listOnAuction: listOnAuction,
  deleteProducts: deleteProducts,
  deleteUsers: deleteUsers,
  searchProduct: searchProduct,
  createdProducts: createdProducts,
  auctionSettle: auctionSettle,
};
