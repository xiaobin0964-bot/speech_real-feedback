# 演讲反馈系统

一个轻量级的 Web 应用，用于在演讲/汇报场景下收集观众对演讲质量的实时反馈。

## 功能特性

- 🎤 **创建演讲**：演讲者可以轻松创建演讲会话，设置演讲题目和时长
- 📱 **扫码参与**：观众通过扫描二维码或点击链接进入反馈页面
- 👍🤔 **实时反馈**：观众可以随时点击 👍（好评）或 🤔（需改进）表达感受
- 📊 **实时统计**：演讲者可以实时查看反馈统计
- 📈 **详细报告**：演讲结束后自动生成包含时间轴分布的反馈报告

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **路由**：React Router
- **样式**：Tailwind CSS
- **后端服务**：Supabase（实时数据库 + 认证）
- **图表**：Recharts
- **二维码**：QRCode.react

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd real_feedback
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Supabase

1. 访问 [Supabase](https://supabase.com/) 并创建一个新项目
2. 在项目的 SQL Editor 中执行 `supabase/schema.sql` 文件中的 SQL
3. 进入项目设置（Settings → API），复制以下信息：
   - Project URL
   - anon public key
4. 在项目根目录创建 `.env` 文件，并添加以下内容：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 即可使用应用。

## 使用流程

### 演讲者端

1. **创建演讲**：填写演讲题目和时长，点击「开始演讲」
2. **分享链接**：展示二维码和链接，让观众扫码或点击进入
3. **开始演讲**：点击「开始演讲」按钮，观众端将显示反馈按钮
4. **实时查看**：演讲过程中可以实时查看 👍 和 🤔 的统计
5. **结束演讲**：点击「结束演讲」，自动跳转到反馈报告

### 观众端

1. **进入房间**：扫描二维码或点击链接进入反馈页面
2. **等待开始**：如果演讲尚未开始，显示「等待演讲开始」
3. **提交反馈**：演讲进行中，点击 👍 或 🤔️ 按钮表达感受
4. **演讲结束**：演讲结束后，显示「演讲已结束」提示

## 反馈报告

报告包含以下内容：

- **基础信息**：演讲题目、设定时长、实际时长、开始时间
- **汇总数据**：👍 总次数、🤔 总次数、总反馈次数
- **时间轴分布**：按分钟展示 👍 和 🤔 的分布情况
- **分析建议**：根据反馈数据提供改进建议

## 项目结构

```
real_feedback/
├── src/
│   ├── components/       # 可复用组件
│   ├── lib/              # 工具函数和 API 调用
│   ├── pages/            # 页面组件
│   │   ├── CreateSession.tsx    # 创建演讲页面
│   │   ├── SpeakerRoom.tsx       # 演讲者房间页面
│   │   ├── AudienceFeedback.tsx  # 观众反馈页面
│   │   └── Report.tsx            # 反馈报告页面
│   ├── types/            # TypeScript 类型定义
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── supabase/             # Supabase 配置
│   ├── schema.sql        # 数据库表结构
│   └── README.md         # Supabase 设置指南
├── public/               # 静态资源
├── index.html            # HTML 模板
├── package.json          # 项目配置
├── vite.config.ts        # Vite 配置
├── tailwind.config.js    # Tailwind CSS 配置
└── tsconfig.json         # TypeScript 配置
```

## 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

## 注意事项

- 确保 `.env` 文件已添加到 `.gitignore`，不要提交到版本控制
- Supabase 的 anon key 是公开的，可以安全地在前端使用
- 每次反馈间隔至少 3 秒，防止误触
- 演讲时长建议在 1-120 分钟之间

## 许可证

MIT
