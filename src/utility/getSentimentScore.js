const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyzes sentiment and rating to return a sentiment score between 1 and 100.
 * @param {Object} param0 
 * @param {string} param0.text - The product review text.
 * @param {number} param0.rating - The numeric rating from 1 to 5.
 * @returns {Promise<number>} - A number between 1 and 100 representing sentiment score.
 */
async function getSentimentScore({ text, rating }) {
  const systemPrompt = `You are a sentiment analysis AI. 
Given a user-written review and a numeric product rating (1 to 5), evaluate the overall sentiment strength.
Consider both the text and rating to return a final sentiment score between 1 and 100.

Guidelines:
- 1 means extremely negative sentiment.
- 100 means extremely positive sentiment.
- Use rating to adjust sentiment score but prioritize the written review.
- Be consistent and consider sarcasm, strong/weak language, emotional intensity, etc.

Respond only with valid JSON like: { "sentimentScore": <number from 1 to 100> }`;

  const userPrompt = `Review: """${text}"""\nRating: ${rating}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // you can switch to 'gpt-3.5-turbo' for lower cost
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
    });

    const content = completion.choices[0].message.content;

    const parsed = JSON.parse(content);
    const score = parsed.sentimentScore;

    if (typeof score === 'number' && score >= 1 && score <= 100) {
      return score;
    } else {
      throw new Error("Invalid score received");
    }
  } catch (error) {
    console.error("Error in getSentimentScore:", error);
    return 50; // fallback neutral score
  }
}

module.exports = { getSentimentScore };