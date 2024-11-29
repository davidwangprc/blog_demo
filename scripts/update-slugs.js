const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const toPinyin = require('chinese-to-pinyin');
const prisma = new PrismaClient();

const createSlug = (title) => {
  const timestamp = Date.now();
  
  // 检查是否包含中文字符
  const hasChinese = /[\u4e00-\u9fa5]/.test(title);
  
  if (hasChinese) {
    // 提取前两个中文字符
    const chineseChars = title.match(/[\u4e00-\u9fa5]{1,2}/)[0];
    
    // 转换为拼音
    const pinyinResult = toPinyin(chineseChars, {
      removeSpace: true,
      toneToNumber: false
    }).toLowerCase().replace(/\s+/g, '-');
    
    // 生成随机的十六进制字符串（4位）
    const randomHex = Math.floor(Math.random() * 0xFFFF)
      .toString(16)
      .padStart(4, '0');
    
    return `${timestamp}-${pinyinResult}-${randomHex}`;
  }
  
  const titleSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g
  });

  return `${timestamp}-${titleSlug || 'untitled'}`;
};

async function updateSlugs() {
  try {
    // 更新文章的 slugs
    const posts = await prisma.post.findMany();
    console.log(`Found ${posts.length} posts to update`);

    for (const post of posts) {
      const newSlug = createSlug(post.title);
      await prisma.post.update({
        where: { id: post.id },
        data: { slug: newSlug }
      });
      console.log(`Updated post: ${post.title} -> ${newSlug}`);
    }

    // 更新菜谱的 slugs
    const recipes = await prisma.recipe.findMany();
    console.log(`Found ${recipes.length} recipes to update`);

    for (const recipe of recipes) {
      const newSlug = createSlug(recipe.title);
      await prisma.recipe.update({
        where: { id: recipe.id },
        data: { slug: newSlug }
      });
      console.log(`Updated recipe: ${recipe.title} -> ${newSlug}`);
    }

    console.log('All slugs updated successfully');
  } catch (error) {
    console.error('Error updating slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行迁移
updateSlugs()
  .then(() => console.log('Migration completed'))
  .catch(console.error); 