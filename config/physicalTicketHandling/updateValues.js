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
        try {
            const element = dataArray[i];
            const physicalUserDoc = await PhysicalUser.findOne({ ticketCode: element.TICKET_CODE });
            physicalUserDoc.name = element.NAME;
            physicalUserDoc.email = element.EMAIL;
            physicalUserDoc.phone = element.PHONE;
      
            await physicalUserDoc.save();
            console.log("Users updated: ", i + 1, "/", dataArray.length);
        } catch (error) {
            console.error(error);
            console.error("Error occurred updating user, skipping...");
            continue;
        }
      }
   
      console.log("Done");
      process.exit(0);
   } catch (error) {
      console.error(error);
      console.error("Error Occurred, Aborting...");
      process.exit(0);
   }
}