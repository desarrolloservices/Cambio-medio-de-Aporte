import axios from "axios";
import { ClienteData, ClienteDataUpdate } from "../Interfaces/Tipos";
import Cookies from "js-cookie";

export interface dataVeriff {
  nombre: string;
  apellido: string;
  identidad: string;
  idgestion: number;
  email: string;
  caso: number;
}
 

export const instanceCliente = axios.create({
  baseURL: process.env.REACT_APP_URL_NOMBRE,
  
});

export const instanceProductos = axios.create({
    baseURL: process.env.REACT_APP_URL_PRODUCTOS,
    
  });

export const instanceToken = axios.create({
  baseURL: process.env.REACT_APP_TOKEN,
});

export const instanceVerificar = axios.create({
  baseURL: process.env.REACT_APP_VERIFF,
});


export const instanceConsulta = axios.create({
  baseURL: process.env.REACT_APP_GET,
});

export const instanceUpdate = axios.create({
  baseURL: process.env.REACT_APP_UPD,
});

export const instanceInsert = axios.create({
  baseURL: process.env.REACT_APP_POST,
});

export const instanceGetSession = axios.create({
  baseURL: process.env.REACT_APP_WHOOK,
});

//NEXT

export const instanceToken1 = axios.create({
  baseURL:  process.env.REACT_APP_API_TOKEN,
  withCredentials: true,                
});
export const instanceCliente1 = axios.create({
  baseURL:  process.env.REACT_APP_API_CLIENTE,
  withCredentials: true,                
});


export const instanceProductos1 = axios.create({
  baseURL:  process.env.REACT_APP_API_PRODUCTOS,
  withCredentials: true,                
});


export const instanceConsulta1 = axios.create({
  baseURL:  process.env.REACT_APP_API_GET,
  withCredentials: true,                
});
export const instanceUpdate1 = axios.create({
  baseURL:  process.env.REACT_APP_API_UPD,
  withCredentials: true,                
});


export const instanceInsert1 = axios.create({
  baseURL:  process.env.REACT_APP_API_POST,
  withCredentials: true,                
});

export const instanceCode = axios.create({
  baseURL:  process.env.REACT_APP_API_TK,
  withCredentials: true,                
});

export const instanceGetSession1 = axios.create({
  baseURL:  process.env.REACT_APP_API_WHOOK,
  withCredentials: true,               
});

export const instanceVerificar1 = axios.create({
  baseURL:  process.env.REACT_APP_API_VERIFF,
  withCredentials: true,               
                 
});




export const validateToken1 = {
  getToken: function () {
    return instanceToken1.get('', {
      headers: {
        'Content-Type': 'application/json',
        // Si tu BFF exige API key, déjala; si no, quítala:
        'x-api-key': process.env.REACT_APP_API_SECRET_KEY ?? '',
      },
      withCredentials: true,
    });
  },
};

export const InfoCliente1 = {
  obtieneInfo() {
    return instanceCliente1.get("", {
      headers: {
        "Content-Type": "application/json",
        // Si tu BFF valida api key, déjala; si no, quítala:
        "x-api-key": process.env.REACT_APP_API_SECRET_KEY ?? "",
      },
      withCredentials: true, // ← imprescindible para que el browser envíe la cookie
    });
  },
};


export const InfoProductos1 = {
  obtieneInfo() {
    return instanceProductos1.get('', {
      headers: {
        'Content-Type': 'application/json',
        // Si tu BFF valida API key, déjala; si no, quítala:
        'x-api-key': process.env.REACT_APP_API_SECRET_KEY ?? '',
      },
      withCredentials: true, // imprescindible para que el navegador mande la cookie
    });
  },
};

export const InfoActualiza1 = {
  UpdateInfo: function (data: ClienteDataUpdate) {
    
    return instanceUpdate1.post('', data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_SECRET_KEY ?? '',
      },
      withCredentials: true, 
    });
  },
};

export const InfoInsert1 = {
  InsertInfo: function (data: ClienteData) {

    return instanceInsert1.post('', data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_SECRET_KEY ?? '',
      },
      withCredentials: true,
    });
  },
};

export const InfoInsertaVeriff1 = {
  InfoConsulta: function (data: dataVeriff) {
    return instanceVerificar1.post('', data, {
      headers: {
        "Content-Type": "application/json",
         "x-api-key": process.env.REACT_APP_API_SECRET_KEY ?? '',
      },
      withCredentials: true,
    });
  },
};

export const InfoConsulta1 = {
  InfoConsulta: function (cuenta: string) {
    const cta = { cuenta: cuenta,canal: "OVP" };
   
    return instanceConsulta1.post('', cta, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_SECRET_KEY ?? '',
      },
      withCredentials: true, 
    });
  },
};

export const InfoCodeExchange = {
  InfoCode: function (code: string | '') {
    const body = { code };

    return instanceCode.post('', body, {
      headers: {
        'Content-Type': 'application/json',
        // Mantén la API key si tu BFF la valida; si no, elimínala:
        'x-api-key': process.env.REACT_APP_API_SECRET_KEY ?? '',
      },
      withCredentials: true, // imprescindible para aceptar la cookie
    });
  },
};


export const validateSession1 = {
  obtieneSession: function (session: string) {
   

    return instanceGetSession1.get(`/validatesessionfm?session=${session}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_SECRET_KEY ?? '',
       
      },
      withCredentials: true, 
    });
  },
};



