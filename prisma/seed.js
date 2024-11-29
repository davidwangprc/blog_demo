const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    // 创建管理员用户
    const hashedPassword = await bcrypt.hash('root', 10);
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        name: 'admin',
        isAdmin: true,
      }
    });
    console.log('Admin user created successfully');

    // 创建分类
    const categories = [
      { title: 'Style', slug: 'style', color: '#57c4ff31', image: 'cat_style.jpg'},
      { title: 'Fashion', slug: 'fashion', color: '#da85c731', image: 'cat_fashion.jpg' },
      { title: 'Food', slug: 'food', color: '#7fb88133', image: 'cat_food.jpg' },
      { title: 'Travel', slug: 'travel', color: '#ff795736', image: 'cat_travel.jpg' },
      { title: 'Culture', slug: 'culture', color: '#ffb04f45', image: 'cat_culture.jpg' },
      { title: 'Coding', slug: 'coding', color: '#5e4fff31', image: 'cat_coding.jpg' }
    ];

    // 创建分类并保存引用
    const createdCategories = {};
    for (const category of categories) {
      const createdCategory = await prisma.category.create({
        data: category
      });
      createdCategories[category.slug] = createdCategory;
    }
    console.log('Categories seeded successfully');

    // 创建一些测试用户
    const testUsers = [
      {
        username: 'john_doe',
        password: await bcrypt.hash('password123', 10),
        email: 'john@example.com',
        name: 'John Doe',
      },
      {
        username: 'jane_smith',
        password: await bcrypt.hash('password123', 10),
        email: 'jane@example.com',
        name: 'Jane Smith',
      }
    ];

    const users = [];
    for (const user of testUsers) {
      const createdUser = await prisma.user.create({
        data: user
      });
      users.push(createdUser);
    }
    console.log('Test users created successfully');

    // 创建示例文章
    const samplePosts = [
      {
        title: "开始学习Next.js开发",
        slug: "getting-started-with-nextjs",
        content: `
          Next.js是一个React框架，它使构建全栈Web应用变得简单。
          
          主要特点：
          1. 服务器端渲染
          2. 文件系统路由
          3. API路由支持
          4. 优化的图片处理
          
          让我们开始学习吧！
        `,
        description: "探索Next.js框架的基础知识和主要特性",
        image: "nextjs-cover.png",
        views: 100,
        featured: true,
        published: true,
        authorId: admin.id,
        categoryId: createdCategories['coding'].id, // 使用实际创建的coding分类ID
      },
      {
        title: "美食探索：完美意大利面",
        slug: "perfect-pasta-recipe",
        content: `
          制作完美意大利面的秘诀：
          
          1. 选择优质面条
          2. 适量盐调味
          3. 酱料的搭配技巧
          4. 烹饪时间的控制
          
          跟着这个教程，你也能做出餐厅级的意大利面！
        `,
        description: "学习制作美味意大利面的技巧和窍门",
        image: "pasta.jpg",
        views: 50,
        featured: false,
        published: true,
        authorId: users[0].id,
        categoryId: createdCategories['food'].id, // 使用实际创建的food分类ID
      }
    ];

    for (const post of samplePosts) {
      await prisma.post.create({
        data: {
          ...post,
          // 添加一些标签
          tags: {
            create: [
              { 
                name: post.categoryId === createdCategories['coding'].id ? "编程" : "美食", 
                slug: post.categoryId === createdCategories['coding'].id ? "programming" : "food" 
              }
            ]
          }
        }
      });
    }
    console.log('Sample posts created successfully');

    // 创建示例菜谱
    const sampleRecipes = [
      {
        title: "红烧肉",
        slug: "hong-shao-rou",
        ingredients: [
          { name: "五花肉", amount: 500, unit: "克" },
          { name: "生抽", amount: 30, unit: "毫升" },
          { name: "老抽", amount: 10, unit: "毫升" },
          { name: "料酒", amount: 20, unit: "毫升" },
          { name: "冰糖", amount: 30, unit: "克" }
        ],
        steps: "1. 将五花肉切块\n2. 冷水下锅焯水\n3. 放入适量油爆香\n4. 加入调味料\n5. 加水炖煮\n6. 收汁即可",
        cookingTime: 60,
        servings: 4,
        difficulty: "medium",
        categoryId: 3, // 假设3是食谱分类的ID
        authorId: 1 // 假设1是管理员用户的ID
      }
    ];

    for (const recipe of sampleRecipes) {
      const { ingredients, ...recipeData } = recipe;
      await prisma.recipe.create({
        data: {
          ...recipeData,
          ingredients: {
            create: ingredients
          }
        }
      });
    }
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Some records already exist');
    } else {
      console.error('Error seeding database:', error);
      throw error;
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
