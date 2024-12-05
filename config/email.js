const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.kinghost.net',
  port: 465,
  secure: true,
  auth: {
    user: 'suporte@cm-treinamentos.com.br',
    pass: 'qp1al@ZM'
  },
  tls: { rejectUnauthorized: false }
});

module.exports = transporter;
