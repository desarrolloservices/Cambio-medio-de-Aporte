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

function generateFakeId() {
  return Math.floor(Math.random() * 100000);
}

export function saveTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('tokenid');

  if (token) {
    
    Cookies.set('tokenid', token, {
      path: '/',
      expires: 1, 
      sameSite: 'Strict',
      secure: false, 
    });

    
    const fakeId = generateFakeId();
    params.delete('tokenid');
    params.set('id', fakeId.toString());

    const newUrl =
      window.location.origin + window.location.pathname + '?' + params.toString();

    
    window.history.replaceState({}, document.title, newUrl);
  }
}





