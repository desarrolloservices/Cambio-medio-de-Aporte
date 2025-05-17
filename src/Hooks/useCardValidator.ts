export function useCardValidator() {
  const luhnCheck = (num: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const getCardType = (number: string) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };

    for (const [type, regex] of Object.entries(patterns)) {
      if (regex.test(number)) return type;
    }
    return 'unknown';
  };

  const getMaxLength = (cardType: string) => {
    switch (cardType) {
      case 'amex':
        return 15;
      case 'visa':
      case 'mastercard':
      case 'discover':
        return 16;
      default:
        return 19;
    }
  };

  const validateCard = (cardNumber: string) => {
    const errors: { cardNumber?: string } = {};
    const cleanNumber = cardNumber.replace(/\D/g, '');
    const cardType = getCardType(cleanNumber);
    const maxLength = getMaxLength(cardType);

    if (cleanNumber.length > maxLength) {
      errors.cardNumber = `Máximo permitido para ${cardType.toUpperCase()}: ${maxLength} dígitos`;
    } else if (!luhnCheck(cleanNumber)) {
      errors.cardNumber = 'Número de tarjeta inválido';
    }

    return errors;
  };

  return { validateCard, getCardType, getMaxLength };
}
