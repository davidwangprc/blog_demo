import styles from './about.module.css'
import { FaReact, FaDatabase, FaGithub } from 'react-icons/fa'
import { TbBrandNextjs, TbBrandPrisma } from 'react-icons/tb'
import { SiTailwindcss, SiVercel } from 'react-icons/si'

export default function AboutPage() {
  const techStacks = [
    {
      category: "前端技术",
      items: [
        { name: "Next.js 13", icon: <TbBrandNextjs />, desc: "React框架，用于构建服务端渲染和静态网站" },
        { name: "React", icon: <FaReact />, desc: "用于构建用户界面的JavaScript库" },
        { name: "CSS Modules", desc: "模块化的CSS解决方案，确保样式隔离" }
      ]
    },
    {
      category: "后端技术",
      items: [
        { name: "Prisma", icon: <TbBrandPrisma />, desc: "现代数据库ORM工具" },
        { name: "MySQL", icon: <FaDatabase />, desc: "关系型数据库" },
        { name: "NextAuth.js", desc: "身份认证解决方案" }
      ]
    },
    {
      category: "部署和版本控制",
      items: [
        { name: "Vercel", icon: <SiVercel />, desc: "现代化的部署平台" },
        { name: "Git & GitHub", icon: <FaGithub />, desc: "版本控制和代码托管" }
      ]
    }
  ]

  const features = [
    {
      title: "博客系统",
      desc: "支持Markdown编辑、图片上传、分类标签等功能"
    },
    {
      title: "菜谱管理",
      desc: "可创建和编辑菜谱，包含食材、步骤、烹饪时间等信息"
    },
    {
      title: "搜索功能",
      desc: "支持按日期、标签搜索文章，按食材、烹饪时间搜索菜谱"
    },
    {
      title: "响应式设计",
      desc: "完美适配移动端和桌面端显示"
    }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>关于本项目</h1>
        <p className={styles.subtitle}>
          一个现代化的博客系统，集成了文章发布和菜谱管理功能
        </p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>技术栈</h2>
          <div className={styles.techGrid}>
            {techStacks.map((stack, index) => (
              <div key={index} className={styles.techCategory}>
                <h3 className={styles.categoryTitle}>{stack.category}</h3>
                <div className={styles.techItems}>
                  {stack.items.map((item, itemIndex) => (
                    <div key={itemIndex} className={styles.techItem}>
                      {item.icon && <span className={styles.techIcon}>{item.icon}</span>}
                      <div className={styles.techInfo}>
                        <h4>{item.name}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>主要功能</h2>
          <div className={styles.features}>
            {features.map((feature, index) => (
              <div key={index} className={styles.feature}>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>项目亮点</h2>
          <div className={styles.highlights}>
            <ul>
              <li>使用 Next.js 13 的 App Router 实现更好的路由管理</li>
              <li>采用 Prisma ORM 确保类型安全和高效的数据库操作</li>
              <li>实现服务端渲染提升性能和SEO效果</li>
              <li>模块化的CSS方案确保样式隔离</li>
              <li>完整的错误处理和用户反馈机制</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
} 