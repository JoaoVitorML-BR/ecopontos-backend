import { Document, Model, Types } from 'mongoose';

export interface IEcoPoint {
    _id: Types.ObjectId;
    title: string;
    cnpj: string;
    opening_hours: string;
    interval: string;
    accepted_materials: string[];
    address: string;
    coordinates: string;
    companyId: Types.ObjectId;
}

export interface IEcoPointDocument extends Omit<IEcoPoint, '_id'>, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEcoPointModel extends Model<IEcoPointDocument> { }
