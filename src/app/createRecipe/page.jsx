'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './createRecipe.module.css'
import { FaUpload, FaLink, FaImage, FaTimes } from 'react-icons/fa';

export default function NewRecipe() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState([
    { name: '', amount: '', unit: '' }
  ])
  const [steps, setSteps] = useState('')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [cookingTime, setCookingTime] = useState('')
  const [servings, setServings] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [imageType, setImageType] = useState("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [previewSize, setPreviewSize] = useState({ width: 200, height: 100 });
  const [isEditingSize, setIsEditingSize] = useState(false);

  // 处理食材的添加、删除���更新
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }])
  }

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index)
      setIngredients(newIngredients)
    }
  }

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

    // 验证URL格式
    try {
      new URL(imageUrl);
    } catch (e) {
      alert("请输入有���的图片URL");
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

  // 提交菜谱
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 验证所有食材都填写完整
    const isIngredientsValid = ingredients.every(ing => 
      ing.name.trim() && ing.amount && ing.unit.trim()
    )
    
    if (!title || !description || !isIngredientsValid || !steps) {
      alert('请填写所有必填字段')
      return
    }

    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          ingredients: ingredients.map(ing => ({
            ...ing,
            amount: parseFloat(ing.amount)
          })),
          steps,
          image,
          categoryId: 3,
          cookingTime: parseInt(cookingTime) || null,
          servings: parseInt(servings) || null,
          difficulty,
        }),
        credentials: 'include'
      })

      if (res.ok) {
        const recipe = await res.json()
        alert("发布成功！")
        router.push(`/recipes/${recipe.slug}`)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Failed to create recipe:', error)
      alert('创建菜谱失败: ' + error.message)
    }
  }

  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <h1 className={styles.title}>创建新菜谱</h1>
            <p className={styles.subtitle}>分享你的美食配方</p>
        </div>

        <div className={styles.formSection}>
            <div className={styles.mainInfo}>
                <input 
                    type="text" 
                    placeholder="菜品名称" 
                    className={styles.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                
                <textarea 
                    placeholder="菜品简介" 
                    className={styles.input}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />

                <div className={styles.recipeDetails}>
                    <div className={styles.detailItem}>
                        <span>烹饪时间</span>
                        <input
                            type="number"
                            placeholder="分钟"
                            value={cookingTime}
                            onChange={(e) => setCookingTime(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.detailItem}>
                        <span>份量</span>
                        <input
                            type="number"
                            placeholder="人份"
                            value={servings}
                            onChange={(e) => setServings(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.detailItem}>
                        <span>难度</span>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className={styles.select}
                        >
                            <option value="easy">简单</option>
                            <option value="medium">中等</option>
                            <option value="hard">困难</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.ingredientsSection}>
                <h2 className={styles.sectionTitle}>食材清单</h2>
                <div className={styles.ingredientsList}>
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className={styles.ingredientItem}>
                            <input
                                type="text"
                                placeholder="食材名称"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                className={styles.ingredientInput}
                            />
                            <input
                                type="number"
                                placeholder="数量"
                                value={ingredient.amount}
                                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                className={styles.ingredientInput}
                            />
                            <input
                                type="text"
                                placeholder="单位"
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                className={styles.ingredientInput}
                            />
                            <button 
                                type="button" 
                                onClick={() => removeIngredient(index)}
                                className={styles.removeIngredient}
                                disabled={ingredients.length === 1}
                            >
                                <span>×</span>
                            </button>
                        </div>
                    ))}
                    <button 
                        type="button" 
                        onClick={addIngredient}
                        className={styles.addIngredient}
                    >
                        + 添加食材
                    </button>
                </div>
            </div>

            <div className={styles.imageSection}>
                <h2 className={styles.sectionTitle}>菜品图片</h2>
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
                                        <span>上传菜品图片</span>
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

            <div className={styles.stepsSection}>
                <h2 className={styles.sectionTitle}>烹饪步骤</h2>
                <textarea
                    placeholder="请输入详细的烹饪步骤（每行一步）
例如：
1. 将鸡肉切成小块...
2. 热油锅，放入葱姜..."
                    className={styles.stepsInput}
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    rows={8}
                />
            </div>

            <button 
                className={styles.publishButton} 
                onClick={handleSubmit}
                disabled={!title || !ingredients.length || !steps}
            >
                发布菜谱
            </button>
        </div>
    </div>
  )
}