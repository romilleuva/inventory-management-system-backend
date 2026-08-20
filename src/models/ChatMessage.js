const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    botType: { type: String, enum: ['customer', 'sales'], required: true },
    sessionId: { type: String, required: true },
    sender: { type: String, enum: ['user', 'bot'], required: true },
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
