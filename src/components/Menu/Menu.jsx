// 导入 React 核心库，用于创建 React 组件
import React from "react";
import styles from "./menu.module.css";
import MenuPosts from "../MenuPost/MenuPost";
import MenuCategories from "../MenuCategories/MenuCategories";
import MenuTags from "../MenuTags/MenuTags";
const Menu = () => {
    return (
      <div className={styles.container}>
        <h2 className={styles.subtitle}>{"recent content"}</h2>
        <h1 className={styles.title}></h1>
        {/* @ts-expect-error Async Server Component */}
        <MenuPosts withImage={false} />
        <h2 className={styles.subtitle}>Discover by category</h2>
        <h1 className={styles.title}></h1>
        <MenuCategories />
        <h2 className={styles.subtitle}>Chosen by your favorite</h2>
        <h1 className={styles.title}></h1>
        <MenuTags />
      </div>
    );
  };
  
  export default Menu;
