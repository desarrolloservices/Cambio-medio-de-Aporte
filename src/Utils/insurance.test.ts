import { calculateInsuranceValues } from "./insurance";

describe("calculateInsuranceValues", () => {
  const valoresActuales = { prima: 25, sumaAsegurada: 10000 };

  it("calcula el seguro tipo 2", () => {
    expect(calculateInsuranceValues({
      tieneSeguro: true,
      tipoSeguro: 2,
      aporte: 125.55,
      valoresActuales,
    })).toEqual({ prima: 15.07, sumaAsegurada: 37665 });
  });

  it("mantiene el seguro tipo 1 en cero", () => {
    expect(calculateInsuranceValues({
      tieneSeguro: true,
      tipoSeguro: 1,
      aporte: 500,
      valoresActuales,
    })).toEqual({ prima: 0, sumaAsegurada: 0 });
  });

  it("recalcula el seguro tipo 2 aunque el plan tenga valores actuales", () => {
    expect(calculateInsuranceValues({
      tieneSeguro: true,
      tipoSeguro: 2,
      aporte: 500,
      valoresActuales,
    })).toEqual({ prima: 60, sumaAsegurada: 150000 });
  });

  it("mantiene el tope de seguro en lempiras", () => {
    expect(calculateInsuranceValues({
      tieneSeguro: true,
      tipoSeguro: 2,
      aporte: 10000,
      valoresActuales,
      moneda: "LPS",
    })).toEqual({ prima: 1000, sumaAsegurada: 2500000 });
  });

  it("mantiene el tope de seguro en dólares", () => {
    expect(calculateInsuranceValues({
      tieneSeguro: true,
      tipoSeguro: 2,
      aporte: 1000,
      valoresActuales,
      moneda: "USD",
    })).toEqual({ prima: 40, sumaAsegurada: 100000 });
  });

  it("conserva valores existentes para seguro tipo 3", () => {
    expect(calculateInsuranceValues({
      tieneSeguro: true,
      tipoSeguro: 3,
      aporte: 500,
      valoresActuales,
    })).toEqual(valoresActuales);
  });

  it("reinicia los valores cuando no hay seguro", () => {
    expect(calculateInsuranceValues({
      tieneSeguro: false,
      tipoSeguro: 2,
      aporte: 500,
      valoresActuales,
    })).toEqual({ prima: 0, sumaAsegurada: 0 });
  });
});
