"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { ObjectId } = require("bson");

class ProductMongo extends UuObjectDao {
  async createSchema() {
    // id is unique by default in db, composed index awid, id is useless
    await super.createIndex({ awid: 1, state: 1 });
  }

  async listByIdList(idList) {
    return await super.find({
      id: {
        $in: idList.map((id) => {
          if (!ObjectId.isValid(id)) return id;
          return new ObjectId(id);
        }),
      },
    });
  }
  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async delete(awid, id) {
    await super.deleteOne({ awid, id });
  }

  async forceUpdate(uuObject) {
    const filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async update(uuObject) {
    const filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject);
  }

  async list(awid, state, sortBy, order, pageInfo) {
    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };
    const filter = { awid };
    if (state) {
      filter.state = state;
    }

    return await super.find(filter, pageInfo, sort);
  }
}

module.exports = ProductMongo;
