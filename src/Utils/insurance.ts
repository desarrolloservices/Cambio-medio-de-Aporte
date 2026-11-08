export interface InsuranceValues {
  prima: number;
  sumaAsegurada: number;
}

const roundToTwoDecimals = (value: number): number =>
  Number(value.toFixed(2));

const getInsuranceCap = (moneda?: string) => {
  const currency = (moneda ?? "").trim().toUpperCase();
  const isDollars = ["USD", "DOLARES", "DÓLARES", "$"].includes(currency);

  return isDollars
    ? { sumaAsegurada: 100000, prima: 40 }
    : { sumaAsegurada: 2500000, prima: 1000 };
};

/**
 * Aplica las reglas de aporte para cuentas con seguro.
 * El seguro 1 conserva los valores en cero. El seguro 3 conserva los valores
 * del plan y el backend actualiza el aporte sin recalcular cobertura ni prima.
 * La cobertura del seguro 2 solo se recalcula para aportes mensuales; para un
 * aporte único se conservan los valores vigentes del plan.
 */
export const calculateInsuranceValues = ({
  tieneSeguro,
  tipoSeguro,
  aporte,
  tipoAporte = "MENSUAL",
  valoresActuales,
  moneda,
}: {
  tieneSeguro: boolean;
  tipoSeguro: number;
  aporte: number;
  tipoAporte?: string;
  valoresActuales: InsuranceValues;
  moneda?: string;
}): InsuranceValues => {
  if (!tieneSeguro) {
    return { prima: 0, sumaAsegurada: 0 };
  }

  if (tipoSeguro === 1) {
    return { prima: 0, sumaAsegurada: 0 };
  }

  if (tipoSeguro === 3) {
    return valoresActuales;
  }

  if (tipoSeguro !== 2) return { prima: 0, sumaAsegurada: 0 };

  if (tipoAporte.trim().toUpperCase() !== "MENSUAL") {
    return valoresActuales;
  }

  const aporteValido = Number.isFinite(aporte) && aporte > 0 ? aporte : 0;
  const calculoSumaAsegurada = aporteValido * 300;
  const tope = getInsuranceCap(moneda);
  const sumaAsegurada = Math.min(calculoSumaAsegurada, tope.sumaAsegurada);
  const prima = sumaAsegurada === tope.sumaAsegurada
    ? tope.prima
    : roundToTwoDecimals((sumaAsegurada / 1000) * 0.4);

  return { prima, sumaAsegurada };
};
