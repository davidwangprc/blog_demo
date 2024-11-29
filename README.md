# Next.js 博客应用

一个使用 Next.js 13+ 构建的现代化博客系统,支持文章发布和菜谱分享功能。

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

## 贡献指南

欢迎提交 Pull Request 和 Issue。在提交之前，请确保:

1. 代码符合项目的编码规范
2. 添加必要的测试
3. 更新相关文档

## 许可证

MIT License

## 作者

DavidWang
# blog_demo
