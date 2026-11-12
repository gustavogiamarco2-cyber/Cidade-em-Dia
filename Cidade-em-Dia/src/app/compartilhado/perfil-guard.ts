import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacaoService } from './autenticacao-service';

export const perfilGuard: CanActivateFn = route => {
  const auth = inject(AutenticacaoService);
  return auth.perfil() === route.data['perfil'] || inject(Router).createUrlTree(['/auth/login']);
};
