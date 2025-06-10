const { OpenAI } = require("openai");
const { CohereClient } = require("cohere-ai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.GEEMA_API_KEY,
});

const openaisecond = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEW_KEY_ACESS,
});

const cohere = new CohereClient({
    token: process.env.OPEN_KEY,
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

// const Apifunction = async (message) => {
//   try {
//     const response = await openaisecond.chat.completions.create({
//       model: "deepseek/deepseek-r1-0528:free",
//       messages: [{ role: "user", content: message }],
//     });

//     const reply = response.choices[0].message.content;
//     return { reply, statuscode: 200 };
//   } catch (error) {
//     console.error("OpenRouter Error:", error.response?.data || error.message);
//     throw new Error("Failed to fetch response from OpenRouter");
//   }
// };
const Apifunction = async (message) => {
  try {
    const response = await cohere.generate({
      model: "command",
      prompt: message,
      max_tokens: 100,
      temperature: 0.7,
    });

    // console.log("Full Cohere Response:", response);

    const reply = response.generations[0].text;
    return { reply, statuscode: 200 };
  } catch (error) {
    console.error("Cohere Error:", error.message);
    throw new Error("Failed to fetch response from Cohere");
  }
};

module.exports = Apifunction, OpenAIChatAPi;
