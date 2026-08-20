const { getReply } = require('../chatbot');
const ChatMessage = require('../models/ChatMessage');

async function customerChat(req, res) {
  const { sessionId, text, lead } = req.body;
  if (!sessionId || !text) return res.status(400).json({ message: 'sessionId and text are required' });

  await ChatMessage.create({ botType: 'customer', sessionId, sender: 'user', text });

  const reply = await getReply({ botType: 'customer', text, sessionId, lead });

  await ChatMessage.create({ botType: 'customer', sessionId, sender: 'bot', text: reply });

  res.json({ reply });
}

async function salesChat(req, res) {
  const { sessionId, text } = req.body;
  if (!sessionId || !text) return res.status(400).json({ message: 'sessionId and text are required' });

  await ChatMessage.create({ botType: 'sales', sessionId, sender: 'user', text, user: req.user._id });

  const history = await ChatMessage.find({ botType: 'sales', sessionId }).sort({ createdAt: 1 }).limit(20);
  const reply = await getReply({
    botType: 'sales',
    text,
    sessionId,
    user: req.user,
    history: history.map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
  });

  await ChatMessage.create({ botType: 'sales', sessionId, sender: 'bot', text: reply, user: req.user._id });

  res.json({ reply });
}

async function history(req, res) {
  const { botType, sessionId } = req.params;
  const messages = await ChatMessage.find({ botType, sessionId }).sort({ createdAt: 1 });
  res.json(messages);
}

module.exports = { customerChat, salesChat, history };
