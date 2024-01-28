const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const {PhysicalUser} = require('../../models/physicalUserModel');

const dotenv = require("dotenv");
dotenv.config();

let dataArray = [];

fs.createReadStream('data.csv')
 .pipe(csv())
 .on('data', (row) => {
   dataArray.push(row);
 })
 .on('end', () => {
   main();
});

let connected = false;
const connectDb = async () => {
   if (connected === false) {
       try {
           const connect = await mongoose.connect(process.env.URI);
           console.log("\nMongoDb Connected: ", connect.connection.name);
           connected = true
           return true;
       } catch (err) {
           console.log(err);
           process.exit(1);
       }
   } else { return true }
};

async function main() {
   try {
      await connectDb();
      for (let i = 0; i < dataArray.length; i++) {
         const element = dataArray[i];
         const newPhysicalUser = new PhysicalUser({
            name: "",
            email: "",
            phone: 0,
            ticketCode: element.TICKET_CODE
         })
   
         await newPhysicalUser.save();
         console.log("Users created: ", i + 1, "/", dataArray.length);
      }
   
      console.log("Done");
      process.exit(0);
   } catch (error) {
      console.error(error);
      console.error("Error Occurred, Aborting...");
      process.exit(0);
   }
}