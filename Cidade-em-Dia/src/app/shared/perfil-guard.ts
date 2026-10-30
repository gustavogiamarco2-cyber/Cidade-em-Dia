import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

export const perfilGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  return auth.perfil() === route.data['perfil'] || inject(Router).createUrlTree(['/auth/login']);
};
