import {
  getApiErrorDetails,
  isSessionExpiredError,
} from "./sessionExpired";

const apiError = (status?: number, code?: string) => ({
  response: { status, data: { code } },
});

describe("session expiration detection", () => {
  it("matches only 401 SESSION_EXPIRED", () => {
    expect(isSessionExpiredError(apiError(401, "SESSION_EXPIRED"))).toBe(true);
    expect(isSessionExpiredError(apiError(401, "OTHER_401"))).toBe(false);
    expect(isSessionExpiredError(apiError(500, "SESSION_EXPIRED"))).toBe(false);
    expect(isSessionExpiredError(new Error("Network error"))).toBe(false);
  });

  it("extracts status and code without retaining response data", () => {
    expect(getApiErrorDetails(apiError(429, "RATE_LIMIT"))).toEqual({
      status: 429,
      code: "RATE_LIMIT",
    });
  });
});
