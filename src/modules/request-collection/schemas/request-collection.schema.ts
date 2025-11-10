import { Schema, Types } from 'mongoose';

export const RequestCollectionSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    companyId: { type: Types.ObjectId, ref: 'Company', required: true },
    ecopointId: { type: Types.ObjectId, ref: 'EcoPoint', required: true },
    quantity: { type: Number, required: true, min: 50 },
    material: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['pendente', 'aceita', 'em_coleta', 'finalizada', 'recusada'],
        default: 'pendente',
    },
    notified: { type: Boolean, default: false },
    notifiedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
