export const SESSION_EXPIRED_CODE = "SESSION_EXPIRED";
export const SESSION_EXPIRED_EVENT = "afp:session-expired";

export interface ApiErrorDetails {
  status?: number;
  code?: string;
}

export const getApiErrorDetails = (error: unknown): ApiErrorDetails => {
  const response = (error as {
    response?: { status?: number; data?: { code?: string } };
  })?.response;

  return {
    status: response?.status,
    code: response?.data?.code,
  };
};

export const isSessionExpiredError = (error: unknown): boolean => {
  const { status, code } = getApiErrorDetails(error);
  return status === 401 && code === SESSION_EXPIRED_CODE;
};

export const notifySessionExpired = (): void => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
};
