import { Update } from "@mui/icons-material";
import axios from "axios";
import crypto from "crypto-js";
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

export const instanceGetSession1 = axios.create({
  baseURL:  process.env.REACT_APP_API_WHOOK,
  withCredentials: true,               
});

export const instanceVerificar1 = axios.create({
  baseURL:  process.env.REACT_APP_API_VERIFF,
  withCredentials: true,               
                 
});











export const InfoCliente = {
  obtieneInfo: function () {
   const tokenid = localStorage.getItem("tokenid");


    return instanceCliente.get('',{
      headers: {
        "Access-Control-Allow-Origin": "localhost:3000/",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With,token",

        "Content-Type": "application/json",
        Authorization: "Basic " + process.env.REACT_APP_AUTHORIZATION,
        
        AuthorizationAFP: tokenid,

        // Add more headers here if needed
      },
    });
  },
};

export const InfoProductos = {
  obtieneInfo: function () {
    const tokenid = localStorage.getItem("tokenid");

    return instanceProductos.get('',{
      headers: {
        "Access-Control-Allow-Origin": "localhost:3000/",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With,token",

        "Content-Type": "application/json",
        Authorization: "Basic " + process.env.REACT_APP_AUTHORIZATION,
   
        AuthorizationAFP: tokenid,

        // Add more headers here if needed
      },
    });
  },
};

export const InfoConsulta = {
  InfoConsulta: function (cuenta:string) {
 
const cta={Cuenta:cuenta}
    return instanceConsulta.post('',cta,{
      headers: {
                "Content-Type": "application/json",
  
      },
    });
  },
};

export const InfoActualiza = {
  UpdateInfo: function () {
 

    return instanceUpdate.get('',{
      headers: {
        "Access-Control-Allow-Origin": "localhost:3000/",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With,token",

        "Content-Type": "application/json",
   

        // Add more headers here if needed
      },
    });
  },
};


export const InfoInsert = {
 InsertInfo: function (data: ClienteData) {


    return instanceInsert.get('',{
      headers: {
        "Access-Control-Allow-Origin": "localhost:3000/",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With,token",

        "Content-Type": "application/json",
    
      },
    });
  },
};

export const InfoInsertaVeriff = {
  InfoConsulta: function (data: dataVeriff) {
 

    return instanceVerificar.post('',data,{
      headers: {
                "Content-Type": "application/json",
  
      },
    });
  },
};

export const validateToken = {
  getToken: function () {
    // Append the id to the endpoint
    const token = localStorage.getItem("tokenid");

    return instanceToken.get('', {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000/',
          'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, AuthorizationAFP, X-Requested-With,token',
          
          //'Content-Type': 'application/json',
          "AuthorizationAFP": token,
            // Add more headers here if needed
        }
    });
}
}


export const validateSession = {
  obtieneSession: function (session:string) {
    
const veriffPk : string =  process.env.REACT_APP_PKV!;


const signature = crypto.HmacSHA256(session, veriffPk).toString();


    return instanceGetSession.get(session+"/decision",{
      headers: {
        "Access-Control-Allow-Origin": "localhost:3000/",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With,token",

        "Content-Type": "application/json",
        "X-AUTH-CLIENT": process.env.REACT_APP_KV,
        "X-HMAC-SIGNATURE": signature
       
        
   

        // Add more headers here if needed
      },
    });
  },
};

export const validateToken1 = {
  getToken: function () {
    const tokenid = Cookies.get('tokenid'); // 

    return instanceToken1.get('', {
      headers: {
        "Content-Type": "application/json",
        AuthorizationAFP: tokenid ?? '',
      },
      withCredentials: true, 
    });
  },
};

export const InfoCliente1 = {
  obtieneInfo: function () {
    const tokenid = Cookies.get('tokenid'); //
    return instanceCliente1.get('', {
      headers: {
        "Content-Type": "application/json",
        AuthorizationAFP: tokenid ?? '',
      },
      withCredentials: true,
    });
  },
};

export const InfoProductos1 = {
  obtieneInfo: function () {
    const tokenid = Cookies.get('tokenid'); // 

    return instanceProductos1.get('', {
      headers: {
        "Content-Type": "application/json",
        AuthorizationAFP: tokenid ?? '',
      },
      withCredentials: true,
    });
  },
};

export const InfoActualiza1 = {
  UpdateInfo: function (data: ClienteDataUpdate) {
    console.log("Hola aca",data);
    return instanceUpdate1.post('', data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, 
    });
  },
};

export const InfoInsert1 = {
  InsertInfo: function (data: ClienteData) {
console.log("Este es el cuerpo",data);
    return instanceInsert1.post('', data, {
      headers: {
        "Content-Type": "application/json",
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
      },
      withCredentials: true,
    });
  },
};

export const InfoConsulta1 = {
  InfoConsulta: function (cuenta: string, canal:string) {
    const cta = { cuenta: cuenta,canal: canal };

    return instanceConsulta1.post('', cta, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, 
    });
  },
};


export const validateSession1 = {
  obtieneSession: function (session: string) {
   

    return instanceGetSession1.get(`/validatesession?session=${session}`, {
      headers: {
        "Content-Type": "application/json",
       
      },
      withCredentials: true, 
    });
  },
};



