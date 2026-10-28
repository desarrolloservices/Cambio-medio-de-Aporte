/*import Cookies from 'js-cookie';

export function saveTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('tokenid');
  
  if (token) {
    Cookies.set('tokenid', token, {
      path: '/',
      expires: 1, // 1 día
      sameSite: 'Strict',
      secure: false, // ponlo en true si usas HTTPS
    });

   

    
  }

  
}

export function saveVeriffFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('tokenid');

  if (token) {
    Cookies.set('tokenid', token, {
      path: '/',
      expires: 1, // 1 día
      sameSite: 'Strict',
      secure: false, // ponlo en true si usas HTTPS
    });

   

    
  }

  
}*/

import Cookies from 'js-cookie';
import { logoutToken1 } from './GetDatosClientes';

function generateFakeId(): number {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % 100000;
}

export function saveTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('tokenid');
  const code= params.get('code');


  if (code) {
    
    Cookies.set('id', code, {
      path: '/',
      expires: 0.5, 
      sameSite: 'Strict',
      secure: false, 
    })};

  if (token) {
    
    Cookies.set('tokenid', token, {
      path: '/',
      expires: 0.5, 
      sameSite: 'Strict',
      secure: true, 
    });

    
    
    const fakeId = generateFakeId();
    params.delete('tokenid');
    params.set('id', fakeId.toString());

    const newUrl =
      window.location.origin + window.location.pathname + '?' + params.toString();

    
    window.history.replaceState({}, document.title, newUrl);
  }
}

const AFP_ATLANTIDA_URL = 'https://www.afpatlantida.com';

const POST_LOGOUT_KEY = 'postLogoutRedirect';

const doRefreshThenRedirect = () => {
  sessionStorage.setItem(POST_LOGOUT_KEY, '1');
  window.location.reload();
};

const getPathCandidates = (): string[] => {
  if (typeof window === 'undefined') return ['/'];
  const p = window.location.pathname || '/';
  // '/', '/formapago', '/formapago/...' => try '/', '/formapago'
  const firstSegment = '/' + p.split('/').filter(Boolean)[0];
  const candidates = new Set<string>();
  candidates.add('/');
  if (firstSegment && firstSegment !== '/undefined' && firstSegment !== '/') candidates.add(firstSegment);
  return Array.from(candidates);
};

const getBaseDomain = (hostname: string): string | null => {
  // naive but ok for our use (e.g. sub.domain.com -> domain.com)
  const parts = hostname.split('.').filter(Boolean);
  if (parts.length < 2) return null;
  return parts.slice(-2).join('.');
};

const getDomainCandidates = (): Array<string | undefined> => {
  if (typeof window === 'undefined') return [undefined];
  const hostname = window.location.hostname || '';
  const candidates = new Set<string | undefined>();
  candidates.add(undefined); // no domain attribute
  if (hostname) {
    candidates.add(hostname);
    candidates.add(`.${hostname}`);
    const base = getBaseDomain(hostname);
    if (base) {
      candidates.add(base);
      candidates.add(`.${base}`);
    }
  }
  return Array.from(candidates);
};

const removeCookieEverywhere = (name: string) => {
  const paths = getPathCandidates();
  const domains = getDomainCandidates();
  const secureVariants = [undefined, true] as const;

  for (const path of paths) {
    for (const domain of domains) {
      for (const secure of secureVariants) {
        Cookies.remove(name, { path, ...(domain ? { domain } : {}), ...(secure ? { secure: true } : {}) });
      }
    }
  }
};

/** Borra las cookies del cliente y llama al servicio tokenlogout; luego refresh y la app redirige a AFP Atlántida. */
export function clearSessionCookies() {
  // Borra todas las cookies que el frontend puede manipular (no HttpOnly)
  removeCookieEverywhere('tokenid');
  removeCookieEverywhere('id');
  removeCookieEverywhere('veriffStatus');
  removeCookieEverywhere('veriffSessionId');
  removeCookieEverywhere('veriffUrl');

  logoutToken1
    .logout()
    .then(doRefreshThenRedirect)
    .catch(doRefreshThenRedirect);
}

/** Clave de sessionStorage que indica que tras el refresh se debe redirigir a AFP. */
export function getPostLogoutRedirectKey() {
  return POST_LOGOUT_KEY;
}


