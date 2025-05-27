export function useExpiryDateValidator() {
  const isExpiryDateValid = (value: string): boolean => {
    const [monthStr, yearStr] = value.split("/");

    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (isNaN(month) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;

    const currentDate = new Date();
    const inputDate = new Date(2000 + year, month - 1);
    const endOfMonth = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0);

    return endOfMonth >= new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  };

  const getExpiryError = (value: string): string | null => {
    if (!value.includes("/")) return "Formato inválido";
    const [monthStr, yearStr] = value.split("/");

    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (isNaN(month) || isNaN(year)) return "Formato inválido";
    if (month < 1 || month > 12) return "Mes inválido";
    if (!isExpiryDateValid(value)) return "Fecha vencida";

    return null;
  };

  return { isExpiryDateValid, getExpiryError };
}
