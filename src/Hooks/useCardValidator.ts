export function useCardValidator() {
  const luhnCheck = (num: string): boolean => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const getCardType = (number: string): string => {
    const patterns: Record<string, RegExp> = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };

    for (const [type, regex] of Object.entries(patterns)) {
      if (regex.test(number)) return type;
    }
    return "unknown";
  };

  const getMaxLength = (cardType: string): number => {
    switch (cardType) {
      case "amex":
        return 15;
      case "visa":
      case "mastercard":
      case "discover":
        return 16;
      default:
        return 19; // unknown o Diners/JCB
    }
  };

  const validateCard = (cardNumber: string): { cardNumber?: string } => {
    const errors: { cardNumber?: string } = {};
    const cleanNumber = cardNumber.replace(/\D/g, "");

    if (!cleanNumber) {
      errors.cardNumber = "El número de tarjeta es requerido";
      return errors;
    }

    if (cleanNumber.length >= 13 && cleanNumber[0] === "0") {
      errors.cardNumber = "Número de tarjeta inválido";
      return errors;
    }

    if (cleanNumber.length >= 13 && /^(.)\1+$/.test(cleanNumber)) {
      errors.cardNumber = "Número de tarjeta inválido";
      return errors;
    }

    const cardType = getCardType(cleanNumber);

    // Bloquear explícitamente tarjetas American Express
    if (cardType === "amex") {
      errors.cardNumber = "Únicamente se permiten tarjetas Visa y MasterCard";
      return errors;
    }

    const maxLength = getMaxLength(cardType);

    if (cleanNumber.length < 13) {
      errors.cardNumber = "Debe tener al menos 13 dígitos";
    } else if (cleanNumber.length > maxLength) {
      errors.cardNumber = `Máximo permitido para ${cardType.toUpperCase()}: ${maxLength} dígitos`;
    } else if (!luhnCheck(cleanNumber)) {
      errors.cardNumber = "Número de tarjeta inválido";
    }

    return errors;
  };

  return {
    validateCard,
    getCardType,
    getMaxLength,
  };
}
