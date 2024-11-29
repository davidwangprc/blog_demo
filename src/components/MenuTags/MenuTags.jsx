import Link from 'next/link';
import styles from './menuTags.module.css';
import { FaTags, FaHashtag, FaFire } from 'react-icons/fa';

const getPopularTags = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/tags/popular', {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch tags');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    return [];
  }
};

const MenuTags = async () => {
  const tags = await getPopularTags();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FaTags className={styles.headerIcon} />
        <h2 className={styles.headerTitle}>热门标签</h2>
      </div>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/search?type=posts&tags=${tag.id}`}
            className={styles.tag}
          >
            <FaHashtag className={styles.tagIcon} />
            <span className={styles.tagName}>{tag.name}</span>
            <span className={styles.tagCount}>
              <FaFire className={styles.fireIcon} />
              {tag.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuTags; 