"use client";
import React, { useState, useEffect } from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import AuthLink from "../AuthLink/AuthLink";
import { useTheme } from "next-themes";
import { FaGithub, FaCode } from "react-icons/fa";

const NavBar = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // 图标配置
    const logos = {
        civitai: {
            light: "/logo_civitai_dark.png",
            dark: "/logo_civitai_light.png"
        },
        youtube: {
            light: "/logo_youtube_dark.png",
            dark: "/logo_youtube_light.png"
        },
        github: {
            light: "/logo_github_dark.png",
            dark: "/logo_github_light.png"
        },
        bilibili: {
            light: "/logo_bilibili_dark.png",
            dark: "/logo_bilibili_light.png"
        },
        ollama: {
            light: "/logo_ollama_dark.png",
            dark: "/logo_ollama_light.png"
        }
    };

    useEffect(() => {
        setMounted(true);
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

    // 避免服务端渲染不匹配
    if (!mounted) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.icons}>
                <div className={styles.iconGroup}>
                    {Object.entries(logos).map(([name, paths]) => (
                        <Image
                            key={name}
                            src={theme === 'dark' ? paths.dark : paths.light}
                            alt={name}
                            width={20}
                            height={20}
                            className={styles.iconImage}
                        />
                    ))}
                </div>
                <ThemeToggle />
            </div>
            <div className={styles.logoContainer}>
                <FaCode className={styles.logoIcon} />
                <div className={styles.logoText}>
                    <span className={styles.logoMain}>David Blog</span>
                    <span className={styles.logoSub}>Code & Share</span>
                </div>
            </div>
            <div className={styles.links}>
                <Link href="/" className={styles.link}>Home</Link>
                <Link href="/collection" className={styles.link}>Collection</Link>
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

