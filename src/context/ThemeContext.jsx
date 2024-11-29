// 声明这是客户端组件，告诉 Next.js 这个组件应该在浏览器端运行
"use client";

// 从 React 中导入必要的钩子和 Context API
// createContext: 用于创建一个新的 Context 对象
// useEffect: 用于处理副作用（如更新 localStorage）
// useState: 用于管理组件的状态
import { createContext, useEffect, useState } from "react";

// 创建一个新的 Context 对象，用于在组件树中共享主题状态
export const ThemeContext = createContext();

// 工具函数：从 localStorage 中获取主题设置
// 如果没有存储的主题，默认返回 'light'
const getFromLocalStorage = () => {
  // 检查 window 对象是否存在（避免服务器端渲染错误）
  if (typeof window !== "undefined") {
    const value = localStorage.getItem("theme");
    return value || "light"; // 如果没有存储值，返回默认值 'light'
  }
};

// Context Provider 组件，用于包装需要访问主题状态的子组件
// children 是一个 prop，代表所有被包裹的子组件
export const ThemeContextProvider = ({ children }) => {
  // 使用 useState 初始化主题状态
  // 使用函数式初始化，确保只在组件首次渲染时执行一次
  const [theme, setTheme] = useState(() => getFromLocalStorage());

  // 切换主题的函数
  // 如果当前是 light 主题，切换到 dark，反之亦然
  const toggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // 使用 useEffect 监听主题变化
  // 当主题改变时，将新的主题值保存到 localStorage
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]); // 依赖数组中包含 theme，确保只在 theme 变化时执行

  // 返回 Provider 组件，向子组件提供主题状态和切换函数
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};