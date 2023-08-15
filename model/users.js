const db = require("../config/database");

module.exports = class Users {
  constructor() {}

  fetchAll() {
    return db.execute(`SELECT * FROM  users
     `);
  }
  fetchSingleUser(id) {
    return db.execute(`SELECT * FROM  users WHERE userId = ${id}
     `);
  }
  fetchAllProducts() {
    return db.execute(`SELECT p.*, u.userId, u.username,ac.productId as auctionProduct,ac.reservePrice,ac.quantity as reserveQuantity,ac.highestBidderId,ac.highestBid,ac.endTime,ac.status as aucStatus FROM products p
    JOIN users u ON
    (p.userId = u.userId)
    LEFT JOIN auction ac ON
    (p.productId = ac.productId
      AND
      ac.status = 1)

     `);
  }
  fetchSingleProduct(productId) {
    return db.execute(`SELECT p.*, u.userId, u.username,ac.productId as auctionProduct,ac.auctionId,ac.reservePrice,ac.quantity as reserveQuantity,ac.highestBidderId,ac.highestBid,ac.endTime,ac.status as aucStatus FROM products p
    JOIN users u ON
    (p.userId = u.userId)
    LEFT JOIN auction ac ON
    (p.productId = ac.productId
      AND
      ac.status = 1
      )
    WHERE
    p.productId= ${productId}

     `);
  }

  logIn(email) {
    return db.execute(`SELECT * FROM  users
    where
    email = '${email}' `);
  }

  /**
   * @dev the function will create new record for given `payload`
   * @param {Object} payload is an object. it will contain following properties:
   * - `id `,
   * - `full_name`,
   * - `email`,
   * - `phone`,
   * - `bussiness_name`,
   * - `address`,
 
 
   *
   * @returns it will rertun a Promise <fulfiled | rejected>
   */
  updateInfo({ description, cnic, email, location, userId }) {
    return db.execute(`UPDATE users SET description = '${description}', cnic = '${cnic}' , email = '${email}', location = '${location}'
WHERE
userId = '${userId}'
`);
  }
  uploadProfilePicture(userId, image) {
    return db.execute(`UPDATE users SET image = '${image}'
WHERE
userId = '${userId}'
`);
  }

  singUp({ username, email, password, role }) {
    return db.execute(`INSERT INTO users SET username = '${username}', email = '${email}', password = '${password}', role = '${role}'
`);
  }

  addProduct({ title, description, rate, quantity, userId }, image) {
    return db.execute(`INSERT INTO products SET title = '${title}', description = '${description}',image ='${image}', rate = '${rate}',quantity = '${quantity}', userId = ${userId}
`);
  }
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
`);
  }
  deleteUser(userId) {
    return db.execute(`DELETE FROM users
WHERE
userId  = ${userId}
`);
  }
  deleteProduct(productId) {
    return db.execute(`DELETE FROM products
WHERE
productId   = ${productId}
`);
  }
  searchProduct(title) {
    return db.execute(`SELECT * FROM  products
    WHERE
    title LIKE '%${title}%' `);
  }
  createdPprducts(userId) {
    return db.execute(`SELECT p.*, u.userId, u.username,ac.productId as auctionProduct,ac.reservePrice,ac.quantity as reserveQuantity,ac.highestBidderId,ac.highestBid,ac.endTime,ac.status as aucStatus FROM products p
    JOIN users u ON
    (p.userId = u.userId)
    LEFT JOIN auction ac ON
    (p.productId = ac.productId
      AND ac.status = 1)
    WHERE
    u.userId = ${userId}

     `);
  }
  updateProductQuantity(productId, quantity) {
    return db.execute(`UPDATE products SET quantity = '${quantity}' , isListed = 0
WHERE
productId = ${productId}
`);
  }
  settleAuction(auctionId) {
    return db.execute(`UPDATE auction SET status = 0
     WHERE
auctionId  = ${auctionId}
`);
  }
};
