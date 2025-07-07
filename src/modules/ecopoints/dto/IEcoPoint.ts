import { Document, Model } from 'mongoose';

export interface IEcoPoint {
    id: string;
    title: string;
    cnpj: string;
    opening_hours: string;
    interval: string;
    accepted_materials: string[];
    address: string;
    coordinates: string;
}

export interface IEcoPointDocument extends Omit<IEcoPoint, 'id'>, Document {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEcoPointModel extends Model<IEcoPointDocument> {}
