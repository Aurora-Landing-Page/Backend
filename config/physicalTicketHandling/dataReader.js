const fs = require('fs');
const csv = require('csv-parser');
const {PhysicalUser} = require('../../models/physicalUserModel');

let dataArray = [];

fs.createReadStream('data.csv')
 .pipe(csv())
 .on('data', (row) => {
    dataArray.push(row);
 })
 .on('end', () => {
    main().catch(console.error("Error occurred\nAborting..."));
});

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
   await connectDb();
   for (let i = 0; i < dataArray.length; i++) {
      const element = dataArray[i];
      const newPhysicalUser = new PhysicalUser({
         name: element.NAME,
         email: element.EMAIL,
         phone: element.PHONE,
         ticketCode: element.TICKET_CODE
      })

      await newPhysicalUser.save();
      console.log("Users created: ", i, "/", dataArray.length);
   }

   console.log("Done");
   process.exit(0);
}