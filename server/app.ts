import express from "express";
import path from "path";
import router from "./router";

const __dirname = path.resolve();

const app = express();

// Static files (React build or dev client)
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));
app.use('/', router)

export default app