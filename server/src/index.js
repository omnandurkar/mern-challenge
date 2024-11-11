
import express from 'express';
import connectDB from './config/db.js';
import transactionsRoutes from './routes/transactions.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());


connectDB();


app.use('/api', transactionsRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
