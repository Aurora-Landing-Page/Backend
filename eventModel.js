const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.URI);
    console.log("\nMongoDb Connected: ", connect.connection.name);
  } catch (err) { 
    console.log(err);
    process.exit(1)
  }
};

// const minUserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "please enter your name"],
//     maxLength: [30, "Name cannot exceed 30 characters"],
//     minLength: [3, "Name should have more than 2 characters"],
//   },

//   email: {
//     type: String,
//     required: [true, "please enter your email"],
//     unique: [true, "email address already taken"],
//     validate: {
//       validator: validator.isEmail,
//       message: "Please enter a valid Email",
//     },
//   },

//   phone: {
//     type: Number,
//     required: [true, "please enter you phone number"],
//     unique: [true, "phone number already taken"],
//   },
// })

const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [3, "Name should have more than 2 characters"],
    },

    // users: {
    //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
    // },

    fee: {
      type: Number,
      required: [true, "Fee is required"]
    }
  },
  { timestamps: true }
);

// const Minuser = mongoose.model("user", minUserSchema);
const Event = mongoose.model("event", eventSchema);

const events = [
  {"name": "Parivesh", "fee": "350"}, 
  {"name": "Corna", "fee": "350"}, 
  {"name": "Mr. & Ms. Aurora", "fee": "200"},
  {"name": "Eumelia", "fee": "250"},
  {"name": "Le Arte Fiesta", "fee": "150"}
]

async function writeData(arr) {
  await connectDb();
  for (let i = 0; i < arr.length; i++) {
    const name = arr[i].name;
    const fee = arr[i].fee
    const ne = new Event({name, fee})
    try {
      await ne.save();
      console.log(`${ne.name}:`, ne.id)
    } catch (err) {
      console.error(err)
    }
  }
}

writeData(events)