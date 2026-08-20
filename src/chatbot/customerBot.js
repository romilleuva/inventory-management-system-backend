const Inquiry = require('../models/Inquiry');

const FAQ = [
  {
    keywords: ['indoor'],
    reply:
      'Our Indoor Drivers are built for reliable, rugged performance in commercial and residential indoor lighting. Would you like a brochure or to speak with our sales team?',
  },
  {
    keywords: ['outdoor'],
    reply:
      'Our Outdoor Drivers are weatherproof and designed for street lighting, transportation and sports lighting projects. Want me to connect you with our sales team for pricing?',
  },
  {
    keywords: ['smart'],
    reply:
      'Our Smart Drivers support dimming and smart controls for modern lighting systems. I can have our team send you technical specs — want to share your email?',
  },
  {
    keywords: ['cob', 'chip on board', 'chip-on-board'],
    reply: 'We manufacture COB (Chip-on-Board) LED components used across our driver ranges. Want more details?',
  },
  {
    keywords: ['price', 'pricing', 'cost', 'quote', 'quotation'],
    reply:
      'For pricing and quotations, please share your name, email/phone and the product you are interested in — our sales team will get back to you.',
  },
  {
    keywords: ['contact', 'phone', 'email', 'address', 'reach'],
    reply:
      'You can reach Power Palazzo through the Contact section on our website, or leave your details here and our team will contact you.',
  },
  {
    keywords: ['about', 'company', 'who are you', 'history'],
    reply:
      'Power Palazzo has 24+ years of experience manufacturing rugged, economical LED drivers and components, serving transportation, hospitality, education, sports, residential and commercial sectors.',
  },
  {
    keywords: ['hi', 'hello', 'hey'],
    reply: 'Hello! Welcome to Power Palazzo. Ask me about our Indoor, Outdoor or Smart LED drivers, or say "quote" to request pricing.',
  },
  {
    keywords: ['thank', 'thanks'],
    reply: "You're welcome! Anything else I can help with?",
  },
];

const LEAD_TRIGGER = ['quote', 'pricing', 'contact me', 'call me', 'email me'];

function matchFaq(textLower) {
  for (const item of FAQ) {
    if (item.keywords.some((k) => textLower.includes(k))) return item.reply;
  }
  return null;
}

async function handleCustomerMessage({ sessionId, text, lead }) {
  const textLower = text.toLowerCase();

  // If the frontend sends structured lead capture (name/email/phone), save it as an inquiry.
  if (lead && (lead.name || lead.email || lead.phone)) {
    await Inquiry.create({ ...lead, sessionId, message: text });
    return "Thanks! I've noted your details — our sales team will reach out to you shortly. Anything else I can help with?";
  }

  const faqReply = matchFaq(textLower);
  if (faqReply) return faqReply;

  if (LEAD_TRIGGER.some((k) => textLower.includes(k))) {
    return 'Sure — could you share your name and email or phone number so our team can follow up with you?';
  }

  return "I'm not sure about that yet, but I can pass your question to our team. Could you share your name and email/phone so we can follow up? You can also ask me about our Indoor, Outdoor or Smart LED drivers.";
}

module.exports = { handleCustomerMessage };
