import express, { json } from "express"
import cors from "cors"
import userRouter from "./routes/user.routes.js";
import followRouter from "./routes/follow.routes.js";
import { connectToDB } from "./config/Dbconfig.js";

const app = express();
app.use(express.json())
app.use(cors())

app.use("/api/user",userRouter)
app.use("/api/follow",followRouter)
// app.get("*",(req,res)=>{
//     res.send("Hello world from server")
// })

const Port = process.env.Port || 5000

app.listen(Port,async()=>{
    await connectToDB()
    console.log(`Server is running at http://localhost:${Port}`)
})