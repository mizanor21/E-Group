import mongoose from "mongoose";

const expensesHeadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        accountHeads: [
            {
                code: {
                    type: String,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
            }
        ],
    },
    { timestamps: true }
);

export const ExpensesHead =
    mongoose.models.ExpensesHead || mongoose.model("ExpensesHead", expensesHeadSchema);