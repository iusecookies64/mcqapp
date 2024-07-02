export const getAuthorizationToken = () => localStorage.getItem("authToken");

export const removeAuthorizationToken = () => {
  localStorage.removeItem("authToken");
};

export const setAuthorizationToken = (token: string) => {
  console.log("setting token ", token);
  localStorage.setItem("authToken", token);
};
