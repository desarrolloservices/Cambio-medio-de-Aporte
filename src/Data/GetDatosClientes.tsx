import { Update } from "@mui/icons-material";
import axios from "axios";

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
 InsertInfo: function () {


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




