"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './editButton.module.css';

// 编辑按钮
const EditButton = ({ id, slug, isRecipe }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error('Failed to check admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  const handleEdit = () => {
    router.push(isRecipe ? `/editRecipe/${slug}` : `/editPost/${slug}`);
  };

  if (!isAdmin) return null;

  return (
    <button className={styles.editButton} onClick={handleEdit}>
      {isRecipe ? '编辑菜谱' : '编辑文章'}
    </button>
  );
};

export default EditButton; 