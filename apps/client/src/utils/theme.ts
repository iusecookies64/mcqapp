export const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const html = document.documentElement;
  if (savedTheme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
};

export const toggleTheme = (): void => {
  const savedTheme = localStorage.getItem("theme");
  const html = document.documentElement;
  if (savedTheme === "dark") {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
};

export const getTheme = (): "dark" | "light" => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  else {
    // saving theme as light
    localStorage.setItem("theme", "light");
    return "light";
  }
};
