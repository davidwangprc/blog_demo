"use client";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

const ThemeDisplay = () => {
  const { theme } = useContext(ThemeContext);
  return <div>当前主题：{theme}</div>;
};

export default ThemeDisplay; 