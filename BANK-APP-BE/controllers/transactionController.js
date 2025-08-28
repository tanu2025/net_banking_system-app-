const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.sendMoney = async (req, res) => {
    const { receiverEmail, amount } = req.body;
    const senderEmail = req.user.email;

    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be positive' });
    }
    if (senderEmail === receiverEmail) {
        return res.status(400).json({ message: 'Cannot send money to yourself' });
    }

    try {
        const sender = await User.findOne({ email: senderEmail });
        const receiver = await User.findOne({ email: receiverEmail });

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Update balances in a single, atomic operation
        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        // Now, we only create ONE transaction document
        await Transaction.create({
            senderEmail,
            receiverEmail,
            amount
        });

        res.status(200).json({ message: 'Transaction successful', newBalance: sender.balance });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getLastFiveTransactions = async (req, res) => {
    const { email } = req.user;
    try {
        const transactions = await Transaction.find({
            $or: [{ senderEmail: email }, { receiverEmail: email }]
        })
            .sort({ timestamp: -1 })
            .limit(5);

        // Fetch the names of all users involved in these transactions
        const relatedEmails = new Set();
        transactions.forEach(t => {
            relatedEmails.add(t.senderEmail);
            relatedEmails.add(t.receiverEmail);
        });

        const relatedUsers = await User.find({ email: { $in: Array.from(relatedEmails) } }).select('name email');
        const userMap = relatedUsers.reduce((acc, user) => {
            acc[user.email] = user.name;
            return acc;
        }, {});

        // Format the transactions to include the username
        const formattedTransactions = transactions.map(t => {
            const isDebit = t.senderEmail === email;
            const otherPersonEmail = isDebit ? t.receiverEmail : t.senderEmail;
            const otherPersonName = userMap[otherPersonEmail] || 'Unknown User';

            return {
                id: t._id,
                amount: t.amount,
                timestamp: t.timestamp,
                type: isDebit ? 'debit' : 'credit',
                contact: otherPersonName
            };
        });

        res.json(formattedTransactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};