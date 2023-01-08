const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: { type: String, required: true },
        address: { type: String, required: true },
        date: { type: String, required: true },
        budget: { type: Number, required: true },
        description: { type: String },
        paymentType: { type: String, default: 'COD' },
        image: { type: String },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Expense', expenseSchema);