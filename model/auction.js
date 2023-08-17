const db = require("../config/database");

module.exports = class Users {
  constructor() {}
  addBid({ userId, productId, price, auctionId }) {
    return db.execute(`INSERT INTO bidding SET userId = ${userId}, productId = ${productId}, price = ${price}
`);
  }
  updateAuctionBidding({ userId, price, productId, endTime }) {
    return db.execute(`UPDATE auction SET highestBidderId = ${userId}, highestBid = '${price}',endTime = '${endTime}'  WHERE
    productId = ${productId}
`);
  }
  listOnAuction({ userId, productId, reservePrice, quantity }) {
    return db.execute(`INSERT INTO auction SET userId = ${userId}, productId = ${productId}, reservePrice = ${reservePrice},quantity = '${quantity}'
`);
  }
  updateListing(productId) {
    return db.execute(`UPDATE products SET isListed = 1
WHERE
productId = ${productId}
`);}

  settleAuction(auctionId) {
    return db.execute(`UPDATE auction SET status = 0
     WHERE
auctionId  = ${auctionId}
`);
  }
};