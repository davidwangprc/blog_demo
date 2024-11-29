'use client'

import { useState, useEffect } from 'react'
import styles from './search.module.css'
import Card from '@/components/Card/Card'

export default function SearchPage({ searchParams }) {
  // 搜索类型（文章/食谱）
  const [searchType, setSearchType] = useState('posts')
  
  // 文章搜索条件
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedTags, setSelectedTags] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  
  // 食谱搜索条件
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [availableIngredients, setAvailableIngredients] = useState([])
  const [cookingTime, setCookingTime] = useState({ min: '', max: '' })
  const [servings, setServings] = useState({ min: '', max: '' })
  
  // 搜索结果
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const tagIds = searchParams.tags?.split(',') || [];

  useEffect(() => {
    if (tagIds.length > 0) {
      setSearchType('posts');
      setSelectedTags(tagIds);
    }
  }, [tagIds]);

  // 获取可用的标签和食材
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsRes, ingredientsRes] = await Promise.all([
          fetch('/api/tags'),
          fetch('/api/ingredients/all')
        ]);
        
        const [tagsData, ingredientsData] = await Promise.all([
          tagsRes.json(),
          ingredientsRes.json()
        ]);
        
        setAvailableTags(tagsData);
        setAvailableIngredients(ingredientsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
  }, []);

  // 处理食材选择
  const handleIngredientChange = (ingredientName) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredientName)) {
        return prev.filter(name => name !== ingredientName);
      } else {
        return [...prev, ingredientName];
      }
    });
  };

  // 处理搜索
  const handleSearch = async () => {
    setLoading(true)
    try {
      let url = '/api/search?'
      const params = new URLSearchParams()

      if (searchType === 'posts') {
        if (dateRange.start) params.append('startDate', dateRange.start)
        if (dateRange.end) params.append('endDate', dateRange.end)
        if (selectedTags.length) params.append('tags', selectedTags.join(','))
      } else {
        if (selectedIngredients.length) {
          params.append('ingredients', selectedIngredients.join(','))
        }
        if (cookingTime.min) params.append('minTime', cookingTime.min)
        if (cookingTime.max) params.append('maxTime', cookingTime.max)
        if (servings.min) params.append('minServings', servings.min)
        if (servings.max) params.append('maxServings', servings.max)
      }

      params.append('type', searchType)
      
      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()
      setResults(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchOptions}>
        <div className={styles.searchTypeSelector}>
          <button 
            className={`${styles.typeButton} ${searchType === 'posts' ? styles.active : ''}`}
            onClick={() => setSearchType('posts')}
          >
            搜索文章
          </button>
          <button 
            className={`${styles.typeButton} ${searchType === 'recipes' ? styles.active : ''}`}
            onClick={() => setSearchType('recipes')}
          >
            搜索食谱
          </button>
        </div>

        {searchType === 'posts' ? (
          <div className={styles.postSearch}>
            <div className={styles.dateRange}>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className={styles.dateInput}
              />
              <span>至</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className={styles.dateInput}
              />
            </div>
            <div className={styles.tags}>
              {availableTags.map(tag => (
                <label key={tag.id} className={styles.tagLabel}>
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTags(prev => [...prev, tag.id])
                      } else {
                        setSelectedTags(prev => prev.filter(id => id !== tag.id))
                      }
                    }}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.recipeSearch}>
            <div className={styles.ingredientsSelect}>
              <h3>选择食材</h3>
              <div className={styles.ingredientsList}>
                {availableIngredients.map(ingredient => (
                  <label key={ingredient} className={styles.ingredientLabel}>
                    <input
                      type="checkbox"
                      checked={selectedIngredients.includes(ingredient)}
                      onChange={() => handleIngredientChange(ingredient)}
                    />
                    <span>{ingredient}</span>
                  </label>
                ))}
              </div>
              {selectedIngredients.length > 0 && (
                <div className={styles.selectedIngredients}>
                  <h4>已选食材：</h4>
                  <div className={styles.ingredientTags}>
                    {selectedIngredients.map(ingredient => (
                      <span 
                        key={ingredient} 
                        className={styles.ingredientTag}
                        onClick={() => handleIngredientChange(ingredient)}
                      >
                        {ingredient} ×
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.rangeInputs}>
              <div className={styles.rangeGroup}>
                <label>烹饪时间（分钟）：</label>
                <input
                  type="number"
                  placeholder="最短"
                  value={cookingTime.min}
                  onChange={(e) => setCookingTime(prev => ({ ...prev, min: e.target.value }))}
                  className={styles.rangeInput}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="最长"
                  value={cookingTime.max}
                  onChange={(e) => setCookingTime(prev => ({ ...prev, max: e.target.value }))}
                  className={styles.rangeInput}
                />
              </div>
              <div className={styles.rangeGroup}>
                <label>份量（人数）：</label>
                <input
                  type="number"
                  placeholder="最少"
                  value={servings.min}
                  onChange={(e) => setServings(prev => ({ ...prev, min: e.target.value }))}
                  className={styles.rangeInput}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="最多"
                  value={servings.max}
                  onChange={(e) => setServings(prev => ({ ...prev, max: e.target.value }))}
                  className={styles.rangeInput}
                />
              </div>
            </div>
          </div>
        )}

        <button 
          className={styles.searchButton} 
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? '搜索中...' : '搜索'}
        </button>
      </div>

      <div className={styles.results}>
        {results.length > 0 ? (
          results.map(item => (
            <Card key={item.id} item={item} />
          ))
        ) : (
          <p className={styles.noResults}>
            {loading ? '搜索中...' : '暂无搜索结果'}
          </p>
        )}
      </div>
    </div>
  )
} 