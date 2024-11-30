"use client";
import React, { useState, useEffect } from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

const Footer = () => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories", {
          cache: "no-store"
        });
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // 图标配置
  const socialLinks = [
    {
      name: 'civitai',
      url: 'https://www.civitai.com/',
      icons: {
        light: "/logo_civitai_dark.png",
        dark: "/logo_civitai_light.png"
      }
    },
    {
      name: 'youtube',
      url: 'https://www.youtube.com/',
      icons: {
        light: "/logo_youtube_dark.png",
        dark: "/logo_youtube_light.png"
      }
    },
    {
      name: 'github',
      url: 'https://github.com/',
      icons: {
        light: "/logo_github_dark.png",
        dark: "/logo_github_light.png"
      }
    },
    {
      name: 'bilibili',
      url: 'https://www.bilibili.com/',
      icons: {
        light: "/logo_bilibili_dark.png",
        dark: "/logo_bilibili_light.png"
      }
    },
    {
      name: 'ollama',
      url: 'https://ollama.ai/',
      icons: {
        light: "/logo_ollama_dark.png",
        dark: "/logo_ollama_light.png"
      }
    }
  ];

  return (
    <footer className={styles.container}>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.logo}>
            <Image 
              src={theme === 'dark' ? "/david-logo_light.png" : "/david-logo_dark.png"}  
              alt="David Blog" 
              width={50} 
              height={50} 
            />
            <h1 className={styles.logoText}>David-Blog</h1>
          </div>
          <p className={styles.desc}>
            一个抽象且精神不正常的人。存在就像一幅毕加索的画作，充满了不规则的线条和跳跃的色彩，让人捉摸不透却又忍不住想要多看几眼。
          </p>
          <div className={styles.icons}>
            {socialLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.url}
                className={styles.iconLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={theme === 'dark' ? link.icons.dark : link.icons.light}
                  alt={link.name}
                  width={18}
                  height={18}
                />
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.links}>
          <div className={styles.list}>
            <span className={styles.listTitle}>导航</span>
            <Link href="/">首页</Link>
            <Link href="/blog">博客</Link>
            <Link href="/search">搜索</Link>
            <Link href="/about">关于</Link>
          </div>
          <div className={styles.list}>
            <span className={styles.listTitle}>分类</span>
            {categories.map(category => (
              <Link 
                key={category.id} 
                href={`/blog?cat=${category.slug}`}
              >
                {category.title}
              </Link>
            ))}
          </div>
          <div className={styles.list}>
            <span className={styles.listTitle}>社交</span>
            <Link href="https://www.bilibili.com/" target="_blank">Pilipala</Link>
            <Link href="https://www.civitai.com/" target="_blank">Civitai</Link>
            <Link href="https://github.com/" target="_blank">GayHub</Link>
            <Link href="https://www.youtube.com/" target="_blank">Youtube</Link>
            <Link href="https://ollama.ai/" target="_blank">Ollama</Link>
            <Link href="https://www.langchain.com/" target="_blank">LangChain</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;