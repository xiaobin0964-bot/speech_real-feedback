# 部署指南

## 推荐部署方案

### 方案1：Netlify（推荐，免费且简单）

#### 步骤：
1. 注册Netlify账号：https://app.netlify.com/
2. 连接GitHub仓库
3. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 添加域名：`www.realfeedback.fun`
5. 配置DNS：
   - 类型：CNAME
   - 主机记录：www
   - 记录值：`your-site.netlify.app`

### 方案2：阿里云OSS + CDN（推荐，国内访问快）

#### 步骤：
1. 注册阿里云账号
2. 创建OSS存储桶：
   - 地域：选择离用户最近的
   - 权限：公共读
3. 上传dist目录内容
4. 配置CDN加速
5. 绑定域名：`www.realfeedback.fun`

### 方案3：GitHub Pages（免费）

#### 步骤：
1. 推送代码到GitHub
2. 在仓库设置中启用Pages
3. 配置自定义域名
4. 在域名DNS中添加CNAME记录

## 构建命令

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 生成的文件在 dist 目录
```

## 注意事项

1. **环境变量**：确保在部署平台配置Supabase的环境变量
2. **HTTPS**：所有方案都支持自动HTTPS
3. **缓存**：首次访问可能较慢，后续会加速
4. **备案**：如果使用国内域名，建议进行ICP备案