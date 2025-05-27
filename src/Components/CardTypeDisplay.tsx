import React from "react";
import { Typography, Box } from "@mui/material";

interface Props {
  cardNumber: string;
}

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

const getCardTypeLabel = (type: string): string => {
  switch (type) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "MasterCard";
    case "amex":
      return "American Express";
    case "discover":
      return "Discover";
    default:
      return "Desconocido";
  }
};

const CardIcon: React.FC<{ type: string }> = ({ type }) => {
  const size = 24;

  switch (type) {
    case "visa":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect width="48" height="48" fill="#1A1F71" rx="6" />
          <text x="12" y="30" fill="white" fontSize="16" fontFamily="Arial">
            VISA
          </text>
        </svg>
      );
    case "mastercard":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <circle cx="18" cy="24" r="12" fill="#EB001B" />
          <circle cx="30" cy="24" r="12" fill="#F79E1B" />
        </svg>
      );
    case "amex":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect width="48" height="48" fill="#2E77BC" rx="6" />
          <text x="6" y="30" fill="white" fontSize="12" fontFamily="Arial">
            AMEX
          </text>
        </svg>
      );
    case "discover":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect width="48" height="48" fill="#FF6000" rx="6" />
          <text x="4" y="30" fill="white" fontSize="12" fontFamily="Arial">
            DISCOVER
          </text>
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect width="48" height="48" fill="#B0B0B0" rx="6" />
          <text x="8" y="30" fill="white" fontSize="10" fontFamily="Arial">
            ?
          </text>
        </svg>
      );
  }
};

const CardTypeDisplay: React.FC<Props> = ({ cardNumber }) => {
  if (!cardNumber) return null;

  const type = getCardType(cardNumber);
  const label = getCardTypeLabel(type);

  return (
    <Box display="flex" alignItems="center" mt={1} gap={1}>
      <CardIcon type={type} />
      <Typography variant="caption" color="textSecondary">
        Tipo detectado: {label}
      </Typography>
    </Box>
  );
};

export default CardTypeDisplay;
