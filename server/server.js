// ... existing code ...
import express from "express";
import { Ollama } from "ollama";
import cors from "cors";
// ... existing code ...

const app = express();
const ollama = new Ollama();

app.use(cors());
app.use(express.json());

// Generate route
app.post("/generate", async (req, res) => {
	const { prompt } = req.body;

	try {
		// Step 1: Generate response using Qwen
		const qwenResponse = await ollama.generate({
			model: "qwen:7b", // Replace with your Qwen model name
			prompt: prompt,
		});

		// Step 2: Pass Qwen's output to the reasoner model
		const reasonerResponse = await ollama.generate({
			model: "hf.co/mradermacher/DeepSeek-R1-Distill-Qwen-7B-Uncensored-Reasoner-i1-GGUF:IQ1_M", // Replace with your reasoner model name
			prompt: qwenResponse.response,
		});

		// Send the final response to the frontend
		res.json({ response: reasonerResponse.response });
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "An error occurred" });
	}
});

app.listen(4000, () => {
	console.log("Server running on http://localhost:4000");
});
