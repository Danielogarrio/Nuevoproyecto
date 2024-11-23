import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    thumbnail: String,
    code: { type: String, unique: true, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String },
    status: { type: Boolean, default: true }, // Disponibilidad
});

export default mongoose.model('Product', productSchema);