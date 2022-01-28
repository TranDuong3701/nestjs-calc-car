import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  NotFoundException,
  HttpCode,
  Session,
  // UseInterceptors,
  // ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
@Controller('api/v1/auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  whoami(@Session() session: any) {
    return this.usersService.findOne(session.userId);
  }

  @Post('/logout')
  logout(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async signUp(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signUp(email, password);
    session.userId = user.id;
    return user;
  }
  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signIn(email, password);
    session.userId = user.id;
    return user;
  }

  @Get()
  getAllUsers() {
    return this.usersService.find();
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) return new NotFoundException('User not found');
    return user;
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @HttpCode(204)
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(parseInt(id));
  }
}
