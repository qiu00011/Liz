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
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Noto+Sans+JP:wght@400;500&family=Noto+Sans+KR:wght@400;500&family=Noto+Sans+SC:wght@400;500&display=swap" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
            -webkit-user-select: none;
        }

        :root {
            --pink-main: #ff4d6d;
            --pink-light: #ff758f;
            --pink-bg: #ffeef2;
            --glass-card: rgba(255, 255, 255, 0.45);
            --glass-border: rgba(255, 255, 255, 0.65);
        }

        html, body {
            height: 100vh;
            height: 100dvh;
            width: 100vw;
            overflow: hidden;
            overscroll-behavior: none;
            background: linear-gradient(135deg, #1c0812 0%, #2e0d1d 50%, #16040c 100%);
            font-family: 'Outfit', 'Noto Sans SC', 'Noto Sans KR', 'Noto Sans JP', sans-serif;
            color: #fff;
        }

        /* 主舞台双栏布局：左视频 + 右聊天 */
        .live-stage {
            display: flex;
            width: 100vw;
            height: 100dvh;
            position: relative;
            z-index: 10;
        }

        /* ================= 左侧：视频广播区 ================= */
        .video-section {
            flex: 1;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            background: radial-gradient(circle at center, rgba(255, 117, 143, 0.25) 0%, rgba(15, 3, 9, 0.8) 75%);
            overflow: hidden;
        }

        /* 顶部悬浮直播状态条 */
        .live-top-bar {
            position: absolute;
            top: env(safe-area-inset-top, 20px);
            left: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 20;
        }

        .live-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(135deg, #ff2a5f, #ff6384);
            padding: 5px 14px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.8rem;
            letter-spacing: 1px;
            box-shadow: 0 4px 15px rgba(255, 42, 95, 0.5);
        }

        .live-dot {
            width: 8px;
            height: 8px;
            background: #fff;
            border-radius: 50%;
            animation: blink 1s infinite alternate;
        }

        @keyframes blink {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0.3; transform: scale(0.8); }
        }

        .room-info {
            background: rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 5px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .viewer-count {
            color: #ff9ebb;
            font-size: 0.8rem;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 0 40px rgba(255, 105, 135, 0.2));
        }

        /* ================= 右侧：粉色毛玻璃互动聊天室 ================= */
        .chat-section {
            width: 380px;
            max-width: 35vw;
            height: 100dvh;
            background: rgba(255, 220, 230, 0.12);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border-left: 1.5px solid rgba(255, 255, 255, 0.18);
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 25;
            box-shadow: -10px 0 35px rgba(0, 0, 0, 0.3);
        }

        .chat-header {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .chat-header h3 {
            font-size: 1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #ffb8ca;
        }

        /* 消息滚动容器 */
        .chat-messages {
            flex: 1;
            overflow-y: hidden;
            padding: 16px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            gap: 12px;
            mask-image: linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
            -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
        }

        .message-item {
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 10px 14px;
            border-radius: 16px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 0.88rem;
            line-height: 1.35;
            animation: messageIn 0.35s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        @keyframes messageIn {
            from { opacity: 0; transform: translateY(15px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .user-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 700;
            flex-shrink: 0;
            background: linear-gradient(135deg, #ff85a2, #fbc4ab);
            color: #4a1224;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .msg-content {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .user-name {
            font-size: 0.75rem;
            font-weight: 600;
            color: #ff9ebb;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .user-name .flag {
            font-size: 0.75rem;
        }

        .msg-text {
            color: #ffffff;
            font-weight: 400;
            word-break: break-word;
        }

        /* 底部互动送心输入条 */
        .chat-input-bar {
            padding: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            display: flex;
            gap: 10px;
            align-items: center;
            background: rgba(0, 0, 0, 0.2);
        }

        .input-mock {
            flex: 1;
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 10px 16px;
            border-radius: 25px;
            font-size: 0.82rem;
            color: rgba(255, 255, 255, 0.6);
        }

        .heart-button {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff4d6d, #ff758f);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 77, 109, 0.5);
            animation: pulseBtn 2s infinite;
        }

        /* 飘动的粉色爱心特效 */
        .floating-heart {
            position: absolute;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 99;
            animation: floatHeart 3s ease-out forwards;
        }

        @keyframes floatHeart {
            0% { transform: translate(0, 0) scale(0.6) rotate(0deg); opacity: 1; }
            100% { transform: translate(var(--rx), -350px) scale(1.4) rotate(var(--deg)); opacity: 0; }
        }

        /* ================= 提示框 Notice（入场全屏卡片） ================= */
        .notice-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100dvh;
            background: linear-gradient(135deg, rgba(255, 175, 189, 0.96) 0%, rgba(255, 107, 139, 0.96) 100%);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            z-index: 999;
            display: flex;
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
            background: rgba(255, 255, 255, 0.85);
            padding: 38px 30px;
            border-radius: 36px;
            text-align: center;
            max-width: 86vw;
            width: 380px;
            box-shadow: 0 20px 60px rgba(231, 84, 128, 0.3), 0 0 0 1.5px rgba(255, 255, 255, 0.9) inset;
        }

        .cat-badge {
            font-size: 3.5rem;
            margin-bottom: 8px;
            filter: drop-shadow(0 4px 10px rgba(255, 77, 109, 0.3));
        }

        .notice-title {
            font-size: 1.35rem;
            font-weight: 700;
            color: #5c1b2f;
            margin-bottom: 6px;
        }

        .notice-desc {
            font-size: 0.95rem;
            color: #8c3851;
            margin-bottom: 24px;
            line-height: 1.45;
        }

        .btn-join {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #ff4d6d, #ff758f);
            color: #fff;
            font-size: 1rem;
            font-weight: 600;
            padding: 13px 32px;
            border-radius: 50px;
            box-shadow: 0 8px 25px rgba(255, 77, 109, 0.45);
            border: none;
        }

        /* 移动端适配：竖屏自动变直播悬浮弹幕流 */
        @media (max-width: 768px) {
            .live-stage { flex-direction: column; }
            .video-section { width: 100vw; height: 100dvh; }
            .chat-section {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100vw;
                max-width: 100vw;
                height: 40dvh;
                background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%);
                border-left: none;
                box-shadow: none;
            }
            .chat-header { display: none; }
            .chat-messages { padding: 12px; }
            .message-item { background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(10px); }
        }
    </style>
</head>
<body>

    <!-- 交互提示蒙层：点击解决“自动播放+带声音”限制 -->
    <div class="notice-overlay" id="noticeOverlay" onclick="enterLizLive()">
        <div class="notice-card">
            <div class="cat-badge">🐱🍅</div>
            <h2 class="notice-title">Notice</h2>
            <p class="notice-desc">✨ 您将看见可爱小猫 ✨<br>金智媛 Tomato Liz 正在直播连线中</p>
            <button class="btn-join">
                <span>进入直播间 (开启声音)</span>
                <span>💖</span>
            </button>
        </div>
    </div>

    <!-- 主直播舞台 -->
    <div class="live-stage">
        
        <!-- 左侧视频区域 -->
        <main class="video-section">
            <div class="live-top-bar">
                <div class="live-badge">
                    <span class="live-dot"></span>
                    <span>LIVE</span>
                </div>
                <div class="room-info">
                    <span>Tomato Liz 🍅</span>
                    <span class="viewer-count">👁️ 152.8K</span>
                </div>
            </div>

            <video 
                id="lizVideo"
                src="https://liz.cmcc.cc.cd/Video/liz.mp4" 
                loop 
                playsinline 
                webkit-playsinline
                preload="auto">
            </video>
        </main>

        <!-- 右侧粉丝多语言互动弹幕室 -->
        <aside class="chat-section" id="chatSection">
            <div class="chat-header">
                <h3><span>💬</span> 粉丝实时互动 (Fan Chat)</h3>
                <span style="font-size: 0.8rem; color: #ff9ebb;">IVE · DIVE</span>
            </div>

            <div class="chat-messages" id="chatBox">
                <!-- 弹幕动态插入 -->
            </div>

            <div class="chat-input-bar">
                <div class="input-mock">Send some love to Liz... 🍅</div>
                <button class="heart-button" onclick="createHeart(event)">💖</button>
            </div>
        </aside>
    </div>

    <script>
        // 4国语言多模态真实弹幕池
        const comments = [
            // 中文 (CN)
            { name: "芝士小猫观察员", text: "小番茄莉兹今天也太甜了吧！！🍅💖", flag: "🇨🇳", bg: "#ff99ac" },
            { name: "DIVE小桃", text: "开嗓即天籁！这个金发神颜我能看一整天😭", flag: "🇨🇳", bg: "#fbc4ab" },
            { name: "秋天的小酒窝", text: "小猫咪看我看我！声音太治愈了✨", flag: "🇨🇳", bg: "#ffb3c1" },
            { name: "IVE主唱安利官", text: "音色流氓金智媛！生唱第一名王牌主唱🎤", flag: "🇨🇳", bg: "#ff758f" },

            // ENGLISH (EN)
            { name: "StarryLiz", text: "Tomato Liz is glowing so much today!! 🍅✨", flag: "🇺🇸", bg: "#80ed99" },
            { name: "IVE_Worldwide", text: "BEST VOCALIST OF 4TH GEN HANDS DOWN 😭👑", flag: "🇬🇧", bg: "#48cae4" },
            { name: "CheeseCatLover", text: "Her precious smile literally saved my day 🐱💕", flag: "🇨🇦", bg: "#b5e2fa" },
            { name: "LizSunshine", text: "Greetings from US DIVEs! WE LOVE YOU LIZ!! 💖", flag: "🇺🇸", bg: "#edafb8" },

            // 韩语 (KR)
            { name: "지원바라기", text: "우리 토마토 리즈 미모 폼 미쳤다 ㅠㅠ 🍅🐱", flag: "🇰🇷", bg: "#d8bbff" },
            { name: "다이브1기", text: "치즈냥이 목소리 너무 극락이야... 음색요정 김지원 사랑해💖", flag: "🇰🇷", bg: "#c8b6ff" },
            { name: "IVE_리즈_최고", text: "오늘 라이브 진짜 레전드다 ㅠㅠ 라이브 왜 이렇게 잘해 ✨", flag: "🇰🇷", bg: "#b8c0ff" },
            { name: "골든보이스", text: "리즈야 맛있는 거 많이 먹구 항상 행복해야 해!! 🍀", flag: "🇰🇷", bg: "#e7c6ff" },

            // 日语 (JP)
            { name: "リズ推しDIVE", text: "トマトのリズちゃん天使すぎる…可愛くて無理🫠🍅", flag: "🇯🇵", bg: "#ffcad4" },
            { name: "モモねこ", text: "リズちゃんの歌声、本当に心に染みる🐱🎤✨", flag: "🇯🇵", bg: "#ffe5d9" },
            { name: "IVEファンジャパン", text: "日本からいつも応援してます！大好きだよ〜！🇯🇵💖", flag: "🇯🇵", bg: "#ffccd5" }
        ];

        const chatBox = document.getElementById('chatBox');
        let chatInterval;

        function addMessage() {
            const randomMsg = comments[Math.floor(Math.random() * comments.length)];
            const msgEl = document.createElement('div');
            msgEl.className = 'message-item';
            msgEl.innerHTML = \`
                <div class="user-avatar" style="background:\${randomMsg.bg}">\${randomMsg.name.slice(0, 1)}</div>
                <div class="msg-content">
                    <span class="user-name">
                        <span class="flag">\${randomMsg.flag}</span>
                        <span>\${randomMsg.name}</span>
                    </span>
                    <span class="msg-text">\${randomMsg.text}</span>
                </div>
            \`;
            chatBox.appendChild(msgEl);

            // 保持最新 7 条弹幕，防止 DOM 过多
            if (chatBox.children.length > 7) {
                chatBox.removeChild(chatBox.firstElementChild);
            }
        }

        // 随机飘动爱心特效
        function createHeart(e) {
            const heart = document.createElement('div');
            const icons = ['💖', '🍅', '✨', '🐱', '🌸', '🍓'];
            heart.className = 'floating-heart';
            heart.innerText = icons[Math.floor(Math.random() * icons.length)];
            
            // 设定爱心出现的位置与飘动随机性
            const rect = document.querySelector('.heart-button').getBoundingClientRect();
            heart.style.left = (rect.left + Math.random() * 20) + 'px';
            heart.style.top = rect.top + 'px';
            heart.style.setProperty('--rx', (Math.random() * 120 - 60) + 'px');
            heart.style.setProperty('--deg', (Math.random() * 60 - 30) + 'deg');

            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }

        // 核心进入逻辑：满足浏览器限制，一键解开声音与自动播放
        let hasEntered = false;
        function enterLizLive() {
            if (hasEntered) return;
            hasEntered = true;

            const video = document.getElementById('lizVideo');
            const overlay = document.getElementById('noticeOverlay');

            // 打开音量满格起播
            video.muted = false;
            video.volume = 1.0;
            video.play().catch(e => {
                video.muted = true;
                video.play();
            });

            // 移除提示层
            overlay.classList.add('dismissed');

            // 启动定时弹幕系统与自动点赞
            setInterval(addMessage, 1500);
            setInterval(() => {
                if (Math.random() > 0.4) createHeart();
            }, 1200);
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
