import mongoose from "mongoose";

const dbConnection = async () => {
  return await mongoose
    .connect(process.env.DBURL)
    .then(() => console.log("DB connection Successful!"))
    .catch(() => console.log("Database error"));
};

export default dbConnection;
