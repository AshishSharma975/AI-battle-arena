import express from "express";
import runGraph from "./ai/graph.ai.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
}));

// ================= API =================

app.get("/use-me", async (req, res) => {
    try {
        const result = await runGraph("Write a short story about a robot who discovers emotions.");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/invoke", async (req, res) => {
    try {
        const { problem } = req.body;
        const result = await runGraph(problem);

        res.status(200).json({
            message: "graph invoked successfully",
            success: true,
            data: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Invoke failed" });
    }
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static files
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

export default app;


