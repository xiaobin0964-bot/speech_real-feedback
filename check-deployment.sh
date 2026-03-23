#!/bin/bash

echo "🔍 检查项目配置..."

# 检查必要文件
echo "📁 检查必要文件..."
if [ -f "package.json" ]; then
    echo "✅ package.json 存在"
else
    echo "❌ package.json 不存在"
fi

if [ -f "vite.config.ts" ]; then
    echo "✅ vite.config.ts 存在"
else
    echo "❌ vite.config.ts 不存在"
fi

if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml 存在"
else
    echo "❌ netlify.toml 不存在"
fi

if [ -f "index.html" ]; then
    echo "✅ index.html 存在"
else
    echo "❌ index.html 不存在"
fi

# 检查依赖
echo ""
echo "📦 检查依赖..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules 存在"
else
    echo "❌ node_modules 不存在，需要运行 npm install"
fi

# 检查环境变量
echo ""
echo "🔐 检查环境变量..."
if [ -f ".env" ]; then
    echo "✅ .env 文件存在"
    if grep -q "VITE_SUPABASE_URL" .env; then
        echo "✅ VITE_SUPABASE_URL 已配置"
    else
        echo "⚠️  VITE_SUPABASE_URL 未配置"
    fi
    if grep -q "VITE_SUPABASE_ANON_KEY" .env; then
        echo "✅ VITE_SUPABASE_ANON_KEY 已配置"
    else
        echo "⚠️  VITE_SUPABASE_ANON_KEY 未配置"
    fi
else
    echo "⚠️  .env 文件不存在"
fi

# 测试构建
echo ""
echo "🔨 测试构建..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功"
    echo "📁 dist 目录内容："
    ls -la dist/
else
    echo "❌ 构建失败，请检查错误信息"
fi

echo ""
echo "✨ 检查完成！"