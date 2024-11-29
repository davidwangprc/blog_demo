import React from "react";
import styles from "./homepage.module.css";
import "./globals.css";
import FeaturedContent from "@/components/FeaturedContent/FeaturedContent";
import CardList from "@/components/CardList/CardList";
import Menu from "@/components/Menu/Menu";
import ThemeDisplay from "@/components/ThemeDisplay/ThemeDisplay";
import CategoriesList from "@/components/CategoriesList/CategoriesList";

export default function Home({searchParams}) {
  const page = parseInt(searchParams.page) || 1;

  return (
    <div className={styles.container}>
      <FeaturedContent />
      <CategoriesList />
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <CardList page={page} pageSize={4} />
        </div>
        <Menu />
      </div>
      <ThemeDisplay />
    </div>
  );
}

