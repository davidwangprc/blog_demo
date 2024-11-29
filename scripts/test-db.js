const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    // 测试连接
    await prisma.$connect();
    console.log('数据库连接成功！');

    // 测试查询
    const categories = await prisma.category.findMany();
    console.log('分类列表:', categories);

  } catch (error) {
    console.error('数据库错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 