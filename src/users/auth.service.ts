import { UsersService } from './users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('Email in use!');

    const salt = randomBytes(8).toString('hex');

    const hash = (await promisify(scrypt)(password, salt, 32)) as Buffer;

    const hashedPassword = salt + '.' + hash.toString('hex');

    const newUser = await this.usersService.create(email, hashedPassword);

    return newUser;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new NotFoundException('user not found!');

    const [salt, storedHash] = user.password.split('.');

    const hash = (await promisify(scrypt)(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('bad password!');

    return user;
  }
}
