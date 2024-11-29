// 导入 React 核心库，用于创建 React 组件
import React from "react";
import styles from "./cardList.module.css";
import Pagination from "@/components/Pagination/Pagination";
import Card from "@/components/Card/Card";

const getPosts = async (page, cat, itemsPerPage) => {
    const res = await fetch(
        `http://localhost:3000/api/posts?page=${page}${cat ? `&cat=${cat}` : ""}&pageSize=${itemsPerPage}`, 
        {
            cache: "no-store"
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch posts");
    }
    
    return res.json();
};

const getRecipes = async (page, cat, itemsPerPage) => {
    const res = await fetch(
        `http://localhost:3000/api/recipes?page=${page}${cat ? `&cat=${cat}` : ""}&pageSize=${itemsPerPage}`,
        {
            cache: "no-store"
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch recipes");
    }

    return res.json();
};

const CardList = async ({ page, cat, pageSize = 4 }) => {
    const itemsPerPage = pageSize;

    // 如果是在主页面（没有分类）
    if (!cat) {
        // 获取所有内容
        const [postsData, recipesData] = await Promise.all([
            getPosts(page, null, itemsPerPage),
            getRecipes(page, null, itemsPerPage)
        ]);

        // 合并所有文章和食谱
        const allItems = [
            ...(postsData.posts || []),
            ...(recipesData.recipes || [])
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // 计算总页数
        const total = allItems.length;
        const pageCount = Math.ceil(total / itemsPerPage);

        // 计算当前页的起始和结束索引
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const displayItems = allItems.slice(startIndex, endIndex);

        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Latest Content</h1>
                <div className={styles.posts}>
                    {displayItems.map((item) => (
                        <Card 
                            key={`${item.id}-${item.categoryId === 3 ? 'recipe' : 'post'}`} 
                            item={item} 
                        />
                    ))}
                </div>
                {/* <Pagination 
                    page={page} 
                    pageCount={pageCount}
                    baseUrl={cat ? `/blog?cat=${cat}` : '/'}
                /> */}
            </div>
        );
    }

    // 如果是 food 分类，获取食谱
    if (cat === 'food') {
        const recipesData = await getRecipes(page, cat, itemsPerPage);
        const pageCount = Math.ceil(recipesData.total / recipesData.pageSize);

        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Recipe Posts</h1>
                <div className={styles.posts}>
                    {recipesData.recipes?.map((recipe) => (
                        <Card key={recipe.id} item={recipe} />
                    ))}
                </div>
                {/* <Pagination page={page} pageCount={pageCount} /> */}
            </div>
        );
    }

    // 其他分类，获取文章
    const { posts, total, pageSize: returnedPageSize } = await getPosts(page, cat, itemsPerPage);
    const pageCount = Math.ceil(total / returnedPageSize);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                {cat ? `${cat} Posts` : "Latest Posts"}
            </h1>
            <div className={styles.posts}>
                {posts?.map((post) => (
                    <Card key={post.id} item={post} />
                ))}
            </div>
            {/* <Pagination page={page} pageCount={pageCount} /> */}
        </div>
    );
};

export default CardList;

