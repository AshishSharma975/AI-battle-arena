import express from "express";
import runGraph from "./ai/graph.ai.js";
import { success } from "zod";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
}));


app.get("/use-me", async (req, res) => {
    const result = await runGraph("Write a short story about a robot who discovers emotions.");
    res.json(result);
});

app.post("/invoke", async (req, res) => {
    const { problem } = req.body;
    const result = await runGraph(problem);
    res.status(200).json({
        message: "graph invoked successfully",
        success: true,
        data: result
    });
});



// ES module me __dirname fix
const __dirname = new URL('.', import.meta.url).pathname;

// static files serve
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// React routes handle
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

export default app;