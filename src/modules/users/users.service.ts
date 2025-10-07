import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    let userData: any = { ...createUserDto };
    if (userData.role === 'enterprise') {
      userData.approved = false;
    }
    const user = new this.userModel(userData);
    return user.save();
  }

  async countUsers(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async isFirstUser(): Promise<boolean> {
    const userCount = await this.userModel.countDocuments().exec();
    return userCount === 0;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByName(name: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ name }).exec();
  }

  async validateUser(id: string): Promise<boolean> {
    const user = await this.userModel.findById(id).exec();
    return !!user;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async update(id: string, updateUserDto: any): Promise<UserDocument> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async createDefaultAdmin(): Promise<void> {
    try {
      const existingAdmin = await this.userModel.findOne({
        role: 'admin'
      }).exec();

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('123456', 10);

        const admin = new this.userModel({
          name: 'Admin',
          email: 'admin@admin.com',
          password: hashedPassword,
          role: 'admin'
        });

        await admin.save();
      } else {
        console.log('Admin já existe no sistema');
      }
    } catch (error) {
      console.error('Erro ao criar admin padrão:', error);
    }
  }

  async findByRole(role: string): Promise<UserDocument[]> {
    return this.userModel.find({ role }).exec();
  }
}
