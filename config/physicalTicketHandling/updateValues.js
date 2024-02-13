const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const mongoose = require('mongoose');
const emailController = require("../../controllers/emailController");
const {PhysicalUser} = require('../../models/physicalUserModel');

const dotenv = require("dotenv");
dotenv.config();

let dataArray = [];
const inFile = process.argv[2];
const outFile = process.argv[3];

if (inFile === outFile) {
  console.error("Input and output files cannot be the same!");
  console.error("Aborting...");
  process.exit(0);
}

fs.createReadStream(`${inFile}`)
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
      let updatedDataArray = [];
      for (let i = 0; i < dataArray.length; i++) {
        const element = dataArray[i];
        if (element.EMAIL_SENT == "yes") {
          console.log(`Email already sent to ${element.EMAIL}, skipping`); 
          console.log("Users updated: ", i + 1, "/", dataArray.length);
          updatedDataArray.push(element);
          continue; 
        }

        try {
            const physicalUserDoc = await PhysicalUser.findOne({ ticketCode: element.TICKET_CODE });
            if (!physicalUserDoc) {
              console.log(`User with pass code ${element.TICKET_CODE} not found, please check input csv!`)
              continue;
            }
            physicalUserDoc.name = element.NAME;
            physicalUserDoc.email = element.EMAIL;
            physicalUserDoc.phone = element.PHONE;
            element.EMAIL_SENT = "yes";
      
            await physicalUserDoc.save();
            await emailController.sendPhysicalMail(element.NAME, element.EMAIL, element.TICKET_CODE);
            
            updatedDataArray.push(element);
            console.log("Users updated: ", i + 1, "/", dataArray.length);
        } catch (error) {
            console.error(error);
            console.error("Error occurred updating user, skipping...");
            continue;
        }
      }
   
      const csvWriter = createCsvWriter({
        path: `${outFile}`,
        header: [
          { id: 'DUMMY_VAL', title: 'DUMMY_VAL' },
          { id: 'TICKET_CODE', title: 'TICKET_CODE' },
          { id: 'NAME', title: 'NAME' },
          { id: 'EMAIL', title: 'EMAIL' },
          { id: 'PHONE', title: 'PHONE' },
          { id: 'EMAIL_SENT', title: 'EMAIL_SENT' }
        ]
      });

      csvWriter.writeRecords(updatedDataArray)
      .then(() => {
        console.log(`Updated data saved to ${outFile}`);
        console.log("Done");
        process.exit(0);
      });
   } catch (error) {
      console.error(error);
      console.error("Error Occurred, Aborting...");
      process.exit(0);
   }
}