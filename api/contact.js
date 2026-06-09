const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, company, country, category, quantity, message, website } = req.body;

  if (website) {
    return res.status(200).json({ message: "Spam ignored" });
  }

  if (!name || !email || !company || !country || !category || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Hawthrone Website" <${process.env.SMTP_USER}>`,
    to: "abdullah@hawthroneapparelco.com",
    replyTo: email,
    subject: `New Website Inquiry from ${name}`,
    text: `
New inquiry from Hawthrone Apparel website:

Name: ${name}
Email: ${email}
Company: ${company}
Country: ${country}
Category: ${category}
Quantity: ${quantity || "Not provided"}

Message:
${message}
    `,
  });

  return res.status(200).json({ message: "Inquiry sent successfully" });
};
