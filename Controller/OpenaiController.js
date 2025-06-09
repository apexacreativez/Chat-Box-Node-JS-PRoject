const { OpenAI } = require("openai");
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.GEEMA_API_KEY,
});

const openaisecond = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEW_KEY_ACESS,
});

const OpenAIChatAPi = async (message) => {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemma-3n-e4b-it:free",
      messages: [{ role: "user", content: message }],
    });
    const reply = response.choices[0].message.content;
    return { reply, statuscode: 200 };
  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch response from OpenRouter");
  }
};

const Apifunction = async (message) => {
  try {
    const response = await openaisecond.chat.completions.create({
      model: "mistralai/devstral-small:free",
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0].message.content;
    return { reply, statuscode: 200 };
  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch response from OpenRouter");
  }
};

module.exports = Apifunction, OpenAIChatAPi;
