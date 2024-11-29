"use client";

import React, { useState, useRef } from "react";
import styles from "./authLink.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

const AuthLink = () => {
    const [showWriteMenu, setShowWriteMenu] = useState(false);
    const router = useRouter();
    const writeMenuRef = useRef(null);
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <>
            {!user?.isAdmin ? (
                <Link href="/login" className={styles.link}>Login</Link>
            ) : (
                <>
                    <div className={styles.writeContainer} ref={writeMenuRef}>
                        <span 
                            className={styles.writeLink}
                            onClick={() => setShowWriteMenu(!showWriteMenu)}
                        >
                            Write
                        </span>
                        {showWriteMenu && (
                            <div className={styles.writeMenu}>
                                <Link href="/writePost" className={styles.menuItem}>
                                    Post
                                </Link>
                                <Link href="/createRecipe" className={styles.menuItem}>
                                    Recipe
                                </Link>
                            </div>
                        )}
                    </div>
                    <span className={styles.link} onClick={handleLogout}>
                        Logout
                    </span>
                </>
            )}
        </>
    );
};

export default AuthLink;

