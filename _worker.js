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
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
            -webkit-user-select: none;
        }

        :root {
            --pink-primary: #ff4d6d;
            --pink-glow: #ff758f;
            --pink-soft: #ffeef2;
        }

        /* 绝对禁止页面任何方向滚动 */
        html, body {
            height: 100vh;
            height: 100dvh;
            width: 100vw;
            overflow: hidden;
            overscroll-behavior: none;
            background: #12030a;
            font-family: 'Outfit', 'Noto Sans SC', 'Noto Sans KR', 'Noto Sans JP', sans-serif;
            color: #fff;
        }

        /* 主视口双栏布局 */
        .live-stage {
            display: flex;
            width: 100vw;
            height: 100dvh;
            position: relative;
            z-index: 10;
        }

        /* ================= 左侧：大屏视频直播广播 ================= */
        .video-section {
            flex: 1;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            background: radial-gradient(circle at center, rgba(255, 105, 135, 0.25) 0%, rgba(18, 3, 10, 0.95) 75%);
            overflow: hidden;
        }

        /* 顶部悬浮直播状态条 */
        .live-top-bar {
            position: absolute;
            top: env(safe-area-inset-top, 20px);
            left: 20px;
            right: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 30;
            pointer-events: none;
        }

        .channel-info {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 5px 14px 5px 6px;
            border-radius: 30px;
        }

        .author-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff758f, #ffb3c1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            border: 1.5px solid #fff;
        }

        .author-meta {
            display: flex;
            flex-direction: column;
        }

        .author-name {
            font-size: 0.85rem;
            font-weight: 700;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .author-sub {
            font-size: 0.65rem;
            color: #ff9ebb;
        }

        /* 右上角 1w+ 人数动态区域 */
        .live-right-badge {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .live-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: linear-gradient(135deg, #ff1e56, #ff4d6d);
            padding: 5px 12px;
            border-radius: 20px;
            font-weight: 800;
            font-size: 0.75rem;
            letter-spacing: 1px;
            box-shadow: 0 4px 15px rgba(255, 30, 86, 0.5);
        }

        .live-dot {
            width: 7px;
            height: 7px;
            background: #fff;
            border-radius: 50%;
            animation: blink 0.9s infinite alternate;
        }

        @keyframes blink {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0.2; transform: scale(0.7); }
        }

        .viewers-badge {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.82rem;
            font-weight: 700;
            color: #ffb8ca;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 0 35px rgba(255, 77, 109, 0.25));
        }

        /* ================= 右侧：仿真弹幕互动区 ================= */
        .chat-section {
            width: 400px;
            max-width: 36vw;
            height: 100dvh;
            background: rgba(255, 235, 240, 0.08);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border-left: 1.5px solid rgba(255, 255, 255, 0.15);
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 25;
            box-shadow: -15px 0 40px rgba(0, 0, 0, 0.4);
        }

        .chat-header {
            padding: 18px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .chat-header h3 {
            font-size: 0.95rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #ff99b0;
        }

        .chat-tag {
            font-size: 0.7rem;
            background: rgba(255, 77, 109, 0.25);
            padding: 3px 10px;
            border-radius: 12px;
            color: #ffb3c1;
            font-weight: 600;
            border: 1px solid rgba(255, 77, 109, 0.4);
        }

        /* 弹幕流主体：向上平滑顶出 */
        .chat-messages {
            flex: 1;
            overflow-y: hidden;
            padding: 16px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            gap: 10px;
            mask-image: linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
            -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
        }

        .message-item {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.16);
            padding: 9px 13px;
            border-radius: 16px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 0.88rem;
            line-height: 1.35;
            animation: popIn 0.35s cubic-bezier(0.2, 1, 0.3, 1) forwards;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* 礼物消息高亮 */
        .message-item.is-gift {
            background: linear-gradient(135deg, rgba(255, 77, 109, 0.35), rgba(255, 182, 193, 0.2));
            border: 1px solid rgba(255, 105, 135, 0.6);
        }

        /* 系统消息轻量化 */
        .message-item.is-system {
            background: rgba(0, 0, 0, 0.25);
            border: 1px dashed rgba(255, 255, 255, 0.2);
            font-size: 0.78rem;
            color: #ffd1dc;
        }

        @keyframes popIn {
            from { opacity: 0; transform: translateY(20px) scale(0.92); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .user-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 700;
            flex-shrink: 0;
            color: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        }

        .msg-content {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .user-meta-line {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .user-badge {
            font-size: 0.6rem;
            padding: 1px 6px;
            border-radius: 8px;
            background: rgba(255, 77, 109, 0.5);
            font-weight: 700;
            color: #fff;
        }

        .user-name {
            font-size: 0.75rem;
            font-weight: 600;
            color: #ffb8ca;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .msg-text {
            color: #ffffff;
            font-weight: 400;
            word-break: break-word;
        }

        /* 底部互动输入条 */
        .chat-input-bar {
            padding: 14px 18px;
            border-top: 1px solid rgba(255, 255, 255, 0.12);
            display: flex;
            gap: 10px;
            align-items: center;
            background: rgba(0, 0, 0, 0.25);
        }

        .input-mock {
            flex: 1;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.25);
            padding: 10px 16px;
            border-radius: 25px;
            font-size: 0.82rem;
            color: rgba(255, 255, 255, 0.65);
        }

        .heart-button {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff4d6d, #ff758f);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 77, 109, 0.5);
            animation: pulseBtn 1.6s infinite;
        }

        @keyframes pulseBtn {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); box-shadow: 0 6px 20px rgba(255, 77, 109, 0.7); }
            100% { transform: scale(1); }
        }

        /* 漫天飘荡的粉色爱心与番茄 */
        .floating-heart {
            position: absolute;
            font-size: 1.6rem;
            pointer-events: none;
            z-index: 99;
            animation: floatHeart 2.8s ease-out forwards;
        }

        @keyframes floatHeart {
            0% { transform: translate(0, 0) scale(0.5) rotate(0deg); opacity: 1; }
            100% { transform: translate(var(--rx), -380px) scale(1.4) rotate(var(--deg)); opacity: 0; }
        }

        /* ================= 提示框 Notice（入场卡片） ================= */
        .notice-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100dvh;
            background: linear-gradient(135deg, rgba(255, 175, 189, 0.97) 0%, rgba(255, 107, 139, 0.97) 100%);
            backdrop-filter: blur(35px);
            -webkit-backdrop-filter: blur(35px);
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
            transform: scale(1.1);
            pointer-events: none;
        }

        .notice-card {
            background: rgba(255, 255, 255, 0.88);
            padding: 40px 32px;
            border-radius: 36px;
            text-align: center;
            max-width: 86vw;
            width: 380px;
            box-shadow: 0 25px 65px rgba(231, 84, 128, 0.35), 0 0 0 1.5px rgba(255, 255, 255, 0.95) inset;
        }

        .cat-badge {
            font-size: 3.8rem;
            margin-bottom: 6px;
            filter: drop-shadow(0 6px 12px rgba(255, 77, 109, 0.35));
        }

        .notice-title {
            font-size: 1.4rem;
            font-weight: 800;
            color: #5c1b2f;
            margin-bottom: 6px;
        }

        .notice-desc {
            font-size: 0.98rem;
            color: #8c3851;
            margin-bottom: 26px;
            line-height: 1.5;
        }

        .btn-join {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #ff4d6d, #ff758f);
            color: #fff;
            font-size: 1.02rem;
            font-weight: 700;
            padding: 14px 34px;
            border-radius: 50px;
            box-shadow: 0 8px 25px rgba(255, 77, 109, 0.45);
            border: none;
        }

        /* 移动端完美适配（悬浮半屏透明弹幕） */
        @media (max-width: 768px) {
            .live-stage { flex-direction: column; }
            .video-section { width: 100vw; height: 100dvh; }
            .chat-section {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100vw;
                max-width: 100vw;
                height: 44dvh;
                background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%);
                border-left: none;
                box-shadow: none;
            }
            .chat-header { display: none; }
            .chat-messages { padding: 12px; }
            .message-item { background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(12px); }
        }
    </style>
</head>
<body>

    <!-- 交互提示蒙层：一键破除浏览器无声拦截 -->
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

    <!-- 直播主界面 -->
    <div class="live-stage">
        
        <!-- 左侧：全屏视频广播 -->
        <main class="video-section">
            <div class="live-top-bar">
                <div class="channel-info">
                    <div class="author-avatar">🐱</div>
                    <div class="author-meta">
                        <span class="author-name">Tomato Liz 🍅</span>
                        <span class="author-sub">IVE · 金智媛</span>
                    </div>
                </div>

                <div class="live-right-badge">
                    <div class="live-badge">
                        <span class="live-dot"></span>
                        <span>LIVE</span>
                    </div>
                    <!-- 动态1w+人数 -->
                    <div class="viewers-badge">
                        <span>👁️</span>
                        <span id="viewerCount">14,382</span>
                    </div>
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

        <!-- 右侧：仿真粉丝多语言弹幕室 -->
        <aside class="chat-section">
            <div class="chat-header">
                <h3><span>💬</span> 粉丝互动区 (Live Chat)</h3>
                <span class="chat-tag">IVE · DIVE</span>
            </div>

            <div class="chat-messages" id="chatBox">
                <!-- 弹幕动态循环插入 -->
            </div>

            <div class="chat-input-bar">
                <div class="input-mock">给小猫咪 Liz 发送弹幕... 💕</div>
                <button class="heart-button" onclick="createHeart(event)">💖</button>
            </div>
        </aside>
    </div>

    <script>
        // 超大 4 国语言仿真弹幕库 (40+条丰富互动)
        const commentsPool = [
            // 中文 (CN)
            { type: "msg", badge: "DIVE ★", name: "芝士小猫观察员", text: "小番茄莉兹今天也太甜了吧！！🍅💖", flag: "🇨🇳", bg: "#ff4d6d" },
            { type: "msg", badge: "VIP 💎", name: "DIVE小桃", text: "天籁主唱！这个金发大酒窝生唱真的杀疯了😭", flag: "🇨🇳", bg: "#f77f00" },
            { type: "msg", badge: "FAN 🍅", name: "秋天的小酒窝", text: "小猫咪看我看我！今天状态超好呀✨", flag: "🇨🇳", bg: "#ff758f" },
            { type: "msg", badge: "DIVE ★", name: "IVE主唱安利官", text: "音色流氓金智媛！不愧是四代唯一王牌大主唱🎤", flag: "🇨🇳", bg: "#fcbf49" },
            { type: "msg", badge: "FAN 🍅", name: "莉兹的微笑", text: "救命，被这个镜头击中心脏了…太可爱啦呜呜呜🫠", flag: "🇨🇳", bg: "#e63946" },
            { type: "msg", badge: "VIP 💎", name: "芒果班戟", text: "多吃点好吃的呀，芝士猫咪不要减肥！🍖🍚", flag: "🇨🇳", bg: "#d62828" },
            { type: "gift", text: "🎁 [礼物] 芝士脆脆棒 送出了 【超级番茄】 x99 🍅🍅" },
            { type: "system", text: "✨ [系统] 粉丝 DIVE_九九 带着粉丝牌加入了直播间" },

            // ENGLISH (EN)
            { type: "msg", badge: "DIVE ★", name: "StarryLiz", text: "TOMATO LIZ IS LITERALLY GLOWING TODAY!! 🍅✨", flag: "🇺🇸", bg: "#06d6a0" },
            { type: "msg", badge: "VIP 💎", name: "IVE_Worldwide", text: "HER VOCALS NEVER MISS OMG QUEEN 😭👑", flag: "🇬🇧", bg: "#118ab2" },
            { type: "msg", badge: "FAN 🍅", name: "CheeseCatLover", text: "Her dimple is the cutest thing on earth 🐱💕", flag: "🇨🇦", bg: "#073b4c" },
            { type: "msg", badge: "DIVE ★", name: "LizSunshine", text: "GREETINGS FROM US DIVES!! WE LOVE YOU LIZ!! 💖🇺🇸", flag: "🇺🇸", bg: "#8338ec" },
            { type: "msg", badge: "FAN 🍅", name: "VocalGodLiz", text: "SHE LITERALLY ATE CDS FOR BREAKFAST 🎤✨", flag: "🇦🇺", bg: "#3a86ff" },
            { type: "msg", badge: "VIP 💎", name: "KpopEnjoyer", text: "Best 4th gen main vocal hands down! period.", flag: "🇬🇧", bg: "#ff006e" },
            { type: "gift", text: "🎁 [Gift] Sarah_US sent 【Pink Crown】 x1 👑💖" },

            // 韩语 (KR)
            { type: "msg", badge: "DIVE ★", name: "지원바라기", text: "우리 토마토 리즈 미모 폼 미쳤다 ㅠㅠ 🍅🐱", flag: "🇰🇷", bg: "#b5179e" },
            { type: "msg", badge: "VIP 💎", name: "다이브1기", text: "치즈냥이 목소리 실화냐... 음색요정 김지원 사랑해💖", flag: "🇰🇷", bg: "#7209b7" },
            { type: "msg", badge: "DIVE ★", name: "IVE_리즈_최고", text: "오늘 라이브 진짜 레전드다 ㅠㅠ 라이브 왜 이렇게 잘해 ✨", flag: "🇰🇷", bg: "#560bad" },
            { type: "msg", badge: "FAN 🍅", name: "골든보이스", text: "리즈야 맛있는 거 많이 먹구 항상 행복해야 해!! 🍀", flag: "🇰🇷", bg: "#480ca8" },
            { type: "msg", badge: "DIVE ★", name: "보조개요정", text: "지원아 오늘 헤메코 진짜 레전드야 너무 천사같아 🪽", flag: "🇰🇷", bg: "#3f37c9" },
            { type: "msg", badge: "VIP 💎", name: "치즈덕후", text: "우리 냥이 하고 싶은 거 다 해!! 평생 노래해줘 🎤", flag: "🇰🇷", bg: "#4361ee" },
            { type: "system", text: "✨ [안내] 서울 다이브 연합님이 라이브에 참여했습니다." },

            // 日语 (JP)
            { type: "msg", badge: "DIVE ★", name: "リズ推しDIVE", text: "トマトのリズちゃん天使すぎる…可愛くて無理🫠🍅", flag: "🇯🇵", bg: "#f72585" },
            { type: "msg", badge: "VIP 💎", name: "モモねこ", text: "リズちゃんの歌声、本当に心に染みる🐱🎤✨", flag: "🇯🇵", bg: "#b5179e" },
            { type: "msg", badge: "FAN 🍅", name: "IVEファンJP", text: "日本からいつも応援してます！大好きだよ〜！🇯🇵💖", flag: "🇯🇵", bg: "#7209b7" },
            { type: "msg", badge: "DIVE ★", name: "えくぼ愛好家", text: "笑顔が眩しすぎて溶けそう…リズしか勝たん！🥰", flag: "🇯🇵", bg: "#480ca8" },
            { type: "msg", badge: "VIP 💎", name: "チーズにゃんこ", text: "生歌レベチすぎる…さすがIVEのメインボーカル👑", flag: "🇯🇵", bg: "#3a0ca3" }
        ];

        const chatBox = document.getElementById('chatBox');
        let msgIndex = 0;

        // 弹幕不间断无限循环发生器
        function pushNextMessage() {
            const item = commentsPool[msgIndex];
            // 无限循环游标
            msgIndex = (msgIndex + 1) % commentsPool.length;

            const msgEl = document.createElement('div');
            
            if (item.type === "gift") {
                msgEl.className = 'message-item is-gift';
                msgEl.innerHTML = \`<span style="font-weight:600; color:#fff;">\${item.text}</span>\`;
            } else if (item.type === "system") {
                msgEl.className = 'message-item is-system';
                msgEl.innerHTML = \`<span>\${item.text}</span>\`;
            } else {
                msgEl.className = 'message-item';
                msgEl.innerHTML = \`
                    <div class="user-avatar" style="background:\${item.bg}">\${item.name.slice(0, 1)}</div>
                    <div class="msg-content">
                        <div class="user-meta-line">
                            <span class="user-badge">\${item.badge}</span>
                            <span class="user-name">\${item.flag} \${item.name}</span>
                        </div>
                        <span class="msg-text">\${item.text}</span>
                    </div>
                \`;
            }

            chatBox.appendChild(msgEl);

            // 保持最新 8 条，绝不出滚动条，顶掉老弹幕
            if (chatBox.children.length > 8) {
                chatBox.removeChild(chatBox.firstElementChild);
            }

            // 随机 0.8s ~ 1.6s 下一次弹幕，模拟真实网络参差感
            const nextTime = Math.floor(Math.random() * 800) + 800;
            setTimeout(pushNextMessage, nextTime);
        }

        // 右上角 1w+ 在线人数真实浮动模拟
        let currentViewers = 14382;
        setInterval(() => {
            const delta = Math.floor(Math.random() * 25) - 10; // -10 ~ +15 波动
            currentViewers += delta;
            document.getElementById('viewerCount').innerText = currentViewers.toLocaleString();
        }, 1500);

        // 点赞浮空爱心 / 番茄特效
        function createHeart(e) {
            const heart = document.createElement('div');
            const icons = ['💖', '🍅', '✨', '🐱', '🌸', '🧀', '🍓', '❤️'];
            heart.className = 'floating-heart';
            heart.innerText = icons[Math.floor(Math.random() * icons.length)];
            
            const btn = document.querySelector('.heart-button');
            const rect = btn ? btn.getBoundingClientRect() : { left: window.innerWidth - 60, top: window.innerHeight - 80 };
            
            heart.style.left = (rect.left + Math.random() * 24 - 10) + 'px';
            heart.style.top = rect.top + 'px';
            heart.style.setProperty('--rx', (Math.random() * 140 - 70) + 'px');
            heart.style.setProperty('--deg', (Math.random() * 70 - 35) + 'deg');

            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 2800);
        }

        // 核心进入逻辑：点击打破静音策略，进入现场
        let hasEntered = false;
        function enterLizLive() {
            if (hasEntered) return;
            hasEntered = true;

            const video = document.getElementById('lizVideo');
            const overlay = document.getElementById('noticeOverlay');

            // 满音量起播
            video.muted = false;
            video.volume = 1.0;
            video.play().catch(() => {
                video.muted = true;
                video.play();
            });

            overlay.classList.add('dismissed');

            // 启动无限循环弹幕系统
            pushNextMessage();

            // 模拟全网粉丝自动狂刷爱心
            setInterval(() => {
                if (Math.random() > 0.3) createHeart();
            }, 800);
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
