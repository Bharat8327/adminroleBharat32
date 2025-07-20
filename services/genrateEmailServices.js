import { errorResponse, successResponse } from '../utils/responseHelper.js';
import statusCode from '../utils/statusCode.js';
import message from '../utils/message.js';
import nodemailer from 'nodemailer';
import { getAdminDBConnection } from '../config/dbManager.js';
import { UserModel } from '../models/UserModel.js';
import { encrypt, decrypt } from '../utils/Encrypt_decrypt.js';

export const sendMailServices = async (req, res) => {
  try {
    const { toEmail, subject, content } = req.body;
    const files = req.files; // Multer handles file uploads
    const { host, port, user, pass } = req.user.smtp;

    const decryptPass = decrypt(pass);

    let transport = nodemailer.createTransport({
      host: host,
      port: port,
      auth: {
        user: user,
        pass: decryptPass,
      },
    });

    // Format attachments for Nodemailer
    let attachments = [];
    if (files && files.length > 0) {
      attachments = files.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      }));
    }

    const formattedBody = content
      .replace(/\n/g, '<br>')
      .replace(/\*\s(.*?)(<br>|$)/g, '• $1<br>');

    const info = await transport.sendMail({
      from: `"Fuel IT Online" <${user}>`,
      to: toEmail,
      subject: subject,
      html: `<!DOCTYPE html>
        <html>
        <head>
          <style> ... </style>
        </head>
        <body>
          <div class="header">
            <h2>${subject}</h2>
          </div>
          <div class="content">
            ${formattedBody}
          </div>
          <div class="footer">
            <p>Sent on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
        </html>
      `,
      attachments, // <-- use the array here
    });

    // ... rest of your code (DB update, etc.) unchanged ...
    const conn = await getAdminDBConnection(req.adminId);
    const User = UserModel(conn);
    const userData = await User.findOne({ email: req.user.email });
    if (userData === null || !userData) {
      throw new Error(message.NOT_FOUND);
    }
    const existing = userData.emailHistory.find(
      (entry) => entry.recipientEmail === toEmail,
    );
    if (existing) {
      if (!existing.subjects.includes(subject)) {
        existing.subjects.push(subject);
        existing.body.push(content);
      }
      existing.count += 1;
      existing.lastSentAt = new Date();
    } else {
      userData.emailHistory.push({
        recipientEmail: toEmail,
        subjects: [subject],
        body: [content],
        count: 1,
        lastSentAt: new Date(),
      });
    }
    await userData.save();
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
    const encryptData = encrypt(pass);

    // Update the user's SMTP settings with provided info
    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $set: {
          'smtp.user': user,
          'smtp.pass': encryptData,
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
