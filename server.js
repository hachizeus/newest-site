const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: email,
        to: 'victorgathecha@gmail.com', // Send to this specific email address
        subject: `New message from ${name}`,
        text: message,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Failed to send message. Please try again later.');
        }
        res.send('Message sent successfully');
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
