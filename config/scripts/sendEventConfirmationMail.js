const fs = require('fs');
const mongoose = require('mongoose');
const emailController = require("../../controllers/emailController");
const userController = require("../../controllers/userController");
const Event = require("../../models/event");
const Jimp = require('jimp')

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

fs.readFile('/home/nilanjan-mitra/Desktop/Backend/config/scripts/data.json', 'utf8', async(err, jsonString) => {
 if (err) {
  console.log("Error reading file:", err);
  return;
 }
 try {
  await connectDb();
  const data = JSON.parse(jsonString);
  data.unapprovedPayments.forEach(async (payment) => {
    const { receiptId, ticketCode } = payment;
    if (payment.data.purchasedTickets) {
      await payment.data.members.forEach(async (member) => {
        const { name, email, phone } = member;
        const ticketImage = await userController.generateTicket(name, email, phone, ticketCode)
        const buffer = await ticketImage.getBufferAsync(Jimp.MIME_PNG);
        emailController.sendConfirmation(name, email, buffer, ticketCode, receiptId);
      });
    } else if (payment.data.eventId) {
      const eventName = await Event.findById(payment.data.eventId)
      if (eventName) {
        await payment.data.members.forEach(async (member) => {
          const { name, email, phone } = member;
          const ticketImage = await userController.generateTicket(name, email, phone, ticketCode)
          const buffer = await ticketImage.getBufferAsync(Jimp.MIME_PNG);
          emailController.sendEventConfirmation(name, email, buffer, ticketCode, eventName._doc.name, receiptId);
        });
      }
      else { console.log("Invalid Event ID specified: ", payment.data.eventId) }
    }
  });
 } catch (err) {
  console.log('Error parsing JSON string:', err);
 } finally {
  console.log("Done!");
 }
});
