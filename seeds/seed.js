import connectDB from "../config/connectDB.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const userData = [
  { username: "Anisul Haque", email: "anisul.haque@gmail.com", password: "123456789" },
  { username: "Shamsur Rahman", email: "shamsur.rahman@gmail.com", password: "123456789" },
  { username: "Ferdousi Priyabhashini", email: "ferdousi.priyabhashini@gmail.com", password: "123456789" },
  { username: "Abdul Alim", email: "abdul.alim@gmail.com", password: "123456789" },
  { username: "Rizia Rahman", email: "rizia.rahman@gmail.com", password: "123456789" },
  { username: "Syed Shamsul Haque", email: "syed.shamsul.haque@gmail.com", password: "123456789" },
  { username: "Hasina Akter", email: "hasina.akter@gmail.com", password: "123456789" },
  { username: "Monirul Islam", email: "monirul.islam@gmail.com", password: "123456789" },
  { username: "Shahidul Alam", email: "shahidul.alam@gmail.com", password: "123456789" },
  { username: "Farida Parveen", email: "farida.parveen@gmail.com", password: "123456789" },
];


const seedData = async () => {
  try {
    await connectDB();

    const hashedUsers = await Promise.all(
      userData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    await User.insertMany(hashedUsers);

    console.log("✅ User Data seeded successfully.");
  } catch (error) {
    console.error("❌ User data seeding error:", error);
  } finally {
    process.exit();
  }
};

seedData();
