/* ======================================================
   SRI GANESHOTSAV INVITATION - BHOIR FAMILY, URAN
   JAVASCRIPT CONTROLLER
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Web Audio API Context for Chimes & Bell Sounds
    let audioCtx = null;

    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Synthesize Temple Bell / Chime sound dynamically
    window.playBellSound = function () {
        initAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now); // A5 note
        osc.frequency.exponentialRampToValueAtTime(440, now + 1.2);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 1.5);

        // Visual wobble effect on bells
        const bells = document.querySelectorAll('.bell');
        bells.forEach(b => {
            b.classList.add('bell-ring');
            setTimeout(() => b.classList.remove('bell-ring'), 600);
        });
    };

    // ------------------------------------------------------
    // 1. DOOR OPENING LOGIC
    // ------------------------------------------------------
    const doorOverlay = document.getElementById('doorOverlay');
    const doorSeal = document.getElementById('doorSeal');
    const bgMusic = document.getElementById('bgMusic');
    const audioToggle = document.getElementById('audioToggle');
    let isMusicPlaying = false;

    function openTempleDoor() {
        if (doorOverlay.classList.contains('opened')) return;

        initAudioContext();
        playBellSound();

        doorOverlay.classList.add('opened');

        // Play Background Music
        if (bgMusic) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                audioToggle.classList.remove('muted');
            }).catch(e => {
                console.log('Audio autoplay prevented by browser policy:', e);
                audioToggle.classList.add('muted');
            });
        }

        // Trigger welcome confetti burst
        if (typeof confetti === 'function') {
            setTimeout(() => {
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FFD700', '#FF8C00', '#FF4500', '#FFFFFF']
                });
            }, 600);
        }
    }

    if (doorSeal) {
        doorSeal.addEventListener('click', openTempleDoor);
    }
    if (doorOverlay) {
        doorOverlay.addEventListener('click', (e) => {
            if (e.target.closest('.door-center-seal') || e.target.classList.contains('door-pattern') || e.target.classList.contains('door')) {
                openTempleDoor();
            }
        });
    }

    // Audio Mute/Unmute Toggle
    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            if (!bgMusic) return;
            if (isMusicPlaying) {
                bgMusic.pause();
                isMusicPlaying = false;
                audioToggle.classList.add('muted');
            } else {
                bgMusic.play();
                isMusicPlaying = true;
                audioToggle.classList.remove('muted');
            }
        });
    }

    // ------------------------------------------------------
    // 2. BAPPA BLESSINGS INTERACTION
    // ------------------------------------------------------
    const bappaCard = document.getElementById('bappaIdolCard');
    const blessingModal = document.getElementById('blessingModal');
    const blessingQuoteText = document.getElementById('blessingQuoteText');

    const bappaBlessings = [
        "\"श्रींच्या आगमनाने तुमच्या घरात सुख, शांती आणि अखंड समृद्धी नांदो!\"",
        "\"गणपती बाप्पा मोरया! तुमच्या सर्व मनोकामना व संकल्प पूर्ण होवोत!\"",
        "\"बाप्पाचे मंगल आशीर्वाद सदैव तुमच्या पाठीशी राहोत. विघ्नहर्त्याचा वरदहस्त लाभो!\"",
        "\"तुमच्या आयुष्यातील सर्व विघ्नांचे हरण होवो आणि यशाची नवी पहाट उोगवो!\"",
        "\"बाप्पाच्या आगमनाची ओढ आणि भोईर परिवाराचे आपणास मनापासून सस्नेह निमंत्रण!\""
    ];

    if (bappaCard) {
        bappaCard.addEventListener('click', () => {
            playBellSound();

            // Random blessing selection
            const randomBlessing = bappaBlessings[Math.floor(Math.random() * bappaBlessings.length)];
            if (blessingQuoteText) {
                blessingQuoteText.textContent = randomBlessing;
            }

            openModal('blessingModal');

            // Festive flower confetti burst
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#FFD700', '#FF6B00']
                });
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#FFD700', '#FF6B00']
                });
            }
        });
    }



    // ------------------------------------------------------
    // 4. MODALS & RSVP FORM LOGIC
    // ------------------------------------------------------
    window.openModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    };

    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    };

    const openWishesBtn = document.getElementById('openWishesModal');
    if (openWishesBtn) {
        openWishesBtn.addEventListener('click', () => openModal('wishesModal'));
    }

    // Wishes LocalStorage Management
    const wishesForm = document.getElementById('wishesForm');
    const wishesDisplaySec = document.getElementById('wishesDisplaySec');
    const wishesGrid = document.getElementById('wishesGrid');

    function loadWishes() {
        const wishes = JSON.parse(localStorage.getItem('bhoir_ganpati_wishes') || '[]');
        if (wishes.length > 0) {
            wishesDisplaySec.style.display = 'block';
            wishesGrid.innerHTML = wishes.map(w => `
                <div class="wish-card">
                    <h4><i class="fa-solid fa-user-check"></i> ${escapeHtml(w.name)}</h4>
                    <p>"${escapeHtml(w.wish)}"</p>
                </div>
            `).join('');
        }
    }

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, function (m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
        });
    }

    if (wishesForm) {
        wishesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('guestName').value.trim();
            const wish = document.getElementById('guestWish').value.trim();

            if (name && wish) {
                const existing = JSON.parse(localStorage.getItem('bhoir_ganpati_wishes') || '[]');
                existing.unshift({ name, wish });
                localStorage.setItem('bhoir_ganpati_wishes', JSON.stringify(existing));

                closeModal('wishesModal');
                wishesForm.reset();
                loadWishes();

                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
                alert('आपल्या शुभेच्छांचा स्वीकार झाला आहे! धन्यवाद.');
            }
        });
    }

    loadWishes();

    // ------------------------------------------------------
    // 5. SHARE INVITATION VIA WHATSAPP / WEB SHARE
    // ------------------------------------------------------
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const shareText = `॥ श्री गणेशाय नम: ॥\n\nभोईर परिवाराकडून श्री गणेशोत्सवाचे सस्नेह निमंत्रण!\n\n📅 उत्सव कालावधी: १४ सप्टेंबर ते १९ सप्टेंबर\n🌸 १८ सप्टेंबर: श्री गौरी आगमन व पूजन\n📍 स्थळ: भोईर निवास, बाळई, गंगा विहीरीजवळ, उरण, नवी मुंबई ४००७०२, महाराष्ट्र.\n\nबाप्पाच्या व गौरीच्या आगमनाच्या पूजेसाठी आपण सहकुटुंब उपस्थित राहावे ही नम्र विनंती!\n\nआमंत्रण पत्रिका पहा: `;
            const shareUrl = window.location.href;

            if (navigator.share) {
                navigator.share({
                    title: 'भोईर परिवार गणेशोत्सव निमंत्रण',
                    text: shareText,
                    url: shareUrl
                }).catch(() => { });
            } else {
                const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + shareUrl)}`;
                window.open(whatsappUrl, '_blank');
            }
        });
    }

    // ------------------------------------------------------
    // 6. CANVAS FLOATING FLOWER PETALS EFFECT
    // ------------------------------------------------------
    const canvas = document.getElementById('petalCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const petals = [];
        const petalColors = ['#FFD700', '#FF8C00', '#FFA500', '#FF4500', '#E63946'];

        for (let i = 0; i < 25; i++) {
            petals.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 8 + 4,
                speedY: Math.random() * 1.5 + 0.8,
                speedX: Math.random() * 1 - 0.5,
                color: petalColors[Math.floor(Math.random() * petalColors.length)],
                rotation: Math.random() * 360,
                rotSpeed: Math.random() * 2 - 1
            });
        }

        function animatePetals() {
            ctx.clearRect(0, 0, width, height);

            petals.forEach(p => {
                p.y += p.speedY;
                p.x += Math.sin(p.y * 0.01) + p.speedX;
                p.rotation += p.rotSpeed;

                if (p.y > height) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.7;

                // Draw petal oval shape
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.restore();
            });

            requestAnimationFrame(animatePetals);
        }

        animatePetals();
    }
});
