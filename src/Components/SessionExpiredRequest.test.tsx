import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SessionExpiredRequest, {
  getRequestFormErrorMessage,
} from "./SessionExpiredRequest";
import { requestForm1 } from "../Data/GetDatosClientes";

jest.mock("../Data/GetDatosClientes", () => ({
  requestForm1: { request: jest.fn() },
}));

const requestMock = requestForm1.request as jest.Mock;

describe("SessionExpiredRequest", () => {
  beforeEach(() => requestMock.mockReset());

  it("prevents simultaneous requests and confirms a successful request", async () => {
    let resolveRequest: (value: unknown) => void = () => undefined;
    requestMock.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    render(<SessionExpiredRequest />);

    const button = screen.getByRole("button", { name: "Solicitar Formulario" });
    fireEvent.click(button);
    fireEvent.click(button);

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Enviando solicitud…" })).toBeDisabled();

    resolveRequest({
      status: 201,
      data: { ok: true, code: "FORM_REQUEST_CREATED", ticketId: "test-ticket" },
    });

    expect(
      await screen.findByText("Tu solicitud fue enviada correctamente.")
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows the secure-context message for its exact 401 code", async () => {
    requestMock.mockRejectedValue({
      response: {
        status: 401,
        data: { code: "SUPPORT_CONTEXT_REQUIRED" },
      },
    });

    render(<SessionExpiredRequest />);
    fireEvent.click(screen.getByRole("button", { name: "Solicitar Formulario" }));

    await waitFor(() =>
      expect(
        screen.getByText(
          "No pudimos identificar tu solicitud de forma segura. Abre nuevamente el enlace original o comunícate con soporte."
        )
      ).toBeInTheDocument()
    );
  });

  test.each([
    [429, undefined, "Ya realizaste una solicitud recientemente. Intenta nuevamente más tarde."],
    [502, undefined, "No pudimos procesar la solicitud en este momento. Intenta nuevamente."],
    [503, "HUBSPOT_TICKET_NOT_CONFIGURED", "No pudimos procesar la solicitud en este momento. Intenta nuevamente."],
  ])("maps HTTP %s to the expected message", (status, code, expected) => {
    expect(getRequestFormErrorMessage(status as number, code as string | undefined)).toBe(expected);
  });
});
