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
  