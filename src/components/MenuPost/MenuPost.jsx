import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./menuPost.module.css";
import { FaRegClock, FaRegUser, FaRegNewspaper } from 'react-icons/fa';

// 获取最新的文章和食谱
const getLatestContent = async () => {
  try {
    const [postsRes, recipesRes] = await Promise.all([
      fetch('http://localhost:3000/api/posts?page=1&limit=2', { cache: "no-store" }),
      fetch('http://localhost:3000/api/recipes?page=1&limit=2', { cache: "no-store" })
    ]);

    const [postsData, recipesData] = await Promise.all([
      postsRes.json(),
      recipesRes.json()
    ]);

    const allItems = [
      ...(postsData.posts || []),
      ...(recipesData.recipes || [])
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return allItems.slice(0, 4);
  } catch (error) {
    console.error("Error fetching latest content:", error);
    return [];
  }
};

const MenuPosts = async ({ withImage }) => {
  const items = await getLatestContent();

  // 调试日志
  console.log("Latest content loaded:", items);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FaRegNewspaper className={styles.headerIcon} />
        <h2 className={styles.headerTitle}>最新内容</h2>
      </div>
      <div className={styles.items}>
        {items.map((item) => {
          const isRecipe = item.categoryId === 3;
          const path = isRecipe ? `/recipes/${item.slug}` : `/posts/${item.slug}`;
          const categorySlug = item.category?.slug || 'food';
          const categoryColorVar = `var(--category-${categorySlug}, var(--category-default))`;

          // 调试日志
          console.log(`Menu Post Item:`, {
            title: item.title,
            categorySlug,
            colorVar: categoryColorVar
          });

          return (
            <Link href={path} className={styles.item} key={`${item.id}-${isRecipe ? 'recipe' : 'post'}`}>
              {withImage && item.image && (
                <div className={styles.imageContainer}>
                  <Image src={`/${item.image}`} alt="" fill className={styles.image} />
                </div>
              )}
              <div className={styles.textContainer}>
                <span 
                  className={styles.category}
                  style={{
                    backgroundColor: categoryColorVar,
                    borderColor: categoryColorVar
                  }}
                >
                  {isRecipe ? 'Recipe' : item.category?.title}
                </span>
                <h3 className={styles.postTitle}>
                  {item.title}
                </h3>
                <div className={styles.detail}>
                  <span className={styles.username}>
                    <FaRegUser className={styles.icon} />
                    {item.author?.name || 'Anonymous'}
                  </span>
                  <span className={styles.date}>
                    <FaRegClock className={styles.icon} />
                    {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MenuPosts;