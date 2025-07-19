import {
  sendMailServices,
  smtpServices,
  verifySmtpServices,
  fetchUserSentEmailServices,
} from '../services/genrateEmailServices.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const sendMail = async (req, res) => {
  await sendMailServices(req, res);
};

export const fetchUserEmailSendDetails = async (req, res) => {
  await fetchUserSentEmailServices(req, res);
};
export const smptpsetup = async (req, res) => {
  await smtpServices(req, res);
};

export const verifysmtpController = async (req, res) => {
  await verifySmtpServices(req, res);
};

// implement socket.io
export const handleGeminiStream = (socket) => {
  socket.on('generate_email', async ({ topic, tone }) => {
    if (!topic || !tone) {
      socket.emit('email_error', 'Missing topic or tone');
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
Generate a complete professional email based on the topic: "${topic}" using a ${tone} tone. 
Fill all placeholders like [Your Name], [Company Name], etc., with realistic example data.

Return in valid JSON format with these exact keys:
{
  "subject": "Subject line here",
  "body": "Plain text email body here (no HTML, just text with line breaks)"
}

`;

      const result = await model.generateContentStream(prompt);

      let fullResponse = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;

        socket.emit('email_chunk', chunkText);
      }

      try {
        let cleanResponse = fullResponse
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();

        const jsonResponse = JSON.parse(cleanResponse);

        if (!jsonResponse.subject || !jsonResponse.body) {
          throw new Error('Invalid response format from Gemini');
        }
        socket.emit('email_done', jsonResponse);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Original response:', fullResponse);
        socket.emit(
          'email_error',
          'Failed to generate properly formatted email. Please try again.',
        );
      }
    } catch (error) {
      console.error('Gemini error:', error);
      socket.emit('email_error', error.message || 'Failed to generate email');
    }
  });
};
