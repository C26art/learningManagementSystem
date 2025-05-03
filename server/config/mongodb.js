import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    console.log("🔌 Conectando ao MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDatabase;
