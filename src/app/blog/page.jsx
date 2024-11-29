'use client'
import { useState } from "react";
import CardList from "@/components/CardList/CardList";
import styles from "./blogPage.module.css";
import Menu from "@/components/Menu/Menu";

const BlogPage = ({ searchParams }) => {
  const page = parseInt(searchParams.page) || 1;
  const { cat } = searchParams;
  const [pageSize, setPageSize] = useState(5);

  const pageSizeOptions = [5, 10, 20, 50];

  const getTitle = () => {
    if (cat === 'food') return 'Food Recipe';
    if (cat) return `${cat} Blog`;
    return 'All Posts';
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1 className={styles.titleText}>
          {getTitle()}
        </h1>
      </div>
      <div className={styles.pageSizeSelector}>
        <span>Articles per page:</span>
        <select 
          value={pageSize} 
          onChange={(e) => setPageSize(Number(e.target.value))}
          className={styles.select}
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size} articles
            </option>
          ))}
        </select>
      </div>
      <div className={styles.content}>
        {/* @ts-expect-error Async Server Component */}
        <CardList page={page} cat={cat} pageSize={pageSize} />
        <Menu />
      </div>
    </div>
  );
};

export default BlogPage;
