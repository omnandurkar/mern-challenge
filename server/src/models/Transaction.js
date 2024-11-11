
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  image: { type: String },
  sold: { type: Boolean },
  dateOfSale: { type: Date },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
