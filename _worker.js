export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="referrer" content="no-referrer">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Tomato Liz</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Noto+Sans+SC:wght@400;600&display=swap" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
            -webkit-user-select: none;
        }

        /* 锁死全屏，绝对禁止滚动 */
        html, body {
            height: 100vh;
            height: 100dvh;
            width: 100vw;
            overflow: hidden;
            overscroll-behavior: none;
            background: #14050b;
            font-family: 'Outfit', 'Noto Sans SC', sans-serif;
            position: relative;
        }

        /* 1. 沉浸式全屏自适应视频 */
        .video-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100dvh;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1;
        }

        /* 动态氛围背景（避免黑边，用视频主色调柔化全屏） */
        .video-ambient-glow {
            position: absolute;
            width: 100vw;
            height: 100dvh;
            background: radial-gradient(circle at center, rgba(255, 117, 143, 0.4) 0%, rgba(20, 5, 11, 0.95) 75%);
            z-index: 1;
        }

        video {
            position: relative;
            z-index: 2;
            width: 100vw;
            height: 100dvh;
            /* 既能最大化充满全屏，又能保证Liz画面完整不被切脸 */
            object-fit: contain;
            filter: drop-shadow(0 0 30px rgba(255, 107, 139, 0.25));
        }

        /* 2. 悬浮顶部美学UI（不遮挡视频） */
        .floating-header {
            position: absolute;
            top: env(safe-area-inset-top, 20px);
            left: 0;
            width: 100%;
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
            pointer-events: none;
        }

        .title-tag {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            padding: 6px 18px;
            border-radius: 40px;
            color: #fff;
            font-size: 1.1rem;
            font-weight: 600;
            letter-spacing: 1px;
            box-shadow: 0 4px 15px rgba(255, 77, 109, 0.3);
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        /* 3. 互动粉色提示层（Notice Overlay）—— 解决自动播放与声音的关键 */
        .notice-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100dvh;
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.96) 0%, rgba(255, 117, 143, 0.95) 100%);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            z-index: 100;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .notice-overlay.dismissed {
            opacity: 0;
            visibility: hidden;
            transform: scale(1.08);
            pointer-events: none;
        }

        .notice-card {
            background: rgba(255, 255, 255, 0.75);
            padding: 36px 28px;
            border-radius: 32px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(220, 20, 60, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8) inset;
            max-width: 85vw;
            width: 360px;
            transform: translateY(0);
            animation: floatCard 3s ease-in-out infinite alternate;
        }

        @keyframes floatCard {
            0% { transform: translateY(-5px); }
            100% { transform: translateY(5px); }
        }

        .cat-icon {
            font-size: 3.5rem;
            margin-bottom: 10px;
            filter: drop-shadow(0 4px 10px rgba(255, 107, 139, 0.4));
        }

        .notice-title {
            font-size: 1.35rem;
            font-weight: 800;
            color: #5c1d31;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }

        .notice-subtitle {
            font-size: 0.92rem;
            color: #8c3a54;
            margin-bottom: 24px;
            line-height: 1.4;
        }

        .btn-enter {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: linear-gradient(135deg, #ff4d6d, #ff758f);
            color: white;
            font-size: 0.95rem;
            font-weight: 600;
            padding: 12px 28px;
            border-radius: 50px;
            box-shadow: 0 8px 20px rgba(255, 77, 109, 0.4);
            border: none;
            animation: pulseBtn 1.8s infinite;
        }

        @keyframes pulseBtn {
            0% { transform: scale(1); box-shadow: 0 8px 20px rgba(255, 77, 109, 0.4); }
            50% { transform: scale(1.04); box-shadow: 0 12px 25px rgba(255, 77, 109, 0.6); }
            100% { transform: scale(1); box-shadow: 0 8px 20px rgba(255, 77, 109, 0.4); }
        }

        /* 4. 飘落粉色樱花瓣动效（丰富视觉） */
        .petal {
            position: absolute;
            background: #ffb3c1;
            border-radius: 150% 0 150% 0;
            opacity: 0.6;
            pointer-events: none;
            z-index: 5;
            animation: fall 8s linear infinite;
        }

        @keyframes fall {
            0% { transform: translate(0, -10px) rotate(0deg); opacity: 0.7; }
            100% { transform: translate(60px, 105vh) rotate(360deg); opacity: 0; }
        }
    </style>
</head>
<body>

    <!-- 提示蒙层：点击不仅触发动画，还能带声音起播视频 -->
    <div class="notice-overlay" id="noticeOverlay" onclick="startTomatoLiz()">
        <div class="notice-card">
            <div class="cat-icon">🐱🍅</div>
            <h2 class="notice-title">Notice</h2>
            <p class="notice-subtitle">✨ 您将看见可爱小猫 ✨<br>准备好迎接金智媛的心动暴击了吗？</p>
            <div class="btn-enter">
                <span>点击开启声音并播放</span>
                <span>🎵</span>
            </div>
        </div>
    </div>

    <!-- 顶部悬浮标识 -->
    <header class="floating-header">
        <div class="title-tag">Tomato Liz 🍅</div>
    </header>

    <!-- 全屏视频自适应容器 -->
    <main class="video-container">
        <div class="video-ambient-glow"></div>
        <video 
            id="lizVideo"
            src="https://liz.cmcc.cc.cd/Video/liz.mp4" 
            loop 
            playsinline 
            webkit-playsinline
            preload="auto">
        </video>
    </main>

    <!-- 动态花瓣生成脚本 + 播放解锁控制 -->
    <script>
        // 生成飘落樱花瓣
        for (let i = 0; i < 15; i++) {
            let petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.width = Math.random() * 8 + 8 + 'px';
            petal.style.height = Math.random() * 12 + 12 + 'px';
            petal.style.animationDuration = Math.random() * 5 + 5 + 's';
            petal.style.animationDelay = Math.random() * 5 + 's';
            document.body.appendChild(petal);
        }

        // 核心：点击立刻开声音全速播放
        let hasStarted = false;
        function startTomatoLiz() {
            if (hasStarted) return;
            hasStarted = true;

            const video = document.getElementById('lizVideo');
            const overlay = document.getElementById('noticeOverlay');

            // 1. 设置非静音，音量拉满
            video.muted = false;
            video.volume = 1.0;

            // 2. 播放视频
            video.play().then(() => {
                // 3. 伴随平滑过渡移除提示框
                overlay.classList.add('dismissed');
            }).catch(err => {
                console.warn('浏览器降级策略触发:', err);
                // 极端情况下若仍被拦截，则静音播放确保画面必出
                video.muted = true;
                video.play();
                overlay.classList.add('dismissed');
            });
        }
    </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
        "cache-control": "public, max-age=1800",
      },
    });
  },
};
