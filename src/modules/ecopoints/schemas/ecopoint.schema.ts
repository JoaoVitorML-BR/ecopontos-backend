import { model, Schema } from 'mongoose';
import { IEcoPoint, IEcoPointModel } from '../dto/IEcoPoint';

export const EcoPointSchema = new Schema<IEcoPoint, IEcoPointModel>({
    title: {
        type: String,
        required: [true, 'Título é obrigatório']
    },
    cnpj: {
        type: String,
        required: [true, 'CNPJ é obrigatório'],
        unique: false
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export const Eco = model<IEcoPoint, IEcoPointModel>('EcoPoint', EcoPointSchema);
