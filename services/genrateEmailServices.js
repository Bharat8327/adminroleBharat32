import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { errorResponse, successResponse } from '../utils/responseHelper.js';
import statusCode from '../utils/statusCode.js';
import message from '../utils/message.js';
import nodemailer from 'nodemailer';
import { getAdminDBConnection } from '../config/dbManager.js';
import { UserModel } from '../models/UserModel.js';

export const genreateEmailServices = async (req, res) => {
  const { topic, tone } = req.body;
  const prompt = `
  You are an AI email generator. Only generate an email if the input topic is appropriate for email communication.
  
  Topic: "${topic}"
  Tone: "${tone}"
  
  Instructions:
1. If the topic is unrelated to email writing (e.g., song, poem, joke), reply: "This topic is not suitable for email generation."
2. If valid, generate a complete, structured email in the selected tone.
3. Use temporary and realistic placeholder data:
   - Example names: "Alex Johnson", "Samantha Ray"
   - Example emails: "alex.temp123@tempmail.net"
4. Use informal tone only if specified (e.g., use contractions, casual greetings, friendly sign-off).
5. Include a **clear subject line** and **email body**.
6. Return response in this exact JSON format:
{
  "subject": "Email subject here",
  "body": "Full email body here"
}
`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });
  try {
    // Parse the AI response as JSON
    let emailData;
    function extractJson(text) {
      // Remove Markdown code block markers and trim
      return text.replace(/```json|```/g, '').trim();
    }

    if (typeof response.text === 'string') {
      emailData = JSON.parse(extractJson(response.text));
    } else if (
      response &&
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content
    ) {
      emailData = JSON.parse(
        extractJson(response.candidates[0].content.parts[0].text),
      );
    } else {
      throw new Error('Invalid AI response format');
    }

    return successResponse(res, statusCode.OK, message.GEMINAI, emailData);
  } catch (error) {
    console.error('Error parsing AI response:', error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
};

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateStreamServices = async (req, res) => {
  const { topic, tone } = req.query;
  if (!topic || !tone) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing topic or tone' });
  }

  try {
    const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an AI email generator. Generate a formal email with a clear subject line starting with "Subject:" followed by a blank line, then the email body.

The subject line should be relevant and specific to the given topic.

Use a generic, polite greeting addressing a random full name (e.g., Mr. John Smith, Ms. Emily Davis).

The first line of the email body should be naturally tailored to the topic and tone, changing as needed.

End the email with a polite closing: and all content wrap up inside <pre> </pre> tag
dont wrap up give data in 
Topic: "${topic}"  
Tone: "${tone}"
<pre>
Subject: [Relevant subject line]

Dear [Random Full Name],

[Email body content...]

Regards,  
[Sender Name]
</pre>
`;

    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Stream content chunk by chunk
    for await (const chunk of result.stream) {
      const part = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
      if (part) {
        // DO NOT escape newlines, send raw text
        // Replace any occurrence of '\r' to avoid issues with line endings
        const safePart = part.replace(/\r/g, '');

        // SSE requires each message to start with "data: " and end with double newline
        // If the text contains multiple lines, split and prefix each line with "data: "
        const lines = safePart.split('\n');
        for (const line of lines) {
          res.write(`data: ${line}\n`);
        }
        res.write('\n'); // End of this SSE event
      }
    }

    // Indicate stream end
    res.write('event: end\ndata: done\n\n');
    res.end();
  } catch (err) {
    // Handle errors with SSE error event
    res.write('event: error\ndata: Stream failed\n\n');
    res.end();
  }
};

export const sendMailServices = async (req, res) => {
  try {
    const { toEmail, subject, content } = req.body;
    const { host, port, user, pass } = req.user.smtp;

    // Use Ethereal for testing; replace with real SMTP config in production
    let transport = nodemailer.createTransport({
      host: host,
      port: port,
      auth: {
        user: user,
        pass: pass,
      },
    });

    const info = await transport.sendMail({
      from: `"Fuel IT Online" <${user}>`,
      to: toEmail,
      subject: subject,
      html: content,
    });

    const conn = await getAdminDBConnection(req.adminId);
    const User = UserModel(conn);
    console.log('comes', req.adminId);

    const userData = await User.findOne({ email: req.user.email });
    console.log('userData', userData);

    if (userData === null || !userData) {
      throw new Error(message.NOT_FOUND);
    }
    console.log('comes after valid');

    const existing = userData.emailHistory.find(
      (entry) => entry.recipientEmail === toEmail,
    );

    console.log('existing', existing);

    if (existing) {
      console.log('comes inside alrady exist');

      // Update existing recipient history
      if (!existing.subjects.includes(subject)) {
        existing.subjects.push(subject);
      }
      existing.count += 1;
      existing.lastSentAt = new Date();
    } else {
      // Create new recipient entry
      userData.emailHistory.push({
        recipientEmail: toEmail,
        subjects: [subject],
        count: 1,
        lastSentAt: new Date(),
      });
    }
    console.log('user data save to goin');
    await userData.save();
    console.log('saved successfully');
    return successResponse(
      res,
      statusCode.OK,
      message.SUCCESSFULLY,
      'Mail sent successfully.',
    );
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};

export const fetchUserSentEmailServices = async (req, res) => {
  try {
    console.log(req.user.emailHistory.length);
    const details = req.user.emailHistory;
    return successResponse(res, statusCode.OK, 'fetch successfully', details);
  } catch (error) {
    return errorResponse;
  }
};

export const smtpServices = async (req, res) => {
  try {
    const { host, port, user, pass } = req.body;

    // Example: Save/update SMTP config for the user (pseudo code, adjust as per your DB/model)
    const conn = await getAdminDBConnection(req.adminId);
    const User = UserModel(conn);

    // Update the user's SMTP settings with provided info
    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $set: {
          'smtp.user': user,
          'smtp.pass': pass,
        },
      },
      { new: true },
    );

    if (!updatedUser) {
      return errorResponse(res, statusCode.NOT_FOUND, message.NOT_FOUND);
    }
    return successResponse(
      res,
      statusCode.OK,
      'SMTP settings updated successfully',
      updatedUser.smtp,
    );
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};

export const verifySmtpServices = async (req, res) => {
  try {
    const { host, port, user } = req.user.smtp;
    if (host && port && user) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false });
    }
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};
