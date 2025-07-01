import {
  genreateEmailServices,
  generateStreamServices,
  sendMailServices,
  smtpServices,
  verifySmtpServices,
  fetchUserSentEmailServices,
} from '../services/genrateEmailServices.js';

export const genrateEmail = async (req, res) => {
  await genreateEmailServices(req, res);
};

export const genrateStreamController = async (req, res) => {
  await generateStreamServices(req, res);
};

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
