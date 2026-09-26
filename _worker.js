export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <!-- 关键策略：保证所有外链图片及视频免受防盗链403拦截 -->
    <meta name="referrer" content="no-referrer">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Tomato Liz</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Italiana&family=Outfit:wght@300;400;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
            -webkit-user-select: none;
        }

        :root {
            --pink-accent: #ff4d6d;
            --pink-glow: rgba(255, 77, 109, 0.45);
            --bg-dark: #0f0308;
        }

        /* 锁死视口，绝不滚动 */
        html, body {
            height: 100vh;
            height: 100dvh;
            width: 100vw;
            overflow: hidden;
            overscroll-behavior: none;
            background: var(--bg-dark);
            font-family: 'Outfit', 'Noto Sans SC', sans-serif;
            color: #fff;
        }

        .live-stage {
            display: flex;
            width: 100vw;
            height: 100dvh;
            position: relative;
            z-index: 10;
        }

        /* ================= 左侧：视频主舞台 ================= */
        .video-section {
            flex: 1;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            background: radial-gradient(circle at center, rgba(255, 60, 100, 0.2) 0%, rgba(15, 3, 8, 0.95) 80%);
            overflow: hidden;
        }

        /* 顶部状态栏 */
        .live-top-bar {
            position: absolute;
            top: env(safe-area-inset-top, 24px);
            left: 24px;
            right: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 30;
            pointer-events: none;
        }

        /* 左上角头像组件（嵌入指定头像图） */
        .channel-info {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(18, 4, 10, 0.65);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 5px 16px 5px 6px;
            border-radius: 40px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }

        .author-avatar-box {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            overflow: hidden;
            border: 1.5px solid #ff758f;
            box-shadow: 0 0 10px var(--pink-glow);
            flex-shrink: 0;
        }

        .author-avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .author-meta {
            display: flex;
            flex-direction: column;
        }

        .author-name {
            font-size: 0.88rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            color: #fff;
        }

        .author-sub {
            font-size: 0.68rem;
            color: rgba(255, 255, 255, 0.55);
            letter-spacing: 0.3px;
        }

        /* 右上角人数统计（1w+） */
        .live-right-badge {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .live-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ff2a55;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.72rem;
            letter-spacing: 1.5px;
            box-shadow: 0 0 16px rgba(255, 42, 85, 0.6);
        }

        .live-dot {
            width: 6px;
            height: 6px;
            background: #fff;
            border-radius: 50%;
            animation: blink 1s infinite alternate;
        }

        @keyframes blink {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0.2; transform: scale(0.7); }
        }

        .viewers-pill {
            background: rgba(18, 4, 10, 0.65);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            color: #ffb3c1;
            letter-spacing: 0.5px;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 0 40px rgba(255, 77, 109, 0.2));
        }

        /* ================= 右侧：直播弹幕面板 ================= */
        .chat-section {
            width: 390px;
            max-width: 35vw;
            height: 100dvh;
            background: rgba(22, 6, 15, 0.55);
            backdrop-filter: blur(35px);
            -webkit-backdrop-filter: blur(35px);
            border-left: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 25;
        }

        .chat-header {
            padding: 22px 24px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: baseline;
            justify-content: space-between;
        }

        .chat-header h3 {
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.85);
        }

        .chat-header span {
            font-size: 0.72rem;
            color: #ff85a2;
            letter-spacing: 1px;
        }

        .chat-messages {
            flex: 1;
            overflow-y: hidden;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            gap: 12px;
            mask-image: linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
            -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
        }

        .message-item {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 10px 14px;
            border-radius: 14px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 0.86rem;
            line-height: 1.4;
            animation: messageFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .message-item.is-gift {
            background: linear-gradient(135deg, rgba(255, 77, 109, 0.25), rgba(255, 133, 162, 0.12));
            border: 1px solid rgba(255, 105, 135, 0.4);
        }

        .message-item.is-system {
            background: transparent;
            border: 1px dashed rgba(255, 255, 255, 0.12);
            font-size: 0.76rem;
            color: rgba(255, 255, 255, 0.5);
        }

        @keyframes messageFadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .user-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 600;
            flex-shrink: 0;
            color: #fff;
        }

        .msg-content {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .user-name {
            font-size: 0.74rem;
            font-weight: 600;
            color: #ff9ebb;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .msg-text {
            color: rgba(255, 255, 255, 0.95);
            font-weight: 400;
            word-break: break-word;
        }

        .chat-input-bar {
            padding: 16px 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            gap: 12px;
            align-items: center;
            background: rgba(10, 2, 6, 0.5);
        }

        .input-mock {
            flex: 1;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 10px 16px;
            border-radius: 30px;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.45);
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
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(255, 77, 109, 0.4);
        }

        .floating-heart {
            position: absolute;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 99;
            animation: floatHeart 2.6s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
        }

        @keyframes floatHeart {
            0% { transform: translate(0, 0) scale(0.6); opacity: 1; }
            100% { transform: translate(var(--rx), -360px) scale(1.3) rotate(var(--deg)); opacity: 0; }
        }

        /* ================= 提示开场页（嵌入指定背景图与ICON） ================= */
        .notice-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100dvh;
            /* 嵌入指定的 liz.jpg 电影感全屏背景图 */
            background: 
                linear-gradient(rgba(15, 3, 9, 0.75), rgba(15, 3, 9, 0.88)), 
                url('https://hyeri.us.kg/liz.jpg') no-repeat center center / cover;
            z-index: 999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s;
        }

        .notice-overlay.dismissed {
            opacity: 0;
            pointer-events: none;
            transform: scale(1.06);
        }

        .cinematic-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 0 24px;
        }

        /* 提示页指定的 Liz Icon 图标 */
        .notice-avatar-frame {
            width: 88px;
            height: 88px;
            border-radius: 50%;
            padding: 3px;
            background: linear-gradient(135deg, #ff4d6d, #ffb3c1);
            box-shadow: 0 0 25px rgba(255, 77, 109, 0.6);
            margin-bottom: 20px;
            animation: pulseAvatar 3s ease-in-out infinite alternate;
        }

        @keyframes pulseAvatar {
            0% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 77, 109, 0.5); }
            100% { transform: scale(1.05); box-shadow: 0 0 35px rgba(255, 77, 109, 0.8); }
        }

        .notice-avatar-img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            display: block;
        }

        .curtain-sub {
            font-size: 0.75rem;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #ff85a2;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .curtain-title {
            font-family: 'Italiana', serif;
            font-size: clamp(2.4rem, 6vw, 3.8rem);
            font-weight: 400;
            letter-spacing: 2px;
            color: #fff;
            margin-bottom: 20px;
            line-height: 1;
            text-shadow: 0 0 35px rgba(255, 105, 135, 0.4);
        }

        .curtain-notice {
            font-size: 0.92rem;
            color: rgba(255, 255, 255, 0.8);
            letter-spacing: 3px;
            margin-bottom: 40px;
            font-weight: 300;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .curtain-notice::before,
        .curtain-notice::after {
            content: '';
            display: block;
            width: 24px;
            height: 1px;
            background: rgba(255, 255, 255, 0.25);
        }

        .btn-enter-live {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 133, 162, 0.45);
            padding: 14px 40px;
            border-radius: 40px;
            color: #fff;
            font-size: 0.85rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 12px;
            backdrop-filter: blur(12px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .pulse-beacon {
            width: 8px;
            height: 8px;
            background: #ff4d6d;
            border-radius: 50%;
            box-shadow: 0 0 10px #ff4d6d;
            animation: pulseWave 1.8s infinite;
        }

        @keyframes pulseWave {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(2.6); opacity: 0; }
        }

        /* 移动端完美适配（无翻滚条） */
        @media (max-width: 768px) {
            .live-stage { flex-direction: column; }
            .video-section { width: 100vw; height: 100dvh; }
            .chat-section {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100vw;
                max-width: 100vw;
                height: 42dvh;
                background: linear-gradient(to top, rgba(10,2,6,0.92) 0%, rgba(10,2,6,0.35) 70%, rgba(10,2,6,0) 100%);
                border-left: none;
            }
            .chat-header { display: none; }
            .chat-messages { padding: 12px; }
            .message-item { background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(12px); }
        }
    </style>
</head>
<body>

    <!-- 提示页：指定背景图 + 指定头像Icon -->
    <div class="notice-overlay" id="noticeOverlay" onclick="enterCinemaLive()">
        <div class="cinematic-box">
            <!-- 提示文上方显示的专属 Liz Icon -->
            <div class="notice-avatar-frame">
                <img class="notice-avatar-img" src="https://liz.hyeri.us.kg/Background/0a8bf729894a5a79e8dabd3558a3ee58.jpg" alt="Tomato Liz">
            </div>
            
            <span class="curtain-sub">김 지 원</span>
            <h1 class="curtain-title">Tomato Liz</h1>
            <p class="curtain-notice">您将看见可爱小猫</p>
            
            <div class="btn-enter-live">
                <span class="pulse-beacon"></span>
                <span>Enter Live · 开启声音</span>
            </div>
        </div>
    </div>

    <!-- 直播主界面 -->
    <div class="live-stage">
        
        <!-- 左侧：全屏视频舞台 -->
        <main class="video-section">
            <div class="live-top-bar">
                <div class="channel-info">
                    <!-- 左上角头像：嵌入指定 Liz 头像 -->
                    <div class="author-avatar-box">
                        <img class="author-avatar-img" src="https://liz.hyeri.us.kg/Background/0a8bf729894a5a79e8dabd3558a3ee58.jpg" alt="Liz">
                    </div>
                    <div class="author-meta">
                        <span class="author-name">Tomato Liz 🍅</span>
                        <span class="author-sub">지원 · 金志垣</span>
                    </div>
                </div>

                <div class="live-right-badge">
                    <div class="live-pill">
                        <span class="live-dot"></span>
                        <span>LIVE</span>
                    </div>
                    <!-- 1w+ 真实在线浮动 -->
                    <div class="viewers-pill">
                        <span id="viewerCounter">14,260</span>
                    </div>
                </div>
            </div>

            <video 
                id="lizVideo"
                src="https://liz.hyeri.us.kg/Video/liz.mp4" 
                loop 
                playsinline 
                webkit-playsinline
                preload="auto">
            </video>
        </main>

        <!-- 右侧：真实互动直播间 -->
        <aside class="chat-section">
            <div class="chat-header">
                <h3>Live Chat</h3>
                <span>IVE ✕ DIVE</span>
            </div>

            <div class="chat-messages" id="chatBox">
                <!-- 循环弹幕流 -->
            </div>

            <div class="chat-input-bar">
                <div class="input-mock">Send some love to Liz...</div>
                <button class="heart-button" onclick="createHeart(event)">💖</button>
            </div>
        </aside>
    </div>

    <script>
        // 金志垣 粉丝弹幕池 (四国语言真实互动)
        const commentsPool = [
            // 中文 (CN)
            { type: "msg", name: "芝士观察员", text: "小番茄莉兹今天也太甜了吧！！🍅💖", flag: "🇨🇳", bg: "#ff4d6d" },
            { type: "msg", name: "DIVE小桃", text: "天籁主唱！金志垣这个开嗓真的绝了😭", flag: "🇨🇳", bg: "#e76f51" },
            { type: "msg", name: "志垣的小酒窝", text: "小猫咪看镜头了！今天状态满分✨", flag: "🇨🇳", bg: "#ff758f" },
            { type: "msg", name: "IVE安利官", text: "音色流氓金志垣！不愧是实权大主唱🎤", flag: "🇨🇳", bg: "#f4a261" },
            { type: "msg", name: "小番茄狂热粉", text: "多吃点好吃的呀，芝士猫咪不要节食！🍖", flag: "🇨🇳", bg: "#e63946" },
            { type: "gift", text: "🎁 [礼物] 芝士棒 送出 【超级番茄】 x99 🍅" },
            { type: "system", text: "✨ 粉丝 DIVE_九九 带着金志垣专属灯牌进入直播间" },

            // ENGLISH (EN)
            { type: "msg", name: "StarryLiz", text: "TOMATO LIZ IS LITERALLY GLOWING TODAY!! 🍅✨", flag: "🇺🇸", bg: "#2a9d8f" },
            { type: "msg", name: "IVE_Worldwide", text: "Jiwon vocals never miss omg angel voice 😭👑", flag: "🇬🇧", bg: "#264653" },
            { type: "msg", name: "CheeseCatLover", text: "Her dimple is the cutest thing on earth 🐱💕", flag: "🇨🇦", bg: "#e9c46a" },
            { type: "msg", name: "LizSunshine", text: "GREETINGS FROM US DIVES!! WE LOVE YOU LIZ!! 💖🇺🇸", flag: "🇺🇸", bg: "#7209b7" },
            { type: "msg", name: "VocalQueenLiz", text: "SHE LITERALLY ATE CDS FOR BREAKFAST 🎤", flag: "🇦🇺", bg: "#4361ee" },
            { type: "gift", text: "🎁 [Gift] Sarah_US sent 【Pink Crown】 x1 👑" },

            // 韩语 (KR)
            { type: "msg", name: "지원바라기", text: "우리 토마토 리즈 미모 폼 미쳤다 ㅠㅠ 🍅🐱", flag: "🇰🇷", bg: "#9d4edd" },
            { type: "msg", name: "다이브1기", text: "치즈냥이 목소리 실화냐... 음색요정 김지원 사랑해💖", flag: "🇰🇷", bg: "#7b2cbf" },
            { type: "msg", name: "IVE_리즈_최고", text: "오늘 라이브 진짜 레전드다 ㅠㅠ 라이브 너무 잘해 ✨", flag: "🇰🇷", bg: "#5a189a" },
            { type: "msg", name: "골든보이스", text: "지원아 맛있는 거 많이 먹구 항상 행복해야 해!! 🍀", flag: "🇰🇷", bg: "#3c096c" },
            { type: "msg", name: "보조개요정", text: "지원아 오늘 헤메코 진짜 레전드야 너무 천사같아 🪽", flag: "🇰🇷", bg: "#240046" },
            { type: "system", text: "✨ [안내] 서울 다이브 연합님이 라이브에 참여했습니다." },

            // 日语 (JP)
            { type: "msg", name: "リズ推しDIVE", text: "トマトのリズちゃん天使すぎる…可愛くて無理🫠🍅", flag: "🇯🇵", bg: "#f72585" },
            { type: "msg", name: "モモねこ", text: "リズちゃんの歌声、本当に心に染みる🐱🎤✨", flag: "🇯🇵", bg: "#b5179e" },
            { type: "msg", name: "IVEファンJP", text: "日本からいつも応援してます！大好きだよ〜！🇯🇵💖", flag: "🇯🇵", bg: "#7209b7" },
            { type: "msg", name: "えくぼ愛好家", text: "笑顔が眩しすぎて溶けそう…リズしか勝たん！🥰", flag: "🇯🇵", bg: "#480ca8" },
            { type: "msg", name: "チーズにゃんこ", text: "生歌レベチすぎる…さすがIVEのメインボーカル👑", flag: "🇯🇵", bg: "#3a0ca3" }
        ];

        const chatBox = document.getElementById('chatBox');
        let poolIdx = 0;

        // 不间断发射弹幕
        function launchNextChat() {
            const item = commentsPool[poolIdx];
            poolIdx = (poolIdx + 1) % commentsPool.length;

            const msgEl = document.createElement('div');
            if (item.type === "gift") {
                msgEl.className = 'message-item is-gift';
                msgEl.innerHTML = \`<span style="font-weight:600; color:#ffb3c1;">\${item.text}</span>\`;
            } else if (item.type === "system") {
                msgEl.className = 'message-item is-system';
                msgEl.innerHTML = \`<span>\${item.text}</span>\`;
            } else {
                msgEl.className = 'message-item';
                msgEl.innerHTML = \`
                    <div class="user-avatar" style="background:\${item.bg}">\${item.name.slice(0, 1)}</div>
                    <div class="msg-content">
                        <span class="user-name">\${item.flag} \${item.name}</span>
                        <span class="msg-text">\${item.text}</span>
                    </div>
                \`;
            }

            chatBox.appendChild(msgEl);
            if (chatBox.children.length > 8) {
                chatBox.removeChild(chatBox.firstElementChild);
            }

            setTimeout(launchNextChat, Math.floor(Math.random() * 800) + 800);
        }

        // 1w+ 实时动态人数
        let viewers = 14260;
        setInterval(() => {
            viewers += Math.floor(Math.random() * 21) - 9;
            document.getElementById('viewerCounter').innerText = viewers.toLocaleString();
        }, 1800);

        // 浮空点赞爱心
        function createHeart(e) {
            const heart = document.createElement('div');
            const emojis = ['💖', '🍅', '✨', '🐱', '🌸'];
            heart.className = 'floating-heart';
            heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];

            const btn = document.querySelector('.heart-button');
            const rect = btn ? btn.getBoundingClientRect() : { left: window.innerWidth - 60, top: window.innerHeight - 80 };

            heart.style.left = (rect.left + Math.random() * 20 - 10) + 'px';
            heart.style.top = rect.top + 'px';
            heart.style.setProperty('--rx', (Math.random() * 120 - 60) + 'px');
            heart.style.setProperty('--deg', (Math.random() * 60 - 30) + 'deg');

            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 2600);
        }

        // 点击开播解锁音频策略
        let isEntered = false;
        function enterCinemaLive() {
            if (isEntered) return;
            isEntered = true;

            const video = document.getElementById('lizVideo');
            const overlay = document.getElementById('noticeOverlay');

            video.muted = false;
            video.volume = 1.0;
            video.play().catch(() => {
                video.muted = true;
                video.play();
            });

            overlay.classList.add('dismissed');
            launchNextChat();
            setInterval(() => {
                if (Math.random() > 0.3) createHeart();
            }, 900);
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
