import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageURL: { type: String, default: null },
  },
  { timestamps: true }
);

// Hash passwords before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const passwordMatches = await bcryptjs.compare(
    candidatePassword,
    this.password
  );
  return passwordMatches;
};

export default mongoose.model("User", userSchema);
