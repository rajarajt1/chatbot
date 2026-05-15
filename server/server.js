const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://rajarajt1.github.io'
  ]
}));
app.use(express.json());

// Bypass ngrok browser warning
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

const OLLAMA_BASE = 'https://dld.srmist.edu.in/ollama';
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// GET /api/models — list available models
app.get('/api/models', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_BASE}/api/tags`, { httpsAgent });
    const models = response.data.models.map(m => ({
      name: m.name,
      size: m.size,
    }));
    res.json({ models });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch models from SRM server' });
  }
});

// POST /api/chat — send message and get response
app.post('/api/chat', async (req, res) => {
  const { messages, model, systemPrompt } = req.body;

  const fullMessages = [];
  if (systemPrompt) {
    fullMessages.push({ role: 'system', content: systemPrompt });
  }
  fullMessages.push(...messages);

  try {
    const response = await axios.post(
      `${OLLAMA_BASE}/api/chat`,
      // { model: model || 'llama3.1:latest', messages: fullMessages, stream: false },
      { model: model || 'gpt-oss:latest', messages: fullMessages, stream: false },
      { httpsAgent }
    );
    res.json({ message: response.data.message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 SRM AI Backend running at http://localhost:${PORT}`));
