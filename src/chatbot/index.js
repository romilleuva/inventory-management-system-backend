const { handleCustomerMessage } = require('./customerBot');
const { handleSalesMessage } = require('./salesBot');
const { generateAiReply } = require('./aiEngine');

async function getReply({ botType, text, sessionId, user, lead, history }) {
  const engine = process.env.CHAT_ENGINE || 'rules';

  if (engine === 'ai') {
    return generateAiReply({ botType, text, history });
  }

  if (botType === 'customer') {
    return handleCustomerMessage({ sessionId, text, lead });
  }
  return handleSalesMessage({ user, text });
}

module.exports = { getReply };
