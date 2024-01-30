// Library Imports
const mongoose = require("mongoose");
const fs = require('fs');

// Model Imports
const event = require("../models/event")

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

const individualList = [
    {
      name: "Mr. And Mrs. Aurora",
      fee: 349,
    },
    {
        name: "Graffathon",
        fee: 199
    },
    {
        name: "T-shirt Painting",
        fee: 149,
    },
    {
        name: "T-shirt Painting",
        fee: 149,
    },
    {
        name: "Naqaab (Face Painting)",
        fee: 149,
    },
    {
        name: "On Spot Painting",
        fee: 149,
    },
    {
        name: "On Spot Sketching",
        fee: 149,
    },
    {
        name: "Step-up - Classical Dance(Classics Way)",
        fee: 349,
    },
    {
        name: "Step-up - Solo Dance GrooveOff",
        fee: 349,
    },
    {
        name: "Freestyle Singing (Solo)",
        fee: 199,
    },
    {
        name: "Panorama",
        fee: 249,
    },
    {
        name: "Open Mic",
        fee: 99,
    },
    {
        name: "Extempore",
        fee: 99,
    },
    {
        name: "KBC",
        fee: 99,
    },
    {
        name: "RangManch - Mono Act",
        fee: 249,
    },
    {
        name: "Miscellaneous - Rap Battle",
        fee: 149,
    },

]

const groupList = [
    {
        name: "Parivesh",
        fee: 349,
    },
    {
        name: "Corna",
        fee: 400,
    },
    {
        name: "BattleNova - BGMI",
        fee: 199,
    },
    {
        name: "BattleNova - Valo",
        fee: 349,
    },
    {
        name: "Step-up - Classical(Astral Rhythms)",
        fee: 249,
    },
    {
        name: "Step-up - Western",
        fee: 249,
    },
    {
        name: "Classical Singing (solo duo)",
        fee: 199, 
    },
    {
        name: "Freestyle Singing (Duo)",
        fee: 199,
    },
    {
        name: "Freestyle Singing (Group)",
        fee: 199,
    },
    {
        name: "Instrumental Acoustic",
        fee: 199,
    },
    {
        name: "Acapella (group)",
        fee: 199,
    },
    {
        name: "Pixar",
        fee: 299,
    },
    {
        name: "Short Movie Making",
        fee: 299,
    },
    {
        name: "Debate",
        fee: 99,
    },
    {
        name: "Charades Chronicles",
        fee: 99,
    },
    {
        name: "Rangmanch  - Nukkad Natak",
        fee: 249,
    },
    {
        name: "RangManch - Stage Act",
        fee: 249,
    },
    {
        name: "Miscellaneous - Aptitude Quiz",
        fee: 149,
    },
    {
        name: "Miscellaneous - CineBinge Quiz",
        fee: 149,
    },
    {
        name: "Miscellaneous - IPL Auction",
        fee: 99,
    },
    {
        name: "Miscellaneous - Pictionary",
        fee: 99,
    },
    {
        name: "Miscellaneous - Treasure Hunt",
        fee: 199,
    },
    {
        name: "Miscellaneous - Tug Of War",
        fee: 99,
    },
]

let connected = false
const db_url = "mongodb+srv://nilanjanbmitra:B62egXux68gfApJK@aurora-ca-login.jvgfddw.mongodb.net/?retryWrites=true&w=majority";

const connectDb = async () => {
    if (connected === false) {
        try {
            const connect = await mongoose.connect(db_url);
            console.log("\nMongoDb Connected: ", connect.connection.name);
            connected = true
            return true;
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    } else { return true }
};

const populate = async () => {
    if (await connectDb()) {
        let individualEvents = [];
        let groupEvents = [];

        individualList.forEach(async (element, index) => {
            const newEvent = new event({
                name: element.name,
                fee: element.fee
            })

            await newEvent.save();
            newEvent._id = newEvent._id.toString();
            individualEvents.push(newEvent);
            console.log(newEvent);

            if (index == individualList.length - 1) {
                fs.writeFileSync('individualEvents.json', JSON.stringify(individualEvents, null, 2));
                console.log(individualEvents.length);
                console.log("Individual Done...");
            }
        })

        groupList.forEach(async (element, index) => {
            const newEvent = new event({
                name: element.name,
                fee: element.fee,
                isGroup: true
            })

            await newEvent.save();
            newEvent._id = newEvent._id.toString();
            groupEvents.push(newEvent);
            console.log(newEvent);

            if (index == groupList.length - 1) {
                fs.writeFileSync('groupEvents.json', JSON.stringify(groupEvents, null, 2));
                console.log(individualEvents.length);
                console.log("Group Done...");
            }
        })

    } else { process.exit(1) }
}

populate();