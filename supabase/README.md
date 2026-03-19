# 演讲反馈系统 - Supabase 数据库设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 点击 "New Project"
3. 填写项目信息：
   - Name: speech-feedback-system
   - Database Password: 设置一个强密码
   - Region: 选择离你最近的区域
4. 点击 "Create new project"

## 2. 执行数据库 Schema

1. 等待项目创建完成（通常需要 1-2 分钟）
2. 进入项目的 SQL Editor
3. 复制 `supabase/schema.sql` 文件的内容
4. 粘贴到 SQL Editor 中
5. 点击 "Run" 执行 SQL

## 3. 获取 API 凭证

1. 进入项目设置（Settings → API）
2. 复制以下信息：
   - Project URL
   - anon public key

## 4. 配置环境变量

1. 在项目根目录创建 `.env` 文件
2. 复制 `.env.example` 的内容
3. 替换为你的 Supabase 凭证：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. 验证配置

运行以下命令验证配置是否正确：

```bash
npm install
npm run dev
```

访问 http://localhost:3000，如果能看到应用界面，说明配置成功！

## 注意事项

- 确保 `.env` 文件已添加到 `.gitignore`，不要提交到版本控制
- anon key 是公开的，可以安全地在前端使用
- Supabase 的 RLS（Row Level Security）策略已配置，允许匿名用户读写数据
