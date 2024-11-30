import React from "react";
import styles from "./singleRecipePage.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";
import EditButton from "@/components/EditButton/EditButton";

// 获取单个菜谱的函数
async function getData(slug) {
    
  try {
      if (!slug || slug === '[slug]') {
          console.log("Invalid slug:", slug);
          return null;
        }
      
        const url = `http://localhost:3000/api/recipes/${slug}`;
        console.log("Fetching from URL:", url);
      
        const res = await fetch(url, {
            cache: "no-store",
            headers: {
                'Accept': 'application/json',
              },
            });
          
            if (!res.ok) {
                const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to fetch recipe: ${res.status} ${res.statusText}`);
    }
  
    const data = await res.json();
    console.log("Recipe data received:", data);
    return data;
  } catch (error) {
      console.error("Error loading recipe:", error);
      throw error; // 让错误继续传播
    }
  }

export default async function SingleRecipePage({ params }) {
  const { slug } = params;
  console.log("Recipe page params:", params);

  try {
    const recipe = await getData(slug);
    
    if (!recipe) {
      console.log("No recipe found, returning 404");
      return notFound();
    }

    // 难度映射
    const difficultyMap = {
      easy: "简单",
      medium: "中等",
      hard: "困难"
    };

    return (
      <div className={styles.container}>
        <div className={styles.infoContainer}>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>{recipe.title}</h1>
            {recipe.description && (
              <p className={styles.description}>{recipe.description}</p>
            )}
            <div className={styles.editButtonContainer}>
              <EditButton id={recipe.id} slug={recipe.slug} isRecipe={true} />
            </div>
            <div className={styles.user}>
              {recipe.author?.avatar && (
                <div className={styles.userImageContainer}>
                  <Image
                    src={recipe.author.avatar}
                    alt=""
                    fill
                    className={styles.avatar}
                  />
                </div>
              )}
              <div className={styles.userTextContainer}>
                <span className={styles.username}>{recipe.author?.name}</span>
                <span className={styles.date}>
                  {new Date(recipe.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
          {recipe.image && (
            <div className={styles.imageContainer}>
              <Image
                src={`/${recipe.image}`}
                alt=""
                fill
                className={styles.image}
              />
            </div>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.recipeDetails}>
            {recipe.cookingTime && (
              <div className={styles.detail}>
                <span>烹饪时间：</span>
                <span>{recipe.cookingTime} 分钟</span>
              </div>
            )}
            {recipe.servings && (
              <div className={styles.detail}>
                <span>份量：</span>
                <span>{recipe.servings} 人份</span>
              </div>
            )}
            {recipe.difficulty && (
              <div className={styles.detail}>
                <span>难度：</span>
                <span>{difficultyMap[recipe.difficulty] || recipe.difficulty}</span>
              </div>
            )}
          </div>
          
          <div className={styles.section}>
            <h2>食材</h2>
            <div className={styles.ingredients}>
              {recipe.ingredients?.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className={styles.ingredient}>
                    <span className={styles.ingredientName}>{ingredient.name}</span>
                    <span className={styles.ingredientAmount}>
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </div>
                ))
              ) : (
                <p>暂无食材信息</p>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h2>步骤</h2>
            <div className={styles.steps}>
              {recipe.steps.split('\n').map((step, index) => (
                <div key={index} className={styles.step}>
                  <span className={styles.stepNumber}>{index + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading recipe:", error);
    return notFound();
  }
} 