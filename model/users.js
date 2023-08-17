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
  deleteUser(userId) {
    return db.execute(`DELETE FROM users
WHERE
userId  = ${userId}
`);
  }
};
