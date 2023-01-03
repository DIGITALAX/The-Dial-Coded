import refresh from "../../graphql/mutations/refresh";

const AUTH_STORAGE_KEY = "LH_STORAGE_KEY";
const NOTIF_STORAGE_KEY = "LH_NOTIFICATIONS";

interface authToken {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
export const setAuthenticationToken = ({ token }: authToken) => {
  const { exp } = parseJwt(token?.accessToken);
  const { accessToken, refreshToken } = token;

  if (typeof window !== "undefined") {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ accessToken, refreshToken, exp })
    );
    return;
  }
};

export const getAuthenticationToken = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!data) return null;

    return JSON.parse(data) as {
      accessToken: string;
      refreshToken: string;
      exp: number;
    };
  }
};

export const removeAuthenticationToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const parseJwt = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const isAuthExpired = (exp: number) => {
  if (!exp) return true;
  if (Date.now() <= exp * 1000) {
    return false;
  }
  return true;
};

export const refreshAuth = async (): Promise<string | undefined | null> => {
  try {
    const currentRefreshToken = getAuthenticationToken()?.refreshToken;
    if (!currentRefreshToken) return null;
    const response = await refresh(currentRefreshToken);
    setAuthenticationToken({ token: response.data.refresh });
    return response?.data?.refresh?.accessToken;
  } catch (err: any) {
    console.error(err.message);
  }
};

export const setNotificationLength = (notifLength: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify({ notifLength }));
    return;
  }
};

export const getNotificationLength = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(NOTIF_STORAGE_KEY);

    if (!data) return null;

    return JSON.parse(data) as {
      notifLength: number;
    };
  }
};
