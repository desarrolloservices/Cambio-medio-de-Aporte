import axios from "axios";


export const instanceCliente = axios.create({
  baseURL: process.env.REACT_APP_URL_NOMBRE,
  
});

export const instanceProductos = axios.create({
    baseURL: process.env.REACT_APP_URL_PRODUCTOS,
    
  });

export const instanceToken = axios.create({
  baseURL: process.env.REACT_APP_TOKEN,
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

