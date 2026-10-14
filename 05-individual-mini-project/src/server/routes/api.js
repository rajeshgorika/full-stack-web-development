const express = require('express');
const router = express.Router();
const SmartCard = require('../models/SmartCard');
const Transaction = require('../models/Transaction');

// Resilient in-memory initial demo cards
let memoryCards = [
    {
        _id: 'card-001',
        cardNumber: '5428 9201 4481 1092',
        cardUID: 'A4:9F:3C:22',
        holderName: 'Rajesh Gorika',
        rollNumber: '21CS042',
        email: 'rajesh@college.edu',
        department: 'Computer Science & Engineering',
        cardType: 'Student',
        balance: 1450.00,
        status: 'Active',
        expiryDate: new Date('2028-06-30')
    },
    {
        _id: 'card-002',
        cardNumber: '5428 7812 3309 8814',
        cardUID: 'B2:44:8D:11',
        holderName: 'Prof. K. Venkatesh',
        rollNumber: 'FAC-108',
        email: 'venkatesh.k@college.edu',
        department: 'Electronics & Communication',
        cardType: 'Faculty',
        balance: 3200.00,
        status: 'Active',
        expiryDate: new Date('2030-12-31')
    }
];

let memoryTransactions = [
    {
        _id: 'tx-001',
        cardNumber: '5428 9201 4481 1092',
        type: 'Recharge',
        amount: 1000,
        location: 'Admin Cashier Portal',
        status: 'Success',
        remarks: 'Digital Wallet Top-up',
        createdAt: new Date(Date.now() - 3600000 * 24)
    },
    {
        _id: 'tx-002',
        cardNumber: '5428 9201 4481 1092',
        type: 'Tap & Pay',
        amount: 80,
        location: 'Campus Cafeteria POS-01',
        status: 'Success',
        remarks: 'Lunch combo meal',
        createdAt: new Date(Date.now() - 3600000 * 4)
    },
    {
        _id: 'tx-003',
        cardNumber: '5428 9201 4481 1092',
        type: 'Gate Access',
        amount: 0,
        location: 'Central Library Turnstile',
        status: 'Success',
        remarks: 'Access Granted',
        createdAt: new Date(Date.now() - 3600000 * 2)
    }
];

// Helper to generate formatted 16-digit card number
const generateCardNumber = () => {
    const p1 = '5428';
    const p2 = Math.floor(1000 + Math.random() * 9000);
    const p3 = Math.floor(1000 + Math.random() * 9000);
    const p4 = Math.floor(1000 + Math.random() * 9000);
    return `${p1} ${p2} ${p3} ${p4}`;
};

// 1. GET /api/cards - Get all cards
router.get('/cards', async (req, res) => {
    try {
        const cards = await SmartCard.find().sort({ createdAt: -1 });
        if (cards && cards.length > 0) {
            return res.json({ success: true, count: cards.length, data: cards });
        }
    } catch (err) {
        // Fallback to memory
    }
    return res.json({ success: true, count: memoryCards.length, data: memoryCards, source: 'memory' });
});

// 2. GET /api/cards/:id - Get single card
router.get('/cards/:id', async (req, res) => {
    try {
        const card = await SmartCard.findById(req.params.id);
        if (card) return res.json({ success: true, data: card });
    } catch (err) {
        // Fallback
    }

    const memCard = memoryCards.find(c => c._id === req.params.id || c.cardNumber === req.params.id);
    if (memCard) return res.json({ success: true, data: memCard });

    return res.status(404).json({ success: false, error: 'Smart Card not found' });
});

// 3. POST /api/cards - Issue new smart card
router.post('/cards', async (req, res) => {
    const { holderName, rollNumber, email, department, cardType, initialBalance } = req.body;
    if (!holderName || !rollNumber || !email) {
        return res.status(400).json({ success: false, error: 'Name, Roll/Employee ID, and Email are required' });
    }

    const cardNumber = generateCardNumber();
    const hex = () => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0');
    const cardUID = `${hex()}:${hex()}:${hex()}:${hex()}`;
    const balance = parseFloat(initialBalance) || 500.0;

    try {
        const newCard = await SmartCard.create({
            cardNumber,
            cardUID,
            holderName,
            rollNumber,
            email,
            department: department || 'General',
            cardType: cardType || 'Student',
            balance
        });

        // Record initial balance transaction
        await Transaction.create({
            cardId: newCard._id,
            cardNumber,
            type: 'Recharge',
            amount: balance,
            location: 'Smart Card Issuance Counter',
            status: 'Success',
            remarks: 'Initial card credit'
        });

        return res.status(201).json({ success: true, data: newCard });
    } catch (err) {
        const memCard = {
            _id: `card-${Date.now()}`,
            cardNumber,
            cardUID,
            holderName,
            rollNumber,
            email,
            department: department || 'General',
            cardType: cardType || 'Student',
            balance,
            status: 'Active',
            expiryDate: new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000)
        };
        memoryCards.unshift(memCard);

        memoryTransactions.unshift({
            _id: `tx-${Date.now()}`,
            cardNumber,
            type: 'Recharge',
            amount: balance,
            location: 'Smart Card Issuance Counter',
            status: 'Success',
            remarks: 'Initial card credit',
            createdAt: new Date()
        });

        return res.status(201).json({ success: true, data: memCard, source: 'memory' });
    }
});

// 4. PUT /api/cards/:id/status - Toggle Block / Unblock card
router.put('/cards/:id/status', async (req, res) => {
    try {
        const card = await SmartCard.findById(req.params.id);
        if (card) {
            card.status = card.status === 'Active' ? 'Blocked' : 'Active';
            await card.save();
            return res.json({ success: true, message: `Card ${card.status}`, data: card });
        }
    } catch (err) {
        // Fallback
    }

    const memCard = memoryCards.find(c => c._id === req.params.id);
    if (memCard) {
        memCard.status = memCard.status === 'Active' ? 'Blocked' : 'Active';
        return res.json({ success: true, message: `Card ${memCard.status}`, data: memCard });
    }

    return res.status(404).json({ success: false, error: 'Card not found' });
});

// 5. POST /api/cards/:id/recharge - Top-up balance
router.post('/cards/:id/recharge', async (req, res) => {
    const amount = parseFloat(req.body.amount);
    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, error: 'Please provide a valid positive recharge amount' });
    }

    try {
        const card = await SmartCard.findById(req.params.id);
        if (card) {
            if (card.status !== 'Active') {
                return res.status(400).json({ success: false, error: `Cannot recharge a ${card.status} card.` });
            }
            card.balance += amount;
            await card.save();

            const tx = await Transaction.create({
                cardId: card._id,
                cardNumber: card.cardNumber,
                type: 'Recharge',
                amount,
                location: req.body.location || 'Online Gateway Top-Up',
                status: 'Success',
                remarks: 'Wallet recharge'
            });

            return res.json({ success: true, message: 'Recharge successful', data: card, transaction: tx });
        }
    } catch (err) {
        // Fallback
    }

    const memCard = memoryCards.find(c => c._id === req.params.id);
    if (memCard) {
        if (memCard.status !== 'Active') {
            return res.status(400).json({ success: false, error: `Cannot recharge a ${memCard.status} card.` });
        }
        memCard.balance += amount;
        const tx = {
            _id: `tx-${Date.now()}`,
            cardNumber: memCard.cardNumber,
            type: 'Recharge',
            amount,
            location: req.body.location || 'Online Gateway Top-Up',
            status: 'Success',
            remarks: 'Wallet recharge',
            createdAt: new Date()
        };
        memoryTransactions.unshift(tx);
        return res.json({ success: true, message: 'Recharge successful', data: memCard, transaction: tx });
    }

    return res.status(404).json({ success: false, error: 'Card not found' });
});

// 6. POST /api/cards/:id/tap - Tap & Pay or Access Gate
router.post('/cards/:id/tap', async (req, res) => {
    const { amount, location, type } = req.body;
    const cost = parseFloat(amount) || 0;
    const terminalType = type || (cost > 0 ? 'Tap & Pay' : 'Gate Access');
    const terminalLocation = location || 'Smart POS Terminal';

    let card = null;
    try {
        card = await SmartCard.findById(req.params.id);
    } catch (e) {}

    if (!card) {
        card = memoryCards.find(c => c._id === req.params.id);
    }

    if (!card) {
        return res.status(404).json({ success: false, error: 'Smart Card not recognized' });
    }

    // Security check 1: Card status
    if (card.status !== 'Active') {
        const failedTx = {
            _id: `tx-${Date.now()}`,
            cardNumber: card.cardNumber,
            type: terminalType,
            amount: cost,
            location: terminalLocation,
            status: 'Failed - Card Blocked',
            remarks: 'Access Denied: Card is inactive or blocked by security',
            createdAt: new Date()
        };
        memoryTransactions.unshift(failedTx);
        try { await Transaction.create(failedTx); } catch (e) {}

        return res.status(403).json({
            success: false,
            accessGranted: false,
            error: 'ACCESS DENIED: Card is BLOCKED. Please contact campus security.',
            transaction: failedTx
        });
    }

    // Security check 2: Balance check for payments
    if (cost > 0 && card.balance < cost) {
        const failedTx = {
            _id: `tx-${Date.now()}`,
            cardNumber: card.cardNumber,
            type: terminalType,
            amount: cost,
            location: terminalLocation,
            status: 'Failed - Insufficient Balance',
            remarks: `Required: ₹${cost}, Available: ₹${card.balance}`,
            createdAt: new Date()
        };
        memoryTransactions.unshift(failedTx);
        try { await Transaction.create(failedTx); } catch (e) {}

        return res.status(400).json({
            success: false,
            accessGranted: false,
            error: `TRANSACTION DECLINED: Insufficient balance (Current: ₹${card.balance.toFixed(2)})`,
            transaction: failedTx
        });
    }

    // Deduct balance and approve
    card.balance -= cost;
    if (typeof card.save === 'function') {
        try { await card.save(); } catch (e) {}
    }

    const successTx = {
        _id: `tx-${Date.now()}`,
        cardNumber: card.cardNumber,
        type: terminalType,
        amount: cost,
        location: terminalLocation,
        status: 'Success',
        remarks: cost > 0 ? `Payment of ₹${cost} approved` : 'Gate Turnstile Unlocked',
        createdAt: new Date()
    };
    memoryTransactions.unshift(successTx);
    try { await Transaction.create(successTx); } catch (e) {}

    return res.json({
        success: true,
        accessGranted: true,
        message: cost > 0 ? `Payment approved! Deducted ₹${cost.toFixed(2)}` : `Access GRANTED at ${terminalLocation}`,
        newBalance: card.balance,
        transaction: successTx
    });
});

// 7. GET /api/transactions - All transactions
router.get('/transactions', async (req, res) => {
    try {
        const txs = await Transaction.find().sort({ createdAt: -1 }).limit(20);
        if (txs && txs.length > 0) {
            return res.json({ success: true, count: txs.length, data: txs });
        }
    } catch (err) {}
    return res.json({ success: true, count: memoryTransactions.length, data: memoryTransactions });
});

// 8. GET /api/stats - Dashboard analytics
router.get('/stats', (req, res) => {
    const totalCards = memoryCards.length;
    const activeCards = memoryCards.filter(c => c.status === 'Active').length;
    const totalBalance = memoryCards.reduce((acc, c) => acc + c.balance, 0);
    const totalTransactions = memoryTransactions.length;

    res.json({
        success: true,
        stats: {
            totalCards,
            activeCards,
            totalBalance,
            totalTransactions
        }
    });
});

module.exports = router;
