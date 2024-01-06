// Library Imports
const mongoose = require("mongoose");

// Model Imports
const event = require("../models/event")

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

const individualList = [
    {
        name: "Impromptu Solo Dance Battle",
        fee: 100
    },
    {
        name: "Instrumental",
        fee: 150
    },
    {
        name: "Singing",
        fee: 200
    },
    {
        name: "Panorama",
        fee: 150
    },
    {
        name: "Portray It!",
        fee: 300
    },
    {
        name: "Best Out Of Waste",
        fee: 175
    },
    {
        name: "Naqaab (Face Painting)",
        fee: 100
    },
    {
        name: "Graffathon",
        fee: 225
    },
    {
        name: "On Spot Painting",
        fee: 100
    },
    {
        name: "Sneaker Painting",
        fee: 150
    },
    {
        name: "Doodly-Doo (Online)",
        fee: 200
    },
    {
        name: "Open Mic",
        fee: 150
    },
    {
        name: "English Debate",
        fee: 300
    },
    {
        name: "Hindi Debate",
        fee: 175
    },
    {
        name: "Morning No 1 - Radio",
        fee: 100
    },
    {
        name: "Extempore",
        fee: 225
    },
    {
        name: "Mono Act",
        fee: 100
    },
    {
        name: "IPL Auction",
        fee: 225
    }
]

const grouplList = [
    {
        name: "Classical Dance",
        fee: 100
    },
    {
        name: "Western Dance",
        fee: 150
    },
    {
        name: "Fusion Duo",
        fee: 200
    },
    {
        name: "Instrumental",
        fee: 150
    },
    {
        name: "Singing",
        fee: 300
    },
    {
        name: "Short Movie Making",
        fee: 175
    },
    {
        name: "Nukkad Natak",
        fee: 100
    },
    {
        name: "Dumb Charades",
        fee: 225
    },
    {
        name: "Pictionary",
        fee: 100
    },
    {
        name: "Reels (Online)",
        fee: 150
    },
    {
        name: "Treasure Hunt",
        fee: 200
    },
    {
        name: "Instagram Live",
        fee: 150
    },
    {
        name: "Valorant",
        fee: 300
    },
    {
        name: "BGMI",
        fee: 175
    },
    {
        name: "Aptitude Quiz",
        fee: 225
    },
    {
        name: "CineBinge Quiz",
        fee: 100
    }
]

let connected = false

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

const populate = async () => {
    if (await connectDb()) {
        individualList.forEach(async (element) => {
            const newEvent = new event({
                name: element.name,
                fee: element.fee
            })

            await newEvent.save();
            console.log(newEvent);
        })

        grouplList.forEach(async (element) => {
            const newEvent = new event({
                name: element.name,
                fee: element.fee,
                isGroup: true
            })

            await newEvent.save();
            console.log(newEvent);
        })
    } else { process.exit(1) }
}

populate();