"use client";
import React, { useState, useEffect } from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import AuthLink from "../AuthLink/AuthLink";

const NavBar = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await fetch("/api/auth/check", {
                    credentials: "include",
                });
                const data = await response.json();
                
                if (response.ok && data.user) {
                    setCurrentUser(data.user);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        checkUser();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.icons}>
                <Image src="/logo_civitai.png" alt="civitai" width={20} height={20} />
                <Image src="/logo_youtube.png" alt="youtube" width={20} height={20} />
                <Image src="/logo_github.png" alt="github" width={20} height={20} />
                <Image src="/logo_bilibili.png" alt="bilibili" width={20} height={20} />
                <Image src="/logo_ollama.png" alt="ollama" width={20} height={20} />
            </div>
            <div className={styles.logo}>
                DavidWang's Blog
            </div>
            <div className={styles.links}>
                <ThemeToggle />
                <Link href="/" className={styles.link}>Home</Link>
                <Link href="/search" className={styles.link}>Search</Link>
                <Link href="/about" className={styles.link}>About</Link>
                <AuthLink onUserChange={setCurrentUser} />
                {status === "authenticated" && (
                  <>
                    <Link href="/writePost" className={styles.link}>
                      Post write
                    </Link>
                    <Link href="/createRecipe" className={styles.link}>
                      Recipe create
                    </Link>
                  </>
                )}
            </div>
        </div>
    );
};

export default NavBar;

