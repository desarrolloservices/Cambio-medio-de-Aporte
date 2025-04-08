import { Update } from "@mui/icons-material";
import axios from "axios";
import crypto from "crypto-js";
import { ClienteData } from "../Interfaces/Tipos";

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
console.log(token);
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




