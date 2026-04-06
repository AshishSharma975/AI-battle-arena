import express from "express";
import runGraph from "./ai/graph.ai.js";
import { success } from "zod";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true
}));


app.get("/use-me", async (req, res) => {
    const result = await runGraph("Write a short story about a robot who discovers emotions.");
    res.json(result);
});

app.post("/invoke",async(req,res)=>{
    const {problem}=req.body;
    const result = await runGraph(problem);
    res.status(200).json({
        message:"graph invoked successfully",
        success:true,
        data:result
    });
})

export default app