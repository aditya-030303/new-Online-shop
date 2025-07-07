const db = require("../data/databse");
const bcrypt = require("bcryptjs");
const mongoDb = require("mongodb");

class user {
  constructor(email, confirmEmail, password, fullname, street, postal, city) {
    (this.email = email),
      (this.confirmEmail = confirmEmail),
      (this.password = password),
      (this.name = fullname),
      (this.address = {
        street: street,
        postal: postal,
        city: city,
      });
  }

  static findById(userId) {
    const uid = new mongoDb.ObjectId(userId);
    return db
      .getDb()
      .collection("users")
      .findOne(
        { _id: uid },
        {
          projection: {
            password: 0,
          },
        }
      );
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async existAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  async hasMatchingPassword(hashedPassword) {
    // Make sure `this.password` holds the plaintext password
    if (!this.password) {
      throw new Error("Password is not set on this object.");
    }

    return await bcrypt.compare(this.password, hashedPassword);
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
  }
}

module.exports = user;
