import { StateGraph, StateSchema, type GraphNode, START,END,type CompiledStateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { MistralModel } from "./model.ai.js";
import { GeminiModel } from "./model.ai.js";
import { CohereModel } from "./model.ai.js";
import { createAgent, providerStrategy } from "langchain";
import { HumanMessage } from "langchain";

const state = new StateSchema({
  problem: z.string().default(""),
  solution_1: z.string().default(""),
  solution_2: z.string().default(""),
  judge: z.object({
    solution_1: z.number().default(0),
    solution_2: z.number().default(0),
    solution_1_reasoning: z.string().default(""),
    solution_2_reasoning: z.string().default(""),
    winner: z.string().default(""),
  })
});

const solutionNode: GraphNode<typeof state> = async (state) => {
  const [mistralResponse, cohereResponse] = await Promise.all([
    MistralModel.invoke(state.problem),
    CohereModel.invoke(state.problem),
  ]);

  return {
    solution_1: mistralResponse.text,
    solution_2: cohereResponse.text,
  };
};



const judgeNode: GraphNode<typeof state> = async (state) => {
  const { problem, solution_1, solution_2 } = state;

  const judge = createAgent({
    model: GeminiModel,
    responseFormat: providerStrategy(
      z.object({
        solution_1_score: z.number(),
        solution_2_score: z.number(),
        solution_1_reasoning: z.string(),
        solution_2_reasoning: z.string(),
        winner: z.string(),
      })
    ),
    systemPrompt: `
        You are a judge in a competition between two AI models.
        Problem: ${problem}
        Solution 1: ${solution_1}
        Solution 2: ${solution_2}
        
        Please evaluate the solutions and provide a score for each (0-10) and a winner.
        `,
  });

  

const judgeResponse = await judge.invoke({
    messages:[
        new HumanMessage(`
        Problem: ${problem}
        Solution 1: ${solution_1}
        Solution 2: ${solution_2}
        please provide your response in the following format:
        {
            solution_1_score: number,
            solution_2_score: number,
            solution_1_reasoning: string,
            solution_2_reasoning: string,
            winner: string,
        }
        `)
    ]
})

const {solution_1_score, solution_2_score, solution_1_reasoning, solution_2_reasoning, winner} = judgeResponse.structuredResponse

return {
    judge: {
        solution_1: solution_1_score,
        solution_2: solution_2_score,
        solution_1_reasoning,
        solution_2_reasoning,
        winner,
    }
}
 
};


const graph: any = new StateGraph(state)
    .addNode("solution", solutionNode)
    .addNode("judge_node", judgeNode)
    .addEdge(START, "solution") 
    .addEdge("solution", "judge_node")
    .addEdge("judge_node", END)
    .compile();

export default async function runGraph(problem:string) {
  const result = await graph.invoke({
    problem: problem,
  })
  return result;
}; 