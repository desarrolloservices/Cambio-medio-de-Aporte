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





