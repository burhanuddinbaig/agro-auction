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
};const addBid = async (req, res, next) => {
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
  addBid: addBid,
  listOnAuction: listOnAuction,
  auctionSettle: auctionSettle,
};
