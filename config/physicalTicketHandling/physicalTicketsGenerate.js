const fs = require('fs');
const PDFDocument = require('pdfkit');
const Jimp = require('jimp');
const qrcode = require('qrcode');
const csvWriter = require('csv-writer').createObjectCsvWriter;

const dotenv = require("dotenv");
dotenv.config();

function generateCode(length = 8) {
 const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
 let referralCode = "";

 for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters[randomIndex];
 }
 return referralCode;
}

async function generateTicket(ticketCode) {
 let ticketImage = await Jimp.read("/home/nilanjan-mitra/Desktop/Backend/controllers/ticket.png");
 const toEncode = process.env.SITE + "/physicalVerify?ticketCode=" + ticketCode;
 const opts = {
    errorCorrectionLevel: "H",
    color: {
      dark: "#000",
      light: "#00FF1213",
    },
    width: 250,
 };
 let qrCodeDataUrl = await qrcode.toDataURL(toEncode, opts);
 let base64Image = qrCodeDataUrl.split(";base64,").pop();
 let qrCodeImage = await Jimp.read(Buffer.from(base64Image, "base64"));

 await ticketImage.composite(qrCodeImage, 1562, 159);

 let font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
 ticketImage.print(font, 1708, 438, ticketCode);
 ticketImage.resize(1200, Jimp.AUTO);

 return ticketImage;
}

const TICKET_SIZE = 570; // adjust this to change the size of each ticket
const X_PADDING = 25;
const Y_PADDING = 15;
const TICKET_AMOUNT = 1500;

async function main() {
 const ticketCodes = [];
 for (let i = 0; i < TICKET_AMOUNT; i++) {
    const ticketCode = generateCode(6);
    ticketCodes.push(ticketCode);
 }

 const doc = new PDFDocument();

 for (let i = 0; i < ticketCodes.length; i += 3) {
    for (let j = 0; j < 3; j++) {
      const ticketCode = ticketCodes[i + j];
      const ticketImage = await generateTicket(ticketCode);
      const buffer = await ticketImage.getBufferAsync(Jimp.MIME_PNG);
      const x = X_PADDING;
      const y = Y_PADDING + (j % 3) * 200;
      doc.image(buffer, x, y, {
        fit: [TICKET_SIZE, TICKET_SIZE],
        align: 'center',
        // valign: 'center'
      });
    }
    if (i + 3 < ticketCodes.length) {
      doc.addPage();
      console.log("Pages done: ", i / 3 + 1);
    }
 }

 doc.pipe(fs.createWriteStream('tickets.pdf'));
 doc.end();

 const writer = csvWriter({
    path: 'out.csv',
    header: [
      {id: 'ticketCode', title: 'TICKET_CODE'}
    ]
 });

 const records = ticketCodes.map(code => ({ticketCode: code}));
 writer.writeRecords(records)
    .then(() => console.log('...Done'));
}

main().catch(console.error);
