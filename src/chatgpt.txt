import {Configuration, OpenAIApi, ChatCompletionRequestMessage} from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const characterConfig = process.env.CHARACTER_CONFIG || '';
const promptPrefix = process.env.PROMPT_PREFIX || '';
const llmModel = process.env.LLM_MODEL || 'gpt-3.5-turbo-0301';

export const askToAI = async (prompts: ChatCompletionRequestMessage[]) => {
  const response = await openai.createChatCompletion({
    model: llmModel,
    messages: [
      {role: 'system', content: characterConfig},
      {role: 'user', content: promptPrefix},
      ...prompts,
    ],
  });

  const answer = response.data.choices[0].message?.content;
  return answer;
};
