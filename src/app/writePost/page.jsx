"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./writePost.module.css";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaUpload, FaLink, FaImage, FaTimes } from 'react-icons/fa';

// 动态导入 ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
});

// 导入 ReactQuill 的样式
import 'react-quill/dist/quill.bubble.css';

// 定义 WritePage 组件
const WritePage = () => {
    const [value, setValue] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [uploading, setUploading] = useState(false);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [newlyCreatedTags, setNewlyCreatedTags] = useState([]);
    const [searchTag, setSearchTag] = useState("");
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();
    const [imageType, setImageType] = useState("upload"); // "upload" 或 "url"
    const [imageUrl, setImageUrl] = useState("");
    const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 }); // 默认居中
    const [previewSize, setPreviewSize] = useState({ width: 200, height: 100 });
    const [isEditingSize, setIsEditingSize] = useState(false);

    // 获取分类列表
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // 获取所有已存在的tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch("/api/tags", {
                    method: "GET",
                    cache: 'no-store',
                });
                if (response.ok) {
                    const data = await response.json();
                    setTags(data);
                }
            } catch (error) {
                console.error("Failed to fetch tags:", error);
            }
        };
        fetchTags();
    }, []);

    // 修改图片处理函数
    const handleImageUpload = async (e) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", e.target.files[0]);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = await res.json();
            if (data.filePath) {
                setImage(data.filePath);
                // 清空URL输入框
                setImageUrl("");
            } else {
                throw new Error("No file path returned");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("图片上传失败：" + error.message);
        } finally {
            setUploading(false);
        }
    };

    // 处理URL输入
    const handleImageUrlSubmit = () => {
        if (!imageUrl.trim()) return;

        // 验证URL格式
        try {
            new URL(imageUrl);
        } catch (e) {
            alert("请输入有效的图片URL");
            return;
        }

        // 验证是否是图片URL
        const isImageUrl = imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
        if (!isImageUrl) {
            alert("请输入有效的图片URL（支持jpg、jpeg、png、gif、webp格式）");
            return;
        }

        // 验证是否来自允许的域名
        const allowedDomains = [
            'image.civitai.com',
            'images.unsplash.com',
            'i.imgur.com',
            'picsum.photos',
            'via.placeholder.com'
        ];

        const urlObject = new URL(imageUrl);
        if (!allowedDomains.includes(urlObject.hostname)) {
            alert(`不支持的图片域名。支持的域名包括：\n${allowedDomains.join('\n')}`);
            return;
        }

        setImage(imageUrl);
    };

    // 处理选择tag
    const handleTagSelect = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    // 处理创建新tag
    const handleCreateTag = async () => {
        if (!searchTag.trim()) return;
        
        try {
            const response = await fetch("/api/tags", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: searchTag }),
            });

            const data = await response.json();

            if (response.ok) {
                // 更新标签列表
                setTags(prevTags => [...prevTags, data]);
                // 自动选择新创建的标签
                setSelectedTags(prevSelected => [...prevSelected, data]);
                // 清空搜索框
                setSearchTag("");
                // 关闭下拉框
                setIsTagDropdownOpen(false);
                // 显示成功消息
                alert(`标签 "${data.name}" 创建成功！`);
            } else {
                // 显示错误消息
                alert(data.message || "创建标签失败");
            }
        } catch (error) {
            console.error("Failed to create tag:", error);
            alert("创建标签失败：" + (error.message || "未知错误"));
        }
    };

    // 添加移除新创建标签的处理函数
    const handleRemoveNewTag = (tagToRemove) => {
        setNewlyCreatedTags(newlyCreatedTags.filter(tag => tag.id !== tagToRemove.id));
        setSelectedTags(selectedTags.filter(tag => tag.id !== tagToRemove.id));
        setTags(tags.filter(tag => tag.id !== tagToRemove.id));
    };

    // 发布文章
    const handlePublish = async () => {
        if (!title || !value || !description || !selectedCategory) {
            alert("请填写所有必填字段");
            return;
        }

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content: value,
                    description,
                    image,
                    categoryId: parseInt(selectedCategory),
                    tags: selectedTags.map(tag => tag.id) // 添加选中的标签ID
                }),
                credentials: "include"
            });

            console.log("发布响应:", await res.clone().json());

            if (res.ok) {
                alert("发布成功！");
                router.push("/");
            } else {
                const data = await res.json();
                console.error("发布失败:", data);
                alert(data.message);
            }
        } catch (error) {
            console.error("Failed to publish:", error);
            alert("发布失败");
        }
    };

    // 添加点击外部关闭下拉框的效果
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsTagDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 过滤标签的函数
    const filteredTags = tags.filter(tag => 
        tag.name.toLowerCase().includes(searchTag.toLowerCase()) &&
        !selectedTags.includes(tag)
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>创建新文章</h1>
                <p className={styles.subtitle}>分享你的想法和经验</p>
            </div>

            <div className={styles.formSection}>
                <div className={styles.mainInfo}>
                    <input 
                        type="text" 
                        placeholder="文章标题" 
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        placeholder="文章简介"
                        className={styles.description}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />

                    <div className={styles.categorySection}>
                        <h2 className={styles.sectionTitle}>选择分类</h2>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">选择分类...</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.tagsSection}>
                        {selectedTags.length > 0 && (
                            <div className={styles.selectedTags}>
                                {selectedTags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className={styles.tag}
                                        onClick={() => handleTagSelect(tag)}
                                    >
                                        {tag.name}
                                        <span className={styles.removeTag}>×</span>
                                    </span>
                                ))}
                            </div>
                        )}
                        <h2 className={styles.sectionTitle}>添加标签</h2>
                        <div className={styles.tagSearch}>
                            <input
                                type="text"
                                placeholder="搜索或创建标签..."
                                value={searchTag}
                                onChange={(e) => setSearchTag(e.target.value)}
                                onFocus={() => setIsTagDropdownOpen(true)}
                                className={styles.tagInput}
                            />
                            {isTagDropdownOpen && (
                                <div className={styles.tagDropdown} ref={dropdownRef}>
                                    {filteredTags.map((tag) => (
                                        <div
                                            key={tag.id}
                                            className={styles.tagOption}
                                            onClick={() => handleTagSelect(tag)}
                                        >
                                            {tag.name}
                                        </div>
                                    ))}
                                    {searchTag && !tags.find(tag => 
                                        tag.name.toLowerCase() === searchTag.toLowerCase()
                                    ) && (
                                        <div
                                            className={styles.createTag}
                                            onClick={() => handleCreateTag(searchTag)}
                                        >
                                            创建标签: {searchTag}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.imageSection}>
                    <h2 className={styles.sectionTitle}>封面图片</h2>
                    <div className={styles.imageUpload}>
                        <div className={styles.imageTypeSwitch}>
                            <button
                                className={`${styles.switchBtn} ${imageType === "upload" ? styles.active : ""}`}
                                onClick={() => setImageType("upload")}
                            >
                                <FaUpload className={styles.btnIcon} />
                                <span>本地上传</span>
                            </button>
                            <button
                                className={`${styles.switchBtn} ${imageType === "url" ? styles.active : ""}`}
                                onClick={() => setImageType("url")}
                            >
                                <FaLink className={styles.btnIcon} />
                                <span>URL链接</span>
                            </button>
                        </div>

                        {imageType === "upload" ? (
                            <>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="image" className={`${styles.uploadButton} ${uploading ? styles.uploading : ''}`}>
                                    {uploading ? (
                                        <span>上传中...请稍候</span>
                                    ) : (
                                        <>
                                            <FaImage className={styles.uploadIcon} />
                                            <span>点击上传封面图片</span>
                                        </>
                                    )}
                                </label>
                            </>
                        ) : (
                            <div className={styles.urlInput}>
                                <div className={styles.urlInputWrapper}>
                                    <FaLink className={styles.urlIcon} />
                                    <input
                                        type="text"
                                        placeholder="输入图片URL (支持jpg、jpeg、png、gif、webp)"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className={styles.urlField}
                                    />
                                </div>
                                <button 
                                    onClick={handleImageUrlSubmit}
                                    className={styles.urlSubmit}
                                    disabled={!imageUrl.trim()}
                                >
                                    <FaUpload className={styles.submitIcon} />
                                    <span>确认</span>
                                </button>
                            </div>
                        )}

                        {image && (
                            <div className={styles.imagePreview}>
                                <div className={styles.previewControls}>
                                    <div className={styles.positionControl}>
                                        <label>图片位置:</label>
                                        <div className={styles.sliderGroup}>
                                            <div className={styles.sliderContainer}>
                                                <span>X轴: {imagePosition.x}%</span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={imagePosition.x}
                                                    onChange={(e) => setImagePosition(prev => ({
                                                        ...prev,
                                                        x: parseInt(e.target.value)
                                                    }))}
                                                    className={styles.slider}
                                                />
                                            </div>
                                            <div className={styles.sliderContainer}>
                                                <span>Y轴: {imagePosition.y}%</span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={imagePosition.y}
                                                    onChange={(e) => setImagePosition(prev => ({
                                                        ...prev,
                                                        y: parseInt(e.target.value)
                                                    }))}
                                                    className={styles.slider}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.sizeControl}>
                                        <label>预览尺寸:</label>
                                        {isEditingSize ? (
                                            <div className={styles.sizeInputs}>
                                                <input
                                                    type="number"
                                                    value={previewSize.width}
                                                    onChange={(e) => setPreviewSize(prev => ({
                                                        ...prev,
                                                        width: parseInt(e.target.value) || 0
                                                    }))}
                                                    min="50"
                                                    max="800"
                                                    placeholder="宽度"
                                                />
                                                <span>x</span>
                                                <input
                                                    type="number"
                                                    value={previewSize.height}
                                                    onChange={(e) => setPreviewSize(prev => ({
                                                        ...prev,
                                                        height: parseInt(e.target.value) || 0
                                                    }))}
                                                    min="50"
                                                    max="800"
                                                    placeholder="高度"
                                                />
                                                <button 
                                                    onClick={() => setIsEditingSize(false)}
                                                    className={styles.confirmSize}
                                                >
                                                    确认
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setIsEditingSize(true)}
                                                className={styles.editSize}
                                            >
                                                {previewSize.width} x {previewSize.height}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div 
                                    className={styles.imageContainer}
                                    style={{
                                        width: previewSize.width,
                                        height: previewSize.height
                                    }}
                                >
                                    <Image
                                        src={image.startsWith('http') ? image : `/${image}`}
                                        alt="预览"
                                        fill
                                        style={{
                                            objectFit: 'cover',
                                            objectPosition: `${imagePosition.x}% ${imagePosition.y}%`
                                        }}
                                        priority
                                    />
                                </div>
                                <button 
                                    className={styles.removeImage}
                                    onClick={() => {
                                        setImage("");
                                        setImageUrl("");
                                        setImagePosition({ x: 50, y: 50 });
                                        setPreviewSize({ width: 200, height: 100 });
                                    }}
                                >
                                    <FaTimes className={styles.removeIcon} />
                                    <span>移除图片</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.editorSection}>
                    <h2 className={styles.sectionTitle}>文章内容</h2>
                    <div className={styles.editor}>
                        <ReactQuill
                            className={styles.quillEditor}
                            theme="bubble"
                            value={value}
                            onChange={setValue}
                            placeholder="开始写作..."
                            modules={{
                                toolbar: {
                                    container: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        ['link', 'image'],
                                        ['clean']
                                    ]
                                }
                            }}
                        />
                    </div>
                </div>

                <button 
                    className={styles.publishButton} 
                    onClick={handlePublish}
                    disabled={!title || !value || !description || !selectedCategory}
                >
                    发布文章
                </button>
            </div>
        </div>
    );
};

export default WritePage;
