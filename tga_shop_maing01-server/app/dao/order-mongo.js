"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class OrderMongo extends UuObjectDao {
  async createSchema() {
    // id is unique by default in db, composed index awid, id is useless
    await super.createIndex({ awid: 1, state: 1, uuIdentity: 1 });
    await super.createIndex({ awid: 1, creationTime: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async list(criteria, pageInfo, sortBy, order) {
    const filter = { awid: criteria.awid };
    if (criteria.uuIdentity) filter.uuIdentity = criteria.uuIdentity;
    if (criteria.state) filter.state = criteria.state;

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }

  async update(uuObject) {
    const filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }
}

module.exports = OrderMongo;
