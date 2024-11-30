"use client";

import { useTheme } from "next-themes";

const ThemeDisplay = () => {
  const { theme } = useTheme();
  return <div>当前主题：{theme}</div>;
};

export default ThemeDisplay; 