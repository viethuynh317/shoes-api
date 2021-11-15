import mongoose from "mongoose";
// import { Permission, RolePermission } from "../models";
const addDefaultPermission = async () => {
  const csv = require("csvtojson/v2");

  const data = await csv().fromFile("permissions.csv");
  console.log(data);
  await Permission.insertMany(data);
};

export const dbConnection = async (uri) => {
  try {
    console.log(uri);
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    const db = mongoose.connection;
    db.once("open", () => {
      console.log("Connected to database");
    });
    // const numDoc = await Permission.estimatedDocumentCount();
    // if (numDoc == 0) {
    //   addDefaultPermission();
    // }
  } catch (error) {
    console.log(error);
  }
};

