import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));

app.use(express.json({ limit : "16kb"}));
app.use(express.urlencoded({ extended: true , limit : "16kb"}));
app.use(express.static("public"));

app.use(cookieParser());

//routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users" , userRouter)      //we used /api/v1 just for the info that we are creating api and might make changes in future so v1
export default app;                       //we used use instead of get because we are not using routes directly we are using middleware for that 