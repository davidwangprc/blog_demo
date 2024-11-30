"use client";
import { useState, useEffect } from 'react';
import styles from './collection.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import AddBookmark from '../../components/AddBookmark/AddBookmark';

const Collection = () => {
    const [categories, setCategories] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log('Collection 组件渲染:', {
        categoriesCount: categories.length,
        bookmarksCount: bookmarks.length,
        selectedCategory,
        isLoading,
        error
    });

    // 获取分类和书签数据
    useEffect(() => {
        const fetchData = async () => {
            console.log('开始获取数据...');
            try {
                console.log('正在获取书签分类...');
                const categoriesRes = await fetch('/api/bookmark-categories');
                console.log('分类响应状态:', categoriesRes.status);
                
                console.log('正在获取书签...');
                const bookmarksRes = await fetch('/api/bookmarks');
                console.log('书签响应状态:', bookmarksRes.status);

                if (categoriesRes.ok && bookmarksRes.ok) {
                    const categoriesData = await categoriesRes.json();
                    const bookmarksData = await bookmarksRes.json();
                    
                    console.log('获取到的分类数据:', categoriesData);
                    console.log('获取到的书签数据:', bookmarksData);

                    setCategories(categoriesData);
                    setBookmarks(bookmarksData);
                } else {
                    console.error('API响应错误:', {
                        categories: categoriesRes.status,
                        bookmarks: bookmarksRes.status
                    });
                    setError('获取数据失败');
                }
            } catch (error) {
                console.error('数据获取错误:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
                console.log('数据获取完成');
            }
        };

        fetchData();
    }, []);

    // 过滤显示的书签
    const filteredBookmarks = selectedCategory === 'all'
        ? bookmarks
        : bookmarks.filter(bookmark => bookmark.categoryId === parseInt(selectedCategory));

    console.log('过滤后的书签:', filteredBookmarks);

    const handleBookmarkAdded = (newBookmark) => {
        console.log('添加新书签:', newBookmark);
        setBookmarks(prev => [newBookmark, ...prev]);
    };

    if (error) {
        console.log('渲染错误状态:', error);
        return <div className={styles.error}>Error: {error}</div>;
    }

    if (isLoading) {
        console.log('渲染加载状态');
        return <div className={styles.loading}>Loading...</div>;
    }

    console.log('渲染主要内容');
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>web collection</h1>
                <p className={styles.subtitle}>valueable & useful websites</p>
            </div>

            <AddBookmark 
                categories={categories}
                onBookmarkAdded={handleBookmarkAdded}
            />

            <div className={styles.categories}>
                <button
                    className={`${styles.categoryButton} ${selectedCategory === 'all' ? styles.active : ''}`}
                    onClick={() => setSelectedCategory('all')}
                >
                    全部
                </button>
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`${styles.categoryButton} ${selectedCategory === category.id.toString() ? styles.active : ''}`}
                        onClick={() => setSelectedCategory(category.id.toString())}
                        style={{
                            '--category-color': category.color || 'var(--textColor)'
                        }}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className={styles.bookmarks}>
                {filteredBookmarks.map(bookmark => (
                    <div key={bookmark.id} className={styles.bookmarkCard}>
                        <div className={styles.screenshot}>
                            {bookmark.screenshot && (
                                <Image
                                    src={bookmark.screenshot}
                                    alt={bookmark.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className={styles.screenshotImage}
                                />
                            )}
                        </div>
                        <div className={styles.bookmarkInfo}>
                            <div className={styles.bookmarkHeader}>
                                {bookmark.icon && (
                                    <Image
                                        src={bookmark.icon}
                                        alt=""
                                        width={16}
                                        height={16}
                                        className={styles.favicon}
                                    />
                                )}
                                <h3 className={styles.bookmarkTitle}>{bookmark.title}</h3>
                            </div>
                            <p className={styles.bookmarkDescription}>{bookmark.description}</p>
                            <div className={styles.bookmarkFooter}>
                                <Link 
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.visitButton}
                                >
                                    访问网站
                                </Link>
                                {bookmark.tags?.length > 0 && (
                                    <div className={styles.tags}>
                                        {bookmark.tags.map(tag => (
                                            <span key={tag.id} className={styles.tag}>
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Collection;