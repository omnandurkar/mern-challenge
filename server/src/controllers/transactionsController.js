import axios from 'axios';
import Transaction from '../models/Transaction.js';

export const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data.map(transaction => {
            const parsedDate = new Date(transaction.dateOfSale);
            if (isNaN(parsedDate)) {
                console.warn(`Invalid date for transaction ID ${transaction.id}, skipping this entry`);
                return null;
            }
            return { ...transaction, dateOfSale: parsedDate };
        }).filter(Boolean);

        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions);

        res.status(200).json({ message: 'Database initialized with seed data.' });
    } catch (error) {
        console.error('Error initializing database:', error.message);
        res.status(500).json({ message: 'Error initializing database', error: error.message });
    }
};

export const getTransactions = async (req, res) => {
    const { search = '', page = 1, perPage = 10, month, year = new Date().getFullYear() } = req.query;

    if (!month || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Invalid month provided' });
    }

    const isNumeric = (value) => !isNaN(value) && value.trim() !== '';
    const searchPrice = isNumeric(search) ? parseFloat(search) : null;

    const startOfMonth = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);

    if (isNaN(startOfMonth) || isNaN(endOfMonth)) {
        return res.status(400).json({ message: 'Invalid date range for month and year' });
    }

    const filter = {
        dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ],
    };

    if (searchPrice !== null) {
        filter.$or.push({ price: searchPrice });
    }

    try {
        const transactions = await Transaction.find(filter)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
};

export const getStatistics = async (req, res) => {
    const { month, year = new Date().getFullYear() } = req.query;

    if (!month || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Invalid month provided' });
    }

    const startOfMonth = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);

    if (isNaN(startOfMonth) || isNaN(endOfMonth)) {
        return res.status(400).json({ message: 'Invalid date range for month and year' });
    }

    try {
        const totalSale = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } } },
            { $group: { _id: null, totalAmount: { $sum: '$price' } } },
        ]);

        const totalSold = await Transaction.countDocuments({ sold: true, dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } });
        const totalNotSold = await Transaction.countDocuments({ sold: false, dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } });

        res.status(200).json({
            totalSaleAmount: totalSale[0]?.totalAmount || 0,
            totalSoldItems: totalSold,
            totalNotSoldItems: totalNotSold,
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
};

export const getBarChart = async (req, res) => {
    const { month, year = new Date().getFullYear() } = req.query;

    if (!month || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Invalid month provided' });
    }

    const startOfMonth = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);

    if (isNaN(startOfMonth) || isNaN(endOfMonth)) {
        return res.status(400).json({ message: 'Invalid date range for month and year' });
    }

    const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: Infinity },
    ];

    const rangeCounts = await Promise.all(
        priceRanges.map(async (range) => ({
            range: range.range,
            count: await Transaction.countDocuments({
                dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
                price: { $gte: range.min, $lt: range.max },
            }),
        }))
    );

    res.status(200).json(rangeCounts);
};

export const getPieChart = async (req, res) => {
    const { month, year = new Date().getFullYear() } = req.query;

    if (!month || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Invalid month provided' });
    }

    const startOfMonth = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);

    if (isNaN(startOfMonth) || isNaN(endOfMonth)) {
        return res.status(400).json({ message: 'Invalid date range for month and year' });
    }

    const categoryCounts = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).json(categoryCounts);
};

export const getCombinedData = async (req, res) => {
    const { month, year = new Date().getFullYear() } = req.query;

    try {
        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            getTransactions(req, res),
            getStatistics(req, res),
            getBarChart(req, res),
            getPieChart(req, res),
        ]);

        res.status(200).json({
            transactions,
            statistics,
            barChart,
            pieChart,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching combined data', error: error.message });
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({});
        console.log('All Transactions:', transactions);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching all transactions:', error);
        res.status(500).json({ message: 'Error fetching all transactions', error: error.message });
    }
};
