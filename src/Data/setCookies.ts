import Cookies from 'js-cookie';

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

  
}




