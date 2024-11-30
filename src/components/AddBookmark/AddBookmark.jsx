"use client";
import { useState } from 'react';
import styles from './addBookmark.module.css';
import { FaPlus, FaTimes, FaImage, FaLink, FaCheck } from 'react-icons/fa';
import { compressImage } from '@/utils/imageUtils';

const AddBookmark = ({ categories, onBookmarkAdded }) => {
    console.log('AddBookmark 组件渲染:', { categoriesCount: categories?.length });

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        description: '',
        icon: '',
        screenshot: '',
        categoryId: '',
        tags: []
    });
    const [newTag, setNewTag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [imageInputType, setImageInputType] = useState('url');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('提交表单数据:', formData);
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/bookmarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('添加书签失败');
            }

            const newBookmark = await response.json();
            onBookmarkAdded(newBookmark);
            setFormData({
                title: '',
                url: '',
                description: '',
                icon: '',
                screenshot: '',
                categoryId: '',
                tags: []
            });
            setIsOpen(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleUrlChange = (e) => {
        const newUrl = e.target.value;
        setFormData(prev => ({
            ...prev,
            url: newUrl
        }));
    };

    const handlePaste = async (e) => {
        const items = e.clipboardData?.items;
        const imageItem = Array.from(items).find(item => item.type.indexOf('image') !== -1);
        
        if (imageItem) {
            const file = imageItem.getAsFile();
            if (file.size > 5 * 1024 * 1024) {
                setError('图片大小不能超过 5MB');
                return;
            }
            try {
                const compressedImage = await compressImage(file, {
                    maxWidth: 800,
                    maxHeight: 600,
                    quality: 0.8
                });
                setFormData(prev => ({
                    ...prev,
                    screenshot: compressedImage
                }));
                setError({ type: 'success', message: '图片已成功粘贴' });
                setTimeout(() => setError(null), 3000);
            } catch (error) {
                setError('图片处理失败：' + error.message);
            }
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('图片大小不能超过 5MB');
                return;
            }
            try {
                const compressedImage = await compressImage(file, {
                    maxWidth: 800,
                    maxHeight: 600,
                    quality: 0.8
                });
                setFormData(prev => ({
                    ...prev,
                    screenshot: compressedImage
                }));
                setError({ type: 'success', message: '图片已成功上传' });
                setTimeout(() => setError(null), 3000);
            } catch (error) {
                setError('图片处理失败：' + error.message);
            }
        }
    };

    return (
        <div className={styles.container}>
            <button 
                className={styles.addButton}
                onClick={() => setIsOpen(true)}
            >
                <FaPlus /> 添加收藏
            </button>

            {isOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button 
                            className={styles.closeButton}
                            onClick={() => setIsOpen(false)}
                        >
                            <FaTimes />
                        </button>

                        <h2 className={styles.modalTitle}>添加网站收藏</h2>

                        {error && (
                            <div className={`${styles.message} ${error.type === 'success' ? styles.success : styles.error}`}>
                                {error.type === 'success' ? <FaCheck /> : <FaTimes />}
                                {error.message || error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="title">网站名称 *</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        title: e.target.value
                                    }))}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="url">网站地址 *</label>
                                <div className={styles.urlInput}>
                                    <input
                                        type="url"
                                        id="url"
                                        value={formData.url}
                                        onChange={handleUrlChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="description">描述</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    }))}
                                />
                            </div>

                            <div className={styles.previewSection}>
                                {formData.icon && (
                                    <div className={styles.iconPreview}>
                                        <img src={formData.icon} alt="网站图标" />
                                    </div>
                                )}
                                {formData.screenshot && (
                                    <div className={styles.screenshotPreview}>
                                        <img src={formData.screenshot} alt="网站截图" />
                                    </div>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="category">分类 *</label>
                                <select
                                    id="category"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        categoryId: e.target.value
                                    }))}
                                    required
                                >
                                    <option value="">选择分类</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>标签</label>
                                <div className={styles.tagInput}>
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTag();
                                            }
                                        }}
                                        placeholder="输入标签后按回车添加"
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleAddTag}
                                        className={styles.addTagButton}
                                    >
                                        添加
                                    </button>
                                </div>
                                <div className={styles.tags}>
                                    {formData.tags.map(tag => (
                                        <span key={tag} className={styles.tag}>
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className={styles.removeTag}
                                            >
                                                <FaTimes />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>网站截图</label>
                                <div className={styles.imageInputControls}>
                                    <button
                                        type="button"
                                        className={`${styles.imageTypeButton} ${imageInputType === 'url' ? styles.active : ''}`}
                                        onClick={() => setImageInputType('url')}
                                    >
                                        <FaLink /> URL
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles.imageTypeButton} ${imageInputType === 'upload' ? styles.active : ''}`}
                                        onClick={() => setImageInputType('upload')}
                                    >
                                        <FaImage /> 上传
                                    </button>
                                </div>
                                {imageInputType === 'url' ? (
                                    <input
                                        type="url"
                                        placeholder="输入图片URL"
                                        value={formData.screenshot}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            screenshot: e.target.value
                                        }))}
                                        onPaste={handlePaste}
                                    />
                                ) : (
                                    <div className={styles.uploadArea}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            id="screenshot-upload"
                                            className={styles.fileInput}
                                            onPaste={handlePaste}
                                        />
                                        <label htmlFor="screenshot-upload" className={styles.uploadLabel}>
                                            <FaImage />
                                            <span>点击上传图片</span>
                                            <span className={styles.pasteHint}>
                                                或直接 <kbd>Ctrl</kbd> + <kbd>V</kbd> 粘贴图片
                                            </span>
                                        </label>
                                    </div>
                                )}
                                {formData.screenshot && (
                                    <div className={styles.imagePreview}>
                                        <img src={formData.screenshot} alt="预览" />
                                        <button
                                            type="button"
                                            className={styles.removeImage}
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                screenshot: ''
                                            }))}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '添加中...' : '添加书签'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddBookmark;