const fs = require('fs');
const mongoose = require('mongoose');
const { User } = require("../../models/userModel");
const CA = require("../../models/caModel");
const { AdminAddedUser, AdminAddedGroup } = require("../../models/adminAdded");
const ManualPayment = require("../../models/manualPayment");
const { PhysicalUser } = require("../../models/physicalUserModel")

const dotenv = require("dotenv");
dotenv.config();

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
      const approvedPayments = await ManualPayment.find({ approved: true }).exec();
      const jsonData1 = {response: approvedPayments};
      const approvedPaymentsNumber = approvedPayments.length;
      console.log("Number of approved manual payments: ", approvedPaymentsNumber);
      console.log(approvedPayments);

      const allPayments = await ManualPayment.find({}).exec();
      const jsonData2 = {response: allPayments};
      console.log("Number of all payments: ", allPayments.length);
      console.log(allPayments)


      fs.writeFileSync("response-1.json", JSON.stringify(jsonData1), function(err) {
        if (err) {
            console.log(err);
        }
      });

      fs.writeFileSync("response-2.json", JSON.stringify(jsonData2), function(err) {
        if (err) {
            console.log(err);
        }
      });
   } catch (error) {
      console.error(error);
      console.error("Error Occurred, Aborting...");
      process.exit(0);
   }
}

main().then(() => { console.log("Done"); process.exit(0); });