// 导入 React 核心库，用于创建 React 组件
import React from "react";
import Image from "next/image";
import styles from "./featuredContent.module.css";
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Link from "next/link";

const FeaturedContent = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.textContainer}>
                    <h1 className={styles.title}>
                        <span className={styles.greeting}>Hey, I'm</span>
                        <span className={styles.name}>DavidWang</span>
                        <span className={styles.role}>Full Stack Developer & Food Lover</span>
                    </h1>
                    <p className={styles.description}>
                        热爱编瞎话，热爱拉粑粑。在这里，我分享技术心得与美食探索。 让我们一起在代码的世界和美食的天堂中探索无限可能。
                        在这段旅程中，我们不仅能学到新的技术，还能发现新的美味，甚至还能编出更多有趣的瞎话，增添生活的乐趣。
                    </p>
                    <div className={styles.social}>
                        <Link href="https://github.com" className={styles.socialLink}>
                            <FaGithub />
                            <span>GitHub</span>
                        </Link>
                        <Link href="https://linkedin.com" className={styles.socialLink}>
                            <FaLinkedin />
                            <span>LinkedIn</span>
                        </Link>
                        <Link href="https://twitter.com" className={styles.socialLink}>
                            <FaTwitter />
                            <span>Twitter</span>
                        </Link>
                    </div>
                </div>
                <div className={styles.imageWrapper}>
                    <div className={styles.imageContainer}>
                        <Image
                            src="/cover_01.jpeg"
                            alt="Featured"
                            fill
                            className={styles.image}
                            priority
                        />
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>0+</span>
                            <span className={styles.statLabel}>文章</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>0+</span>
                            <span className={styles.statLabel}>菜谱</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>0+</span>
                            <span className={styles.statLabel}>关注</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.latestPost}>
                <div className={styles.postImageContainer}>
                    <Image src="/cover_01.jpeg" alt="Latest post" fill className={styles.postImage} />
                    <div className={styles.postOverlay} />
                </div>
                <div className={styles.postContent}>
                    <span className={styles.postLabel}>Featured Post</span>
                    <h2 className={styles.postTitle}>探索全栈开发的无限可能</h2>
                    <p className={styles.postDesc}>
                        从前端到后端，从设计到部署，让我们一起探索全栈开发的精彩世界。

                    </p>
                    <Link href="/about" className={styles.readMore}>
                        <button className={styles.readMore}>
                            阅读更多
                            <span className={styles.arrow}>→</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedContent;

