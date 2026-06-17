const { getDB } = require("../utils/databaseUtils");
const { ObjectId } = require("mongodb");

module.exports = class Home {
  constructor(houseName, city, houseNo, id) {
    this.id = id;
    this.houseName = houseName;
    this.city = city;
    this.houseNo = houseNo;
  }

  // ✅ SAVE HOME
  save() {
    const db = getDB();
    return db.collection('homes').insertOne(this);
  }

  // ✅ FETCH ALL HOMES (no problem here)
  static fetchAll() {
    const db = getDB();
    return db.collection('homes').find().toArray();
  }

  // ✅ FETCH BY ID (FIXED)
  static fetchById(id) {
    const db = getDB();
    return db
      .collection('homes')
      .findOne({ _id: new ObjectId(id) });
  }

  // ✏ UPDATE HOME
  static updateHome(home) {
    return db.execute(
      'UPDATE homes SET houseName=?, city=?, houseNo=? WHERE id=?',
      [home.houseName, home.city, home.houseNo, home.id]
    );
  }

  // ❌ DELETE HOME
  static deleteById(homeId) {
    return db.execute('DELETE FROM homes WHERE id=?', [homeId]);
  }

  // ⭐ ADD TO FAVOURITES
  static addToFavourites(homeId) {
    return db.execute(
      'INSERT INTO favourites (homeId) VALUES (?)',
      [homeId]
    );
  }

  // ⭐ FETCH FAVOURITES
  static fetchFavourites() {
    return db.execute(`
      SELECT homes.*
      FROM homes
      INNER JOIN favourites
      ON homes.id = favourites.homeId
    `);
  }

  // 📌 ADD TO BOOKED
  static addToBooked(homeId) {
    return db.execute(
      'INSERT INTO booked (homeId) VALUES (?)',
      [homeId]
    );
  }

  // 📌 FETCH BOOKED
  static fetchBooked() {
    return db.execute(`
      SELECT homes.*
      FROM homes
      INNER JOIN booked
      ON homes.id = booked.homeId
    `);
  }
};









