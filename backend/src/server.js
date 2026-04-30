import dotenv from "dotenv";
import { server } from "./socket/socket.js";
import connectDB from "./config/db.js";
dotenv.config({
  path: "./.env",
});
const port = process.env.PORT || 8000;
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`\n⚙️  Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!! ", err);
  });
