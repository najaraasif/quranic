
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// AI Tafsir Endpoint using OpenRouter + Claude 3
app.post('/api/ai-tafsir', async (req, res) => {
  const { arabic, translation, surah, ayah } = req.body;

  const prompt = `
You are an Islamic thinker emulating Sayyid Abul Ala Maududi.

Explain the following Quranic verse with classical Tafsir and connect it to contemporary global realities.

Arabic: ${arabic}
Translation: ${translation}
Surah: ${surah}, Ayah: ${ayah}

Your response must include:
- The historical and linguistic context of the verse
- The moral, social, and political message in line with Maududi's style
- Relevant references to modern events, ideologies, or crises (e.g., political oppression, secularism, global injustice, media influence, moral decay, AI ethics, etc.)
- Reflections for today’s Muslim society and global ummah
- Use scholarly, formal tone with depth — not casual summarization
`;
  


  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',

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
app.post("/api/ai-tafsir-urdu", async (req, res) => {
  const { arabic, translation, surah, ayah } = req.body;

  const prompt = `
آپ ایک اسلامی مفسر ہیں اور سید ابو الاعلیٰ مودودی کے انداز میں قرآن کی آیات کی تفسیر اردو زبان میں بیان کرتے ہیں۔

برائے مہربانی درج ذیل آیت کی مکمل، خوبصورت اور سادہ زبان میں اردو تفسیر فراہم کریں۔ اس میں سیاق و سباق اور آج کے دور کے حوالے بھی شامل کریں۔

Arabic: ${arabic}
Translation: ${translation}
Surah: ${surah}, Ayah: ${ayah}
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an Islamic scholar. Respond only in formal Urdu with rich vocabulary and classical tone."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const tafsir = response.data.choices?.[0]?.message?.content || "❌ کوئی تفسیر دستیاب نہیں۔";
    res.json({ tafsir });
  } catch (error) {
    console.error("Urdu Tafsir Error:", error.response?.data || error.message);
    res.status(500).json({ error: "❌ ترجمہ ناکام ہو گیا۔" });
  }
});
