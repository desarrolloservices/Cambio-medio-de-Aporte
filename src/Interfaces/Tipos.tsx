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
  }

  export interface AporteData {
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
  }

  export interface infoCliente {
Nombre: string;
Correo: string;
Identidad: string;
  }

  export interface productosCliente {
    Cuenta: string;
    Moneda: string;
    Contrato: string;
    Modalidad: string;
      }
      
  
  