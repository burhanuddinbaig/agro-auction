const db = require("../config/database");

module.exports = class Products {
  constructor() {}
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
  addProduct({ title, description, rate, quantity, userId }, image) {
    return db.execute(`INSERT INTO products SET title = '${title}', description = '${description}',image ='${image}', rate = '${rate}',quantity = '${quantity}', userId = ${userId}
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
};
