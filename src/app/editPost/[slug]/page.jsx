"use client";
import { useState, useEffect, useRef } from "react";
import styles from "../../writePost/writePost.module.css";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaUpload, FaLink, FaTimes, FaImage } from 'react-icons/fa';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>加载编辑器中...</p>
});

import 'react-quill/dist/quill.bubble.css';

const EditPage = ({ params }) => {
    const { slug } = params;
    const [post, setPost] = useState(null);
    const [value, setValue] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [uploading, setUploading] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tags, setTags] = useState([]);
    const [searchTag, setSearchTag] = useState("");
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();
    const [imageType, setImageType] = useState("upload");
    const [imageUrl, setImageUrl] = useState("");
    const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
    const [previewSize, setPreviewSize] = useState({ width: 200, height: 100 });
    const [isEditingSize, setIsEditingSize] = useState(false);

    // 获取所有标签
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch("/api/tags");
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

    // 处理标签选择
    const handleTagSelect = (tag) => {
        if (selectedTags.find(t => t.id === tag.id)) {
            setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
        setSearchTag("");
        setIsTagDropdownOpen(false);
    };

    // 处理创建新标签
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
                setTags(prevTags => [...prevTags, data]);
                setSelectedTags(prevSelected => [...prevSelected, data]);
                setSearchTag("");
                setIsTagDropdownOpen(false);
                alert(`标签 "${data.name}" 创建成功！`);
            } else {
                alert(data.message || "创建标签失败");
            }
        } catch (error) {
            console.error("Failed to create tag:", error);
            alert("创建标签失败：" + (error.message || "未知错误"));
        }
    };

    // 过滤标签
    const filteredTags = tags.filter(tag => 
        tag.name.toLowerCase().includes(searchTag.toLowerCase()) &&
        !selectedTags.find(t => t.id === tag.id)
    );

    // 获取文章数据
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${slug}`);
                const data = await res.json();
                
                setPost(data);
                setTitle(data.title);
                setValue(data.content);
                setDescription(data.description);
                setImage(data.image);
                setSelectedCategory(data.categoryId.toString());
                setSelectedTags(data.tags || []);
            } catch (error) {
                console.error("Failed to fetch post:", error);
                router.push("/404");
            }
        };

        fetchPost();
    }, [slug, router]);

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
            setImage(data.filePath);
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setUploading(false);
        }
    };

    // 处理URL输入
    const handleImageUrlSubmit = () => {
        if (!imageUrl.trim()) return;

        try {
            new URL(imageUrl);
        } catch (e) {
            alert("请输入有效的图片URL");
            return;
        }

        const isImageUrl = imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
        if (!isImageUrl) {
            alert("请输入有效的图片URL（支持jpg、jpeg、png、gif、webp格式）");
            return;
        }

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

    // 更新文章
    const handleUpdate = async () => {
        if (!title || !value || !description || !selectedCategory) {
            alert('请填写所有必填字段');
            return;
        }

        try {
            const res = await fetch(`/api/posts/${slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content: value,
                    description,
                    image,
                    categoryId: parseInt(selectedCategory),
                    tags: selectedTags.map(tag => tag.id)
                }),
                credentials: "include"
            });

            if (res.ok) {
                router.push(`/posts/${slug}`);
            } else {
                const data = await res.json();
                alert(data.message);
            }
        } catch (error) {
            console.error("Failed to update:", error);
            alert("更新失败");
        }
    };

    if (!post) {
        return <div className={styles.loading}>加载中...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>编辑文章</h1>
                <p className={styles.subtitle}>修改你的创作</p>
            </div>

            <div className={styles.formSection}>
                <div className={styles.mainInfo}>
                    <input 
                        type="text" 
                        placeholder="标题" 
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    
                    <textarea
                        placeholder="文章描述（简介）"
                        className={styles.description}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                                        onClick={() => {
                                            setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
                                        }}
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
                                            <span>更换封面图片</span>
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
                    onClick={handleUpdate}
                    disabled={!title || !value || !description || !selectedCategory}
                >
                    更新文章
                </button>
            </div>
        </div>
    );
};

export default EditPage; 