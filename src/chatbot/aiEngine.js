// Placeholder for a future LLM-backed engine. Once you have an API key,
// set CHAT_ENGINE=ai and AI_API_KEY in Backend/.env, and fill in the call
// below (e.g. using @anthropic-ai/sdk's messages.create) to generate replies
// instead of the rule-based bots in customerBot.js / salesBot.js.

async function generateAiReply({ botType, text, history }) {
  if (!process.env.AI_API_KEY) {
    throw new Error('AI_API_KEY is not set. Set CHAT_ENGINE=rules in .env until you configure an AI provider.');
  }

  // TODO: integrate your AI provider's SDK here, e.g.:
  //
  // const Anthropic = require('@anthropic-ai/sdk');
  // const client = new Anthropic({ apiKey: process.env.AI_API_KEY });
  // const response = await client.messages.create({
  //   model: 'claude-sonnet-5',
  //   max_tokens: 500,
  //   system: botType === 'customer' ? CUSTOMER_SYSTEM_PROMPT : SALES_SYSTEM_PROMPT,
  //   messages: [...history, { role: 'user', content: text }],
  // });
  // return response.content[0].text;

  throw new Error('AI engine not yet implemented — configure your provider in src/chatbot/aiEngine.js');
}

module.exports = { generateAiReply };
