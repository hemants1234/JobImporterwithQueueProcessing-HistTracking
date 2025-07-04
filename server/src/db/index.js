//import mongoose from "mongoose";
const mongoose  = require( "mongoose");

const DatabaseConnect = async () => {
    try {
        const DatabaseConnection = mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MongoDB Connected !! DB HOST:${process.env.DB_URI} , ${(await DatabaseConnection).connection.host}`);
    } catch (error) {
       console.log("MongoDB Connection Error:- ", error);
       process.exit(1)        
    }
}

module.exports = DatabaseConnect