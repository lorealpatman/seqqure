const mongodb = require("../mongodb.connection");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;

const bucket = process.env.S3_PUBLIC;

// Completes registration process for people
const confirmPerson = person => {
  return conn
    .db()
    .collection("people")
    .updateOne(
      { _id: ObjectId(person._id) },
      {
        $set: {
          firstName: person.firstName,
          lastName: person.lastName,
          userId: ObjectId(person.userId),
          registeredDate: person.registeredDate,
          modifiedDate: person.modifiedDate,
          modifiedById: ObjectId(person.userId)
        },
        $addToSet: { roles: ObjectId(person.roleId) }
      }
    );
};

///////GET////////
function getAll(tenantId) {
  return conn
    .db()
    .collection("people")
    .aggregate([
      { $match: { tenantId: tenantId } },
      { $sort: { lastName: 1, firstName: 1 } }
    ])

    .map(item => {
      if (item.fileKey) {
        item.fileKey = `https://${bucket}.s3.amazonaws.com/${item.fileKey}`;
      }

      return item;
    })
    .toArray();
}

function search(tenantId, userName) {
  return conn
    .db()
    .collection("people")
    .aggregate([
      {
        $match: {
          $and: [
            { tenantId: tenantId },
            { lastName: new RegExp(userName, "i") }
          ]
        }
      },
      { $sort: { lastName: 1, firstName: 1 } }
    ])

    .map(item => {
      if (item.fileKey) {
        item.fileKey = `https://${bucket}.s3.amazonaws.com/${item.fileKey}`;
      }

      return item;
    })
    .toArray();
}

const getByTenantId = tenantId => {
  return conn
    .db()
    .collection("people")
    .find({ tenantId: ObjectId(tenantId) })
    .toArray();
};

const getPersonById = id => {
  return conn
    .db()
    .collection("people")
    .findOne({ _id: ObjectId(id) });
};

////POST/////
const post = person => {
  person.roles = person.roles.map(role => ObjectId(role));
  return conn
    .db()
    .collection("people")
    .insertOne(person)
    .then(result => result.insertedId.toString());
};

////PUT/////
function put(id, person) {
  // convert string id used outside of MongoDB into ObjectId needed by MongoDB
  //person._id = new ObjectId(person._id)
  delete person._id;
  person.userId = person.userId ? ObjectId(person.userId) : null;

  return conn
    .db()
    .collection("people")
    .updateOne({ _id: new ObjectId(id) }, { $set: person })
    .then(result => Promise.resolve()); // "return" nothing
}

function updateFileKey(id, fileKey) {
  return conn
    .db()
    .collection("people")
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          fileKey: fileKey
        }
      }
    )
    .then(result => Promise.resolve()); // "return" nothing
}

/////DELETE/////
function _delete(id) {
  return conn
    .db()
    .collection("people")
    .deleteOne({ _id: new ObjectId(id) })
    .then(result => Promise.resolve()); // "return" nothing
}

module.exports = {
  confirmPerson,
  getAll,
  getByTenantId,
  getPersonById,
  post,
  put,
  delete: _delete,
  updateFileKey,
  search
};
