"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import styles from "./adminPage.module.css";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user?.isAdmin) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className={styles.loading}>加载中...</div>;
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>管理员面板</h1>
        <div className={styles.content}>
          <div className={styles.userInfo}>
            <h2>欢迎回来, {user.name || user.username}</h2>
            <p>邮箱: {user.email || "未设置"}</p>
          </div>
          <div className={styles.actions}>
            <button 
              onClick={() => router.push("/writePost")}
              className={styles.button}
            >
              写文章
            </button>
            <button 
              onClick={() => router.push("/createRecipe")}
              className={styles.button}
            >
              创建菜谱
            </button>
            <button 
              onClick={() => router.push("/")}
              className={styles.button}
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 