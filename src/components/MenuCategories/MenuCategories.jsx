import Link from "next/link";
import styles from "./menuCategories.module.css";
import { FaThLarge, FaFolder } from 'react-icons/fa';

// 获取分类列表
const getCategories = async () => {
  const res = await fetch("http://localhost:3000/api/categories", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
};

const MenuCategories = async () => {
  const categories = await getCategories();

  // 调试日志
  console.log("Menu Categories loaded:", categories);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FaThLarge className={styles.headerIcon} />
        <h2 className={styles.headerTitle}>分类浏览</h2>
      </div>
      <div className={styles.categoryList}>
        {categories.map((category) => {
          // 使用与全局变量相同的命名方式
          const categoryColorVar = `var(--category-${category.slug}, var(--category-default))`;
          
          // 调试日志
          console.log(`Menu Category ${category.title}:`, {
            slug: category.slug,
            colorVar: categoryColorVar
          });

          return (
            <Link
              key={category.id}
              href={`/blog?cat=${category.slug}`}
              className={styles.categoryItem}
              style={{
                backgroundColor: categoryColorVar,
                borderColor: categoryColorVar
              }}
            >
              <FaFolder className={styles.categoryIcon} />
              <span className={styles.categoryName}>{category.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MenuCategories;