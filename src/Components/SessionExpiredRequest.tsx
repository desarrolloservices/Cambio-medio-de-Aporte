import React, { useRef, useState } from "react";
import { Alert, Button, Stack } from "@mui/material";
import { requestForm1 } from "../Data/GetDatosClientes";
import { getApiErrorDetails } from "../Utils/sessionExpired";

type RequestState = "idle" | "loading" | "success" | "error";

export const getRequestFormErrorMessage = (
  status?: number,
  code?: string
): string => {
  if (status === 401 && code === "SUPPORT_CONTEXT_REQUIRED") {
    return "No pudimos identificar tu solicitud de forma segura. Abre nuevamente el enlace original o comunícate con soporte.";
  }

  if (status === 429) {
    return "Ya realizaste una solicitud recientemente. Intenta nuevamente más tarde.";
  }

  if (status === 502) {
    return "No pudimos procesar la solicitud en este momento. Intenta nuevamente.";
  }

  if (status === 503 && code === "HUBSPOT_TICKET_NOT_CONFIGURED") {
    return "No pudimos procesar la solicitud en este momento. Intenta nuevamente.";
  }

  return "No pudimos enviar tu solicitud en este momento. Intenta nuevamente.";
};

const SessionExpiredRequest: React.FC = () => {
  const [state, setState] = useState<RequestState>("idle");
  const [message, setMessage] = useState("");
  const requestInFlight = useRef(false);

  const handleRequest = async () => {
    if (requestInFlight.current || state === "success") return;

    requestInFlight.current = true;
    setState("loading");
    setMessage("");

    try {
      const response = await requestForm1.request();

      if (
        response.status === 201 &&
        response.data?.ok === true &&
        response.data?.code === "FORM_REQUEST_CREATED"
      ) {
        setState("success");
        setMessage("Tu solicitud fue enviada correctamente.");
        return;
      }

      setState("error");
      setMessage(getRequestFormErrorMessage(response.status, response.data?.code));
    } catch (error) {
      const { status, code } = getApiErrorDetails(error);

      if (status === 503 && code === "HUBSPOT_TICKET_NOT_CONFIGURED") {
      }

      setState("error");
      setMessage(getRequestFormErrorMessage(status, code));
    } finally {
      requestInFlight.current = false;
    }
  };

  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 3, width: "100%", maxWidth: 620 }}>
      {state !== "success" && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleRequest}
          disabled={state === "loading"}
        >
          {state === "loading" ? "Enviando solicitud…" : "Solicitar Formulario"}
        </Button>
      )}

      {message && (
        <Alert severity={state === "success" ? "success" : "error"} sx={{ width: "100%" }}>
          {message}
        </Alert>
      )}
    </Stack>
  );
};

export default SessionExpiredRequest;
