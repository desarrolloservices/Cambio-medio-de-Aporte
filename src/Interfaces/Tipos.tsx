export interface Plan {
    id:            number;
    nombre:        string;
    prima:         number;
    sumaAsegurada: number;
}


export interface cuenta {
    cuenta: string;
    tiene_seguro: boolean;
    prima: number;
    forma_pago: string;
    moneda: string;
    aporte: number;
    contrato:string;
    modalidad:string;
  }

 

  export interface ClienteData {
    Tarjeta: string;
    Aporte: "MENSUAL" | string; // Consider more specific types if possible
    Monto: string; // Or number if you handle it as a number elsewhere
    Contrato: string;
    MonedaCCI: "LEMPIRAS" | string; // Consider more specific types if possible
    DiaDebito: string;
    Identidad: string;
    CCI: string;
    Email: string;
    NombreCliente: string;
    Banco: string;
    Vencimiento: string;
    TipoDebito: "TC" | string; // Consider more specific types if possible
    Modalidad: "AFSL1" | string; // Consider more specific types if possible
    MonedaDebito: "LEMPIRAS"| string;
    Canal: "OVP" | string; 
  }

  export interface ClienteDataUpdate {
    ID:string;
    Tarjeta: string;
    Aporte: "MENSUAL" | string; // Consider more specific types if possible
    Monto: string; 
    Contrato: string;
    MonedaCCI: "LEMPIRAS" | string; // Consider more specific types if possible
    DiaDebito: string;
    Identidad: string;
    CCI: string;
    Email: string;
    NombreCliente: string;
    Banco: string;
    Vencimiento: string;
    TipoDebito: "TC" | string; // Consider more specific types if possible
    Modalidad: "" | string; // Consider more specific types if possible
    Estado:"I";
    MonedaDebito: "LEMPIRAS"| string
      Canal: "OVP" | string; 

  }

  

  export interface informacionCliente {
Nombre: string;
Correo: string;
Edad: string;
  }

  export interface productosCliente {
    Cuenta: string;
    Moneda: string;
    Contrato: string;
    Modalidad: string;
      }

      export interface RawData {
        Tarjeta: string;
        Aporte: string; 
        DiaDebito: string;
        FechaVencimiento: string; 
        TipoDebito: string; 
        Estatus: string;
        ID: number; 
        Contrato: string;
        Banco:String;
        Monto:String;
        MonedaDebito:String

  }
  
  
  
  