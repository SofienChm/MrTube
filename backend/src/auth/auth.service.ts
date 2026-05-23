import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { prisma } from '../shared/prisma';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  /**
   * Register a new user account.
   */
  async register(email: string, password: string, name: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });

    return this.generateToken(user.id, user.email);
  }

  /**
   * Authenticate a user with email and password.
   */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user.id, user.email);
  }

  /**
   * Find a user by ID.
   */
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  private generateToken(sub: string, email: string) {
    return {
      access_token: this.jwt.sign({ sub, email }, { expiresIn: '7d' }),
    };
  }
}
