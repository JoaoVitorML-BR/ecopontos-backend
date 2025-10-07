import { model, Schema } from 'mongoose';
import { IEcoPoint, IEcoPointModel } from '../dto/IEcoPoint';
import { v4 as uuidv4 } from 'uuid';

export const EcoPointSchema = new Schema<IEcoPoint, IEcoPointModel>({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    title: {
        type: String,
        required: [true, 'Título é obrigatório']
    },
    cnpj: {
        type: String,
        required: [true, 'CNPJ é obrigatório'],
        unique: true
    },
    opening_hours: {
        type: String,
        required: [true, 'Horário de funcionamento é obrigatório']
    },
    interval: {
        type: String,
        required: [true, 'Intervalo de coleta é obrigatório']
    },
    accepted_materials: {
        type: [String],
        required: [true, 'Materiais aceitos são obrigatórios']
    },
    address: {
        type: String,
        required: [true, 'Endereço é obrigatório']
    },
    coordinates: {
        type: String,
        required: [true, 'Coordenadas são obrigatórias']
    },
    companyId: {
        type: String,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export const Eco = model<IEcoPoint, IEcoPointModel>('EcoPoint', EcoPointSchema);
