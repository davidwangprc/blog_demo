import React from "react";
import styles from "./categoriesList.module.css";
import Link from "next/link";
import Image from "next/image";

const getCategories = async () => {
    const res = await fetch("http://localhost:3000/api/categories", {
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    return res.json();
};

const CategoriesList = async () => {
    const categories = await getCategories();
    
    // 调试日志
    console.log("Categories loaded:", categories);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Categories</h1>
            <div className={styles.categories}>
                {categories.map((category) => {
                    // 为每个分类生成的样式变量名
                    const categoryColorVar = `var(--category-${category.slug})`;
                    
                    // 调试日志
                    console.log(`Category ${category.title}:`, {
                        slug: category.slug,
                        colorVar: categoryColorVar
                    });

                    return (
                        <Link
                            key={category.id}
                            href={`/blog?cat=${category.slug}&page=1`}
                            className={`${styles.categoryItem} ${styles.category}`}
                            style={{
                                backgroundColor: categoryColorVar
                            }}
                        >
                            {category.image && (
                                <Image
                                    src={`/${category.image}`}
                                    alt={category.title}
                                    width={30}
                                    height={30}
                                    className={styles.image}
                                />
                            )}
                            <span className={styles.categoryText}>{category.title}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoriesList;