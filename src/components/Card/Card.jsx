import styles from "./card.module.css";
import Image from "next/image";
import Link from "next/link";

const Card = ({ item }) => {
    if (!item) {
        return null;
    }

    const isRecipe = item?.categoryId === 3;
    const path = isRecipe ? `/recipes/${item.slug}` : `/posts/${item.slug}`;
    const categorySlug = item.category?.slug || 'food';
    const categoryColorVar = `var(--category-${categorySlug}, var(--category-default))`;
    const categoryTextColorVar = `var(--category-${categorySlug}-text, var(--category-default-text))`;
    
    console.log(`Card Item:`, {
        title: item.title,
        categorySlug,
        colorVar: categoryColorVar,
        textColorVar: categoryTextColorVar,
        isRecipe
    });
    
    const getDescription = () => {
        if (isRecipe) {
            const difficultyMap = {
                easy: "简单",
                medium: "中等",
                hard: "困难"
            };
            return `烹饪时间: ${item.cookingTime || 0}分钟 · 难度: ${difficultyMap[item.difficulty] || '未知'} · ${item.servings || 1}人份`;
        }
        return item.description || item.desc || '暂无描述';
    };

    return (
        <div className={styles.container}>
            {item.image && (
                <div className={styles.imageContainer}>
                    <Image 
                        src={item.image.startsWith('http') ? item.image : `/${item.image}`}
                        alt="" 
                        fill 
                        className={styles.image}
                        priority
                    />
                </div>
            )}
            <div className={styles.textContainer}>
                <div className={styles.detail}>
                    <span className={styles.date}>
                        {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                    <span 
                        className={styles.category}
                        style={{
                            backgroundColor: categoryColorVar,
                            borderColor: categoryTextColorVar,
                            color: categoryTextColorVar
                        }}
                    >
                        {isRecipe ? 'FOOD' : item.category?.title}
                    </span>
                </div>
                <Link href={path}>
                    <h1 className={styles.title}>{item.title || '无标题'}</h1>
                </Link>
                <span className={styles.author}>
                    {item.author?.avatar && (
                        <Image
                            src={item.author.avatar}
                            alt={item.author.name || '作者头像'}
                            width={20}
                            height={20}
                            className={styles.avatar}
                        />
                    )}
                    作者: {item.author?.name || '匿名'}
                </span>
                <hr className={styles.line} />
                <p className={styles.desc}>
                    {getDescription()}
                </p>
                <Link href={path} className={styles.link}>
                    阅读更多
                </Link>
            </div>
        </div>
    );
};

export default Card;
