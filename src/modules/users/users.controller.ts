import { 
  Controller, 
  Get, 
  Param,
  UsePipes,
  ValidationPipe 
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return {
      id: user._id.toString(),
      name: user.name
    };
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    const user = await this.usersService.findByName(name);
    if (!user) {
      return { message: 'Usuário não encontrado' };
    }
    return {
      id: user._id.toString(),
      name: user.name
    };
  }

  @Get('validate/:id')
  async validateUser(@Param('id') id: string) {
    const isValid = await this.usersService.validateUser(id);
    return {
      userId: id,
      isValid,
      message: isValid ? 'Usuário válido' : 'Usuário não encontrado'
    };
  }
}
