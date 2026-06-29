import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class CountryOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      user: { role: string; country: string };
      params: { countryCode?: string };
    }>();

    // Le siège (admin) est bloqué par RolesGuard avant d'arriver ici
    // Un exploitant ne peut agir que sur son pays
    const userCountry = req.user?.country;
    const routeCountry = req.params?.countryCode;

    if (userCountry && userCountry !== 'all' && userCountry !== routeCountry) {
      throw new ForbiddenException(`Vous n'avez accès qu'aux lots du pays ${userCountry}`);
    }
    return true;
  }
}
