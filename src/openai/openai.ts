import chalk from "chalk";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function aiPrompt(prompt: string): Promise<string> {
  try {
    const completion = await openai.createCompletion({
      model: `text-davinci-001`,
      prompt,
      temperature: 0.6,
      max_tokens: 100,
    });
    return completion?.data?.choices[0]?.text || `Something went awry`;
  } catch (error) {
    console.log(chalk.red(`OpenAI Error:`));
    console.log(chalk.red(error));
    return JSON.stringify(error);
  }
}
