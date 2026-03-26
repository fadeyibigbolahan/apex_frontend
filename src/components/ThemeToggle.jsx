import React from "react";
import { Sun, Moon } from "lucide-react";
import { ThemeProviderContext } from "../contexts/theme-context";

const ThemeToggle = () => {
  const { theme, setTheme } = React.useContext(ThemeProviderContext);

  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      <CurrentIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    </button>
  );
};

export default ThemeToggle;
