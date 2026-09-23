export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Tomato Liz</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&family=Zeyada&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
        }

        :root {
            --primary-pink: #ff85a2;
            --soft-pink: #fbc4ab;
            --deep-pink: #e75480;
            --text-color: #5c3a44;
            --glass-bg: rgba(255, 255, 255, 0.45);
            --glass-border: rgba(255, 255, 255, 0.7);
        }

        /* 锁死页面高度，禁止任何方向滚动 */
        html, body {
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #ffeef2 0%, #ffd6e0 50%, #fec5bb 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        /* 梦幻粉色背景光斑 */
        .ambient-glow {
            position: absolute;
            width: 45vw;
            height: 45vw;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 133, 162, 0.5) 0%, rgba(255, 255, 255, 0) 70%);
            filter: blur(50px);
            z-index: 0;
            pointer-events: none;
            animation: pulse 8s ease-in-out infinite alternate;
        }
        .glow-top-left { top: -10vw; left: -10vw; }
        .glow-bottom-right { bottom: -10vw; right: -10vw; background: radial-gradient(circle, rgba(255, 182, 193, 0.6) 0%, rgba(255, 255, 255, 0) 70%); }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            100% { transform: scale(1.15); opacity: 1; }
        }

        /* 主毛玻璃容器 */
        .glass-card {
            position: relative;
            z-index: 1;
            width: min(92vw, 480px);
            max-height: 94vh;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1.5px solid var(--glass-border);
            border-radius: 28px;
            padding: 20px 20px 16px 20px;
            box-shadow: 0 15px 35px rgba(231, 84, 128, 0.12),
                        0 5px 15px rgba(0, 0, 0, 0.04);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
        }

        /* 顶部标题区 */
        .header {
            text-align: center;
            margin-bottom: 12px;
        }

        .badge {
            display: inline-block;
            font-size: 0.75rem;
            letter-spacing: 2px;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(135deg, var(--deep-pink), var(--primary-pink));
            padding: 3px 12px;
            border-radius: 20px;
            box-shadow: 0 2px 8px rgba(231, 84, 128, 0.3);
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        h1 {
            font-size: 1.5rem;
            color: var(--text-color);
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        h1 .tomato-icon {
            font-size: 1.3rem;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        /* 视频容器与自适应（确保无论如何不出滚动条） */
        .video-wrapper {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(231, 84, 128, 0.15);
            background: #ffeef2;
            position: relative;
            /* 保证视频高度不突破视口 */
            max-height: calc(85vh - 110px);
        }

        video {
            width: 100%;
            height: 100%;
            max-height: calc(85vh - 110px);
            object-fit: cover;
            border-radius: 18px;
            display: block;
        }

        /* 底部信息美化 */
        .footer {
            margin-top: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-color);
            opacity: 0.75;
            font-size: 0.75rem;
            font-weight: 400;
            letter-spacing: 0.5px;
        }

        .footer .sparkle {
            color: var(--deep-pink);
        }
    </style>
</head>
<body>
    <div class="ambient-glow glow-top-left"></div>
    <div class="ambient-glow glow-bottom-right"></div>

    <main class="glass-card">
        <div class="header">
            <span class="badge">IVE · LIZ</span>
            <h1>Tomato Liz <span class="tomato-icon">🍅</span></h1>
        </div>

        <div class="video-wrapper">
            <!-- 浏览器政策：静音状态(muted)才允许自动播放(autoplay) -->
            <video 
                src="https://liz.cmcc.cc.cd/Video/liz.mp4" 
                autoplay 
                loop 
                muted 
                playsinline 
                controls>
                您的浏览器不支持视频播放。
            </video>
        </div>

        <div class="footer">
            <span class="sparkle">✦</span>
            <span>Voice of IVE · Kim Ji-won</span>
            <span class="sparkle">✦</span>
        </div>
    </main>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
        // 缓存优化
        "cache-control": "public, max-age=3600",
      },
    });
  },
};