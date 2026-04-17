import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Utilisateurs hardcodés pour le PoC. En prod : remplacer par une table DB + bcrypt.
const USERS = [
  { id: '1', email: 'admin@futurekawa.com',    password: 'admin123',    role: 'admin',    country: 'all' },
  { id: '2', email: 'brazil@futurekawa.com',   password: 'brazil123',   role: 'operator', country: 'BR'  },
  { id: '3', email: 'ecuador@futurekawa.com',  password: 'ecuador123',  role: 'operator', country: 'EC'  },
  { id: '4', email: 'colombia@futurekawa.com', password: 'colombia123', role: 'operator', country: 'CO'  },
];

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(email: string, password: string): { accessToken: string } {
    const user = USERS.find((u) => u.email === email && u.password === password);
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      country: user.country,
    });

    return { accessToken: token };
  }
}
