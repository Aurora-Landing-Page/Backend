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
      const userData = await User.find().exec();
      const userNumber = await User.countDocuments().exec();
      const caNumber = await CA.countDocuments().exec();
      const adminAddedUsersNumber = await AdminAddedUser.countDocuments().exec();
      const adminAddedGroupsNumber = await AdminAddedGroup.countDocuments().exec();
      const paymentNumber = await ManualPayment.countDocuments().exec();
      const approvedPayments = await ManualPayment.find({ approved: true }).exec();
      const approvedPaymentsNumber = approvedPayments.length;
      const physicalUserNumber = await PhysicalUser.countDocuments({ name: {$ne: ""} }).exec();
      console.log("Number of user signups: ", userNumber);
      console.log("Number of CA signups: ", caNumber);
      console.log("Number of admin added users: ", adminAddedUsersNumber);
      console.log("Number of admin added groups: ", adminAddedGroupsNumber);
      console.log("Number of manual payments: ", paymentNumber);
      console.log("Number of approved manual payments: ", approvedPaymentsNumber);
      console.log("Number of verified physical users: ", physicalUserNumber);
    //   console.log(data);
   } catch (error) {
      console.error(error);
      console.error("Error Occurred, Aborting...");
      process.exit(0);
   }
}

main().then(() => { console.log("Done"); process.exit(0); });