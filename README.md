# AI+X Elite Class · 真实项目实战 - 倒计时看板

专业级项目时间管理看板，具有实时倒计时、任务排序、数据持久化和美观的视觉效果。

## 功能特性

- **实时倒计时系统** - 精确到秒的倒计时显示，支持天、时、分、秒
- **任务管理** - 支持任务完成状态标记、删除操作
- **优先级排序** - 关键任务（G2提交自检、班级成果展）优先显示
- **北京时区** - 自动计算北京时间，确保时间准确
- **数据持久化** - 使用 localStorage 保存任务数据
- **计时器控制** - 启动/暂停倒计时功能
- **状态指示** - 任务状态标签（NORMAL/WARNING/DANGER/COMPLETED）
- **统计面板** - 显示总节点、即将到期、紧急任务数量
- **响应式设计** - 适配桌面、平板、手机等多种屏幕尺寸
- **奢华视觉** - 金色渐变、玻璃态效果、流畅动画

## 技术栈

- **HTML5** - 语义化页面结构
- **CSS3** - 现代化样式设计
- **JavaScript (ES6+)** - 原生 JavaScript，无框架依赖
- **LocalStorage** - 浏览器数据持久化

## 快速开始

### 方法一：直接打开

直接用浏览器打开 `index.html` 文件即可使用。

### 方法二：本地服务器

使用 Python 启动本地服务器：

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

然后在浏览器访问：`http://localhost:8000`

## 项目结构

```
timer/
├── index.html    # 主页面文件
├── script.js     # 核心逻辑文件
└── styles.css    # 样式文件
```

## 核心功能说明

### 任务状态

- **COMPLETED** - 已完成任务
- **NORMAL** - 正常状态任务（7天以上到期）
- **WARNING** - 即将到期任务（3-7天）
- **DANGER** - 紧急任务（3天内或已过期）

### 主要类

#### CountdownBoard

主控制器类，负责：

- 任务加载和保存
- 倒计时更新
- 页面渲染
- 事件绑定

### 关键方法

- `getBeijingTime()` - 获取北京时间
- `updateCurrentTime()` - 更新当前时间显示
- `updateCountdowns()` - 更新所有任务倒计时
- `getSortedNodes()` - 获取排序后的任务列表
- `render()` - 渲染整个页面

## 自定义配置

### 修改默认任务

编辑 [script.js](file:///d:/skill/timer/script.js#L28-L74) 中的 `getDefaultNodes()` 方法：

```javascript
getDefaultNodes() {
    return [
        {
            id: 'node-1',
            name: '你的任务名称',
            description: '任务描述',
            deadline: new Date(2026, 4, 11, 23, 59, 59).toISOString(),
            completed: false
        }
        // 添加更多任务...
    ];
}
```

### 调整样式

编辑 [styles.css](file:///d:/skill/timer/styles.css) 自定义视觉效果：

- 颜色主题：修改 `:root` 中的 CSS 变量
- 字体：修改 `font-family` 属性
- 动画：调整 `@keyframes` 定义

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT License

D:\onenotes\OneDrive\文档\GitHub\Countdown-main
