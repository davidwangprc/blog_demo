"use client";

import Menu from "@/components/Menu/Menu";
import styles from "./singlePostPage.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";
import EditButton from "@/components/EditButton/EditButton";
import MarkdownContent from '@/components/MarkdownContent/MarkdownContent';

// 获取单篇文章的函数
async function getPost(slug) {
  try {
    const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return notFound();
    }

    const post = await res.json();
    return post;
  } catch (error) {
    console.error("获取文章失败:", error);
    return notFound();
  }
}

const SinglePage = async ({ params }) => {
  const { slug } = params;
  const post = await getPost(slug);

  // 格式化日期函数
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.user}>
            {post.author?.avatar && (
              <div className={styles.userImageContainer}>
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className={styles.avatar}
                />
              </div>
            )}
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{post.author?.name}</span>
              <span className={styles.date}>
                发布于: {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
          <div className={styles.meta}>
            {post.category && (
              <span className={`${styles.categoryItem} ${styles[post.category.slug]}`}>
                {post.category.title}
              </span>
            )}
            {post.tags && post.tags.length > 0 ? (
              <div className={styles.tags}>
                <span className={styles.tagsLabel}>标签:</span>
                <div className={styles.tagsList}>
                  {post.tags.map((tag) => {
                    console.log("渲染标签:", tag);
                    return (
                      <span key={tag.id} className={styles.tag}>
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className={styles.tags}>暂无标签</div>
            )}
            <EditButton postId={post.id} slug={post.slug} />
          </div>
        </div>
        {post.image && (
          <div className={styles.imageContainer}>
            <Image
              src={post.image.startsWith('http') ? post.image : `/${post.image}`}
              alt={post.title}
              fill
              className={styles.image}
              priority
            />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <MarkdownContent content={post.content} />
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <div className={styles.updateInfo}>
              最后更新于: {formatDate(post.updatedAt)}
            </div>
          )}
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default SinglePage;
