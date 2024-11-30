# Next.js 博客应用

一个使用 Next.js 13+ 构建的现代化博客系统,支持文章发布和菜谱分享功能。

![image](cover-01.png)
## 功能特点

### 内容管理
- 支持文章和菜谱两种内容类型
- Markdown 编辑器支持富文本编辑
- 文章分类和标签管理
- 中英文标题 URL 友好的 slug 生成

### 用户系统
- 管理员登录和认证
- 基于 Cookie 的会话管理
- 受保护的后台管理路由

### 界面设计
- 响应式布局设计
- 支持亮色/暗色主题切换
- 现代化的 UI 组件

## 技术栈

- **前端框架**: Next.js 13+
- **UI 组件**: React 18
- **样式方案**: CSS Modules
- **数据库**: MySQL + Prisma ORM
- **认证**: Next-Auth
- **编辑器**: React-Quill
- **其他工具**:
  - chinese-to-pinyin (中文转拼音)
  - slugify (URL 友好的 slug 生成)
  - bcryptjs (密码加密)

## 开始使用

### 环境要求
- Node.js 16+
- MySQL 数据库

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd next-blog
```

2. 安装依赖
```bash
yarn install
```

3. 环境配置
创建 `.env` 文件并配置以下环境变量:
```env
MYSQL_URL="mysql://user:password@localhost:3306/blog"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NODE_ENV="development"
```

4. 数据库迁移
```bash
npx prisma migrate dev
```

5. 初始化数据
```bash
yarn seed
```

6. 启动开发服务器
```bash
yarn dev
```

## 项目结构

```
src/
├── app/                # Next.js 13+ App Router
│   ├── api/           # API 路由
│   ├── admin/         # 管理后台
│   └── posts/         # 文章页面
├── components/        # React 组件
├── providers/         # Context Providers
├── utils/            # 工具函数
└── lib/              # 共享库
```

## 常见问题解决方案

### 标签数据不显示问题

当使用 Prisma 查询包含关联数据(如标签)的内容时，需要明确指定要查询的字段：

```javascript
// 错误写法
const post = await prisma.post.findUnique({
  include: {
    tags: true  // 简单的 include 可能导致数据不完整
  }
});

// 正确写法
const post = await prisma.post.findUnique({
  include: {
    tags: {
      select: {
        id: true,
        name: true,
        slug: true
      }
    }
  }
});
```

#### 解决步骤：

1. 在 API 路由中明确指定需要查询的关联数据字段
2. 添加适当的调试日志以跟踪数据流
3. 确保前端组件正确处理可能为空的数据

#### 调试技巧：

```javascript
// 在 API 路由中添加调试日志
console.log("数据库查询结果:", post);
console.log("文章标签:", post?.tags);

// 在前端组件中添加条件渲染
{post.tags && post.tags.length > 0 ? (
  <div className={styles.tags}>
    {post.tags.map(tag => (
      <span key={tag.id} className={styles.tag}>
        {tag.name}
      </span>
    ))}
  </div>
) : (
  <div className={styles.tags}>暂无标签</div>
)}
```

#### 注意事项：

- 使用 Prisma 查询关联数据时，推荐使用 select 明确指定需要的字段
- 添加适当的错误处理和空值检查
- 在开发过程中保持良好的日志记录习惯
- 考虑数据加载状态的处理

## API 接口

### 文章相关
- `GET /api/posts` - 获取文章列表
- `POST /api/posts` - 创建新文章
- `GET /api/posts/[slug]` - 获取单篇文章
- `PUT /api/posts/[slug]` - 更新文章

### 菜谱相关
- `GET /api/recipes` - 获取菜谱列表
- `POST /api/recipes` - 创建新菜谱

### 认证相关
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/check` - 检查认证状态

## 部署

项目可以部署到任何支持 Node.js 的平台:

1. 构建项目
```bash
yarn build
```

2. 启动生产服务器
```bash
yarn start
```

![image](cover-02.png)

## 作者
DavidWang
# blog_demo

Forked from [next-blog](https://github.com/safak/next-blog)
<<<<<<< HEAD
=======


## Docker 部署

本项目支持使用 Docker 进行部署,提供完整的容器化解决方案。

### 前置要求

- Docker Engine 20.10.0+
- Docker Compose v2.0.0+
- 至少 2GB 可用内存
- 至少 10GB 磁盘空间

### 部署步骤

1. 准备环境文件
```bash
# 复制 Docker 环境配置
cp .env.docker .env
```

2. 构建和启动容器
```bash
# 构建并在后台启动所有服务
docker-compose up -d --build
```

3. 初始化数据库
```bash
# 等待 MySQL 完全启动后执行
docker exec -it blog_app sh

# 在容器内执行数据库迁移
npx prisma migrate deploy

# 初始化种子数据
yarn seed

# 退出容器
exit
```

4. 访问应用
```
http://localhost:3000
```

### 常用 Docker 命令

```bash
# 查看容器状态
docker-compose ps

# 查看应用日志
docker-compose logs -f app

# 查看数据库日志
docker-compose logs -f mysql

# 停止所有服务
docker-compose down

# 重启特定服务
docker-compose restart app

# 重建并重启所有服务
docker-compose up -d --build --force-recreate
```

### 目录结构

```
.
├── Dockerfile          # 应用容器配置
├── docker-compose.yml  # 容器编排配置
├── .dockerignore      # Docker 忽略文件
└── .env.docker        # Docker 环境配置
```

### 注意事项

1. 数据持久化
- MySQL 数据存储在 Docker volume 中
- 可以在 docker-compose.yml 中配置自定义存储路径
- 删除容器不会影响持久化数据

2. 网络配置
- 应用和数据库通过内部网络 `blog_network` 通信
- MySQL 端口 3306 映射到主机便于调试
- 应用端口 3000 映射到主机供访问

3. 安全考虑
- 生产环境部署时需要修改默认密码
- 建议使用环境变量注入敏感信息
- 考虑添加 SSL 证书配置

4. 性能优化
- 可以调整 MySQL 配置以优化性能
- 考虑使用 Redis 缓存提升性能
- 生产环境建议使用 nginx 反向代理

5. 故障排除
- 检查容器日志定位问题
- 确保数据库完全启动后再初始化
- 网络问题可以尝试重建网络

6. 备份策略
- 定期备份 MySQL 数据
- 可以使用 Docker volume 备份
- 建议保留多个备份版本

### 环境变量说明

Docker 环境使用的环境变量存储在 `.env.docker` 文件中:

```env
MYSQL_URL         # MySQL 连接字符串
NEXT_PUBLIC_API_URL   # API 地址
NEXTAUTH_URL      # NextAuth 认证地址
NEXTAUTH_SECRET   # NextAuth 密钥
NODE_ENV          # 运行环境
```
>>>>>>> a1c02578788ad801e341092f83ef657bf98dc563
