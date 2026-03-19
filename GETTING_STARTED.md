# 🚀 快速开始指南

## 前置要求

在开始之前，请确保你的系统已安装以下软件：

### 1. Node.js (必需)

- **版本要求**：Node.js 18.x 或更高版本
- **安装方式**：
  - **macOS**：使用 Homebrew 安装
    ```bash
    brew install node
    ```
  - **Windows**：从 [nodejs.org](https://nodejs.org/) 下载并安装 LTS 版本
  - **Linux**：使用包管理器安装
    ```bash
    # Ubuntu/Debian
    sudo apt-get install nodejs npm
    
    # CentOS/RHEL
    sudo yum install nodejs npm
    ```

- **验证安装**：
  ```bash
  node --version
  npm --version
  ```

### 2. Git (可选，用于克隆项目)

- **安装方式**：
  - **macOS**：通常已预装，或使用 Homebrew
    ```bash
    brew install git
    ```
  - **Windows**：从 [git-scm.com](https://git-scm.com/) 下载并安装
  - **Linux**：
    ```bash
    sudo apt-get install git  # Ubuntu/Debian
    sudo yum install git      # CentOS/RHEL
    ```

## 完整设置步骤

### 步骤 1：安装 Node.js

如果你还没有安装 Node.js，请按照上面的说明进行安装。

### 步骤 2：验证 Node.js 安装

打开终端（Terminal）或命令提示符（CMD），运行以下命令：

```bash
node --version
npm --version
```

你应该看到类似以下的输出：
```
v18.19.0
10.2.3
```

### 步骤 3：安装项目依赖

在项目根目录下运行：

```bash
npm install
```

这将安装所有必需的依赖包，包括：
- React 和相关库
- React Router
- Supabase 客户端
- Tailwind CSS
- 其他开发工具

### 步骤 4：配置 Supabase

#### 4.1 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 点击 "New Project"
3. 填写项目信息：
   - Name: `speech-feedback-system`
   - Database Password: 设置一个强密码（请记住这个密码）
   - Region: 选择离你最近的区域
4. 点击 "Create new project"
5. 等待项目创建完成（通常需要 1-2 分钟）

#### 4.2 执行数据库 Schema

1. 进入 Supabase 项目的 SQL Editor
2. 复制 `supabase/schema.sql` 文件的内容
3. 粘贴到 SQL Editor 中
4. 点击 "Run" 按钮执行 SQL

#### 4.3 获取 API 凭证

1. 进入项目设置（Settings → API）
2. 复制以下信息：
   - **Project URL**：类似 `https://xxxxxxxx.supabase.co`
   - **anon public key**：一长串随机字符

#### 4.4 配置环境变量

1. 在项目根目录创建 `.env` 文件
2. 复制 `.env.example` 的内容
3. 替换为你的 Supabase 凭证：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**重要**：
- 确保 `.env` 文件已添加到 `.gitignore`，不要提交到版本控制
- `.env` 文件应该只包含你的实际凭证，不要包含示例文本

### 步骤 5：启动开发服务器

在项目根目录下运行：

```bash
npm run dev
```

你应该看到类似以下的输出：

```
  VITE v5.2.0  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 步骤 6：访问应用

在浏览器中打开 [http://localhost:3000](http://localhost:3000)

你应该能看到「创建演讲」页面。

## 常见问题

### Q1: `npm install` 失败

**解决方案**：
- 检查网络连接
- 尝试使用国内镜像：
  ```bash
  npm config set registry https://registry.npmmirror.com
  npm install
  ```
- 清除 npm 缓存：
  ```bash
  npm cache clean --force
  npm install
  ```

### Q2: `npm run dev` 启动失败

**解决方案**：
- 确保端口 3000 没有被占用
- 尝试使用其他端口：
  ```bash
  npm run dev -- --port 3001
  ```

### Q3: Supabase 连接失败

**解决方案**：
- 检查 `.env` 文件中的 URL 和 Key 是否正确
- 确保 Supabase 项目已经创建完成
- 检查 Supabase 项目是否启用了 Realtime 功能

### Q4: TypeScript 类型错误

**解决方案**：
- 确保已安装所有依赖：
  ```bash
  npm install
  ```
- 删除 `node_modules` 和 `package-lock.json`，重新安装：
  ```bash
  rm -rf node_modules package-lock.json
  npm install
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

## 下一步

现在你已经成功启动了应用，可以开始测试功能了：

1. **创建演讲**：填写演讲题目和时长
2. **分享链接**：复制链接或扫描二维码
3. **测试反馈**：在另一个浏览器标签页或设备中打开链接，测试反馈功能
4. **查看报告**：结束演讲后，查看生成的反馈报告

## 需要帮助？

如果遇到问题，请检查：
1. Node.js 版本是否正确
2. 所有依赖是否已安装
3. Supabase 配置是否正确
4. `.env` 文件是否存在且配置正确

祝你使用愉快！🎉
