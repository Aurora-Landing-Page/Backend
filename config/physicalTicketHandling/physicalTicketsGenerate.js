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

async function generateTicket(name, email, phone, ticketCode) {
   if (name.length > 28) { name = name.slice(0,28) + "..."; }
   if (email.length > 28) { email = email.slice(0,28) + "..."; }

   let ticketImage = await Jimp.read(process.env.TICKET_TEMPLATE_ROUTE);
   const toEncode = process.env.SITE_FOR_TICKET + "/physicalVerify?ticketCode=" + ticketCode;
   const opts = {
     errorCorrectionLevel: "H",
     color: {
       dark: "#000",
       light: "#00FF1213",
     },
     width: 300,
   };
   let qrCodeDataUrl = await qrcode.toDataURL(toEncode, opts);
   let base64Image = qrCodeDataUrl.split(";base64,").pop();
   let qrCodeImage = await Jimp.read(Buffer.from(base64Image, "base64"));

   ticketImage.composite(qrCodeImage, 1625, 173);

   const codeFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
   const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

   const fontCanvas = await Jimp.create(300, 300);
   fontCanvas.print(codeFont, 0, 0, ticketCode).rotate(90);
   ticketImage.blit(fontCanvas, 65, 65);

  //  ticketImage.print(font, 995, 383, name);
  //  ticketImage.print(font, 995, 449, email);
  //  ticketImage.print(font, 995, 514, phone);
   ticketImage.resize(1200, Jimp.AUTO);

   return ticketImage;
}

const TICKET_SIZE = 570;
const X_PADDING = 25;
const Y_PADDING = 15;
const TICKET_AMOUNT = 1500;

async function main() {
 const ticketCodes = [];
 for (let i = 0; i < TICKET_AMOUNT; i++) {
    let ticketCode = generateCode(6);
    while(ticketCode in ticketCodes) { ticketCode = generateCode(6); }
    ticketCodes.push(ticketCode);
 }

 const doc = new PDFDocument();

 for (let i = 0; i < ticketCodes.length; i += 3) {
    for (let j = 0; j < 3; j++) {
      const ticketCode = ticketCodes[i + j];
      let name = "Nilanjan B Mitracdnsocndsjncskjdc";
      let email = "nilanjanbmitra@gmail.comcskdncdsncjkn";
      let phone = 8899580221;

      const ticketImage = await generateTicket(name, email, phone, ticketCode);
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
      {id: 'dummy', title: 'DUMMY_VAL'},
      {id: 'ticketCode', title: 'TICKET_CODE'}
    ]
 });

 const records = ticketCodes.map(code => ({dummy: 'dummy', ticketCode: code}));
 writer.writeRecords(records)
    .then(() => console.log('...Done'));
}

main().catch(console.error);
