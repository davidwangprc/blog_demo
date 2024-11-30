"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./writeMenu.module.css";

const WriteMenu = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!isDevelopment && !currentUser?.isAdmin) return null;

  return (
    <div className={styles.container} onMouseLeave={() => setIsOpen(false)}>
      <div className={styles.write} onMouseEnter={() => setIsOpen(true)}>
        Write
      </div>
      {isOpen && (
        <div className={styles.menu}>
          <Link href="/writePost" className={styles.link}>
            Post write
          </Link>
          <Link href="/createRecipe" className={styles.link}>
            Recipe create
          </Link>
        </div>
      )}
    </div>
  );
};

export default WriteMenu; 