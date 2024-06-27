export const getAuthorizationToken = () => localStorage.getItem("authToken");

export const removeAuthorizationToken = () => {
  localStorage.removeItem("authToken");
};

export const setAuthorizationToken = (token: string) => {
  localStorage.setItem("authToken", token);
};
