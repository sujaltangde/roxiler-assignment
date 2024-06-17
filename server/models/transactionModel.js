const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: [true, "Please enter title"],
  },
  price: {
    type: Number,
    required: [true, "Please enter price"],
  },
  description: {
    type: String,
    required: [true, "Please enter description"],
  },
  category: {
    type: String,
    required: [true, "Please enter category"],
  },
  image: {
    type: String,
    required: [true, "Please enter image link"],
  },
  sold: {
    type: Boolean,
    required: [true, "Please specify sold or not"],
  },
  dateOfSale: {
    type: String, 
    required: [true, "Please enter date of sale"],
  },
  monthOfSale: {
    type: Number,
    required: [true, "Please enter month of sale"],
  },
});


transactionSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  const exists = await this.constructor.exists({ id: this.id });
  if (exists) {
    const err = new Error('Duplicate id found');
    return next(err);
  }
  next();
});


const transaction = mongoose.model("transaction", transactionSchema);
module.exports = transaction;
