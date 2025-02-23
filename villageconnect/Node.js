const express = require('express');
const Razorpay = require('razorpay');
const app = express();

app.use(express.json());

// Razorpay instance
const razorpay = new Razorpay({
    key_id: 'YOUR_KEY_ID',
    key_secret: 'YOUR_KEY_SECRET'
});

// Endpoint to generate QR code
app.post('/generate-qr', async (req, res) => {
    const { amount, project } = req.body;

    try {
        const order = await razorpay.orders.create({
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            notes: { project }
        });

        res.json({
            qrCodeUrl: `https://upi.qr.example.com/${order.id}`, // Mock QR code URL
            transactionId: order.id
        });
    } catch (error) {
        res.status(500).send('Error creating order');
    }
});

// Endpoint to check payment status
app.get('/status', async (req, res) => {
    const { transactionId } = req.query;

    try {
        const payment = await razorpay.payments.fetch(transactionId);
        res.json({ status: payment.status, amount: payment.amount / 100, project: payment.notes.project });
    } catch (error) {
        res.status(500).send('Error fetching payment status');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
