import express from 'express';
import {
    initializeDatabase,
    getTransactions,
    getStatistics,
    getBarChart,
    getPieChart,
    getCombinedData,
    getAllTransactions,  
} from '../controllers/transactionsController.js';

const router = express.Router();

router.get('/initialize', initializeDatabase);
router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);
router.get('/barchart', getBarChart);
router.get('/piechart', getPieChart);
router.get('/combined', getCombinedData);


router.get('/alltransactions', getAllTransactions);  

export default router;
