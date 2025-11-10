import mongoose from "mongoose";
import dotenv from "dotenv";
import MenuItem from "../models/Menuitem.js";
import Addon from "../models/Addon.js";
import { config } from "../config/env.js";

dotenv.config();
console.log("Loaded MONGO_URI =", config.mongoUri); 

async function run() {
 console.log("Using MONGO_URI =", config.mongoUri);
await mongoose.connect(config.mongoUri);
console.log("Connected to DB:", mongoose.connection.name);


  await MenuItem.deleteMany({});
  await Addon.deleteMany({});

  const menu = await MenuItem.insertMany([
    {
      name: "Rajma Chawal Bowl",
      description: "Delicious rajma curry with steamed rice",
      price: 120,
      imageUrl:
        "https://res.cloudinary.com/dmrqjhzx5/image/upload/v1756893961/rajma-chawal-1_rvuhnd.jpg",
      available: true 
    },
    {
      name: "Chole Chawal Bowl",
      description: "Spicy chole curry with fluffy rice",
      price: 130,
      imageUrl:
        "https://res.cloudinary.com/dmrqjhzx5/image/upload/v1759911774/delicious-brazilian-food-flat-lay_cqywhh.jpg",
          available: true 
    },
    {
      name: "Paneer Butter Masala Bowl",
      description: "Creamy paneer curry served with jeera rice",
      price: 150,
      imageUrl:
        "https://res.cloudinary.com/dmrqjhzx5/image/upload/v1759911652/Paneer-rice-bowl_uffkh1.jpg",
          available: true 
    },
    {
      name: "Chicken Curry Bowl",
      description: "Spicy chicken curry with basmati rice",
      price: 170,
      imageUrl:
        "https://res.cloudinary.com/dmrqjhzx5/image/upload/v1759911654/coconut-chicken-curry-1-10_amz1ta.jpg",
          available: true 
    },
    {
      name: "Egg Curry Bowl",
      description: "Boiled eggs in spicy curry with rice",
      price: 140,
      imageUrl:
        "https://res.cloudinary.com/dmrqjhzx5/image/upload/v1759911654/Instant-Pot-Egg-Curry-8_pfeujw.jpg",
          available: true 
    },
    {
      name: "Fish Curry Bowl",
      description: "Tangy fish curry served with steamed rice",
      price: 180,
      imageUrl:
        "https://res.cloudinary.com/dmrqjhzx5/image/upload/v1759911769/fish-curry_mrarny.jpg",
          available: true 
    },
    {
      name: "Dal Tadka Bowl",
      description: "Classic yellow dal tadka with rice",
      price: 110,
      imageUrl:
        "https://res.cloudinary.com/dmrqjhzx5/image/upload/v1759911653/dal-tadka_vymsal.jpg",
          available: true 
    },
  ]);
console.log("Inserted menu items:", menu.map(m => ({ _id: m._id, name: m.name, imageUrl: m.imageUrl })));


  const addons = await Addon.insertMany([
    { name: "Extra Cheese", price: 30 },
    { name: "Coke (300ml)", price: 40 },
    { name: "French Fries", price: 60 },
    { name: "Green Chutney", price: 10 },
    { name: "Tomato Ketchup", price: 10 },
    { name: "Raita", price: 25 },
  ]);

  console.log(`Seeded ${menu.length} menu items and ${addons.length} add-ons.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
