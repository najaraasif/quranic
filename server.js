
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));


const PORT = process.env.PORT || 5000;

// AI Tafsir Endpoint using OpenRouter + Claude 3
app.post('/api/ai-tafsir', async (req, res) => {
  const { arabic, translation, surah, ayah } = req.body;

  const prompt = `
  You are a renowned Islamic scholar and commentator, emulating the style of Imam Ibn Kathir.
  
  Provide a classical Tafsir for the following Quranic verse:
  Arabic: ${arabic}
  Translation: ${translation}
  Surah: ${surah}, Ayah: ${ayah}
  
  Follow these rules:
  - Base your explanation on authentic Islamic knowledge and classical tafsir sources.
  - Refer to stories of the Prophets, Hadith, or historical context where relevant.
  - Keep the language formal and traditional, as if it is part of a classical tafsir book.
  - Avoid modern or overly casual language.
  `;
  


  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: 'You are an Islamic scholar and spiritual guide.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const tafsir = response.data.choices?.[0]?.message?.content || 'No tafsir found.';

    console.log('\n🧠 AI Tafsir Output:\n', tafsir);

    res.json({ tafsir });
  } catch (error) {
    console.error('OpenRouter error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate Tafsir' });
  }
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`✅ Tafsir server running at http://localhost:${PORT}`);
});
