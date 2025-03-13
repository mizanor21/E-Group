import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true }, // Firebase UID
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    permissions: {
      employee: { create: Boolean, view: Boolean, edit: Boolean, delete: Boolean },
      payroll: { create: Boolean, view: Boolean, edit: Boolean, delete: Boolean },
      accounts: { create: Boolean, view: Boolean, edit: Boolean, delete: Boolean },
      settings: { create: Boolean, view: Boolean, edit: Boolean, delete: Boolean },
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);