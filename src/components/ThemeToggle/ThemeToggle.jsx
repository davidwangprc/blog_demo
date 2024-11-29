"use client";

import Image from "next/image";
import styles from "./themeToggle.module.css";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

const ThemeToggle = () => {
  const { toggle, theme } = useContext(ThemeContext);

  return (
    <div
      className={styles.container}
      onClick={toggle}
      style={{
        backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.05)",
        borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.1)"
      }}
    >
      <Image src="/moon.png" alt="暗色模式" width={14} height={14} className={styles.icon} />
      <div
        className={styles.ball}
        style={
          theme === "dark"
            ? { 
                left: 2, 
                background: "linear-gradient(to right bottom, #1a1a1a, #2d2d2d)",
                borderColor: "rgba(255, 255, 255, 0.1)"
              }
            : { 
                right: 2, 
                background: "linear-gradient(to right bottom, #ffffff, #f0f0f0)",
                borderColor: "rgba(0, 0, 0, 0.1)"
              }
        }
      ></div>
      <Image src="/sun.png" alt="亮色模式" width={14} height={14} className={styles.icon} />
    </div>
  );
};

export default ThemeToggle;