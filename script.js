/* =========================================================
   WEDDING INVITATION INTERACTIONS
========================================================= */

gsap.registerPlugin(ScrollTrigger);

/* Hero entrance */
const heroTimeline = gsap.timeline();
heroTimeline.from(".falling-hero-art", {
    opacity: 0,
    y: () => -Math.min(window.innerHeight * 0.65, 700),
    rotation: -2,
    duration: 2.2,
    ease: "bounce.out"
}).from(".scroll-indicator", {
    opacity: 0,
    y: 20,
    duration: 0.6
}, "-=0.35");

/* General reveals */
gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.fromTo(element,
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
});

gsap.utils.toArray(".reveal-left").forEach((element) => {
    gsap.fromTo(element,
        { opacity: 0, x: -70 },
        {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
});

gsap.utils.toArray(".reveal-right").forEach((element) => {
    gsap.fromTo(element,
        { opacity: 0, x: 70 },
        {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
});

/* Subtle hero parallax */
gsap.to(".hero-content", {
    y: -60,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

/* =========================================================
   COUNTDOWN — 11 OCTOBER 2026
========================================================= */

const countdownTarget = new Date("2026-10-11T00:00:00+05:30").getTime();
const countdownElements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
};

function updateCountdown() {
    const remaining = countdownTarget - Date.now();

    if (remaining <= 0) {
        countdownElements.days.textContent = "00";
        countdownElements.hours.textContent = "00";
        countdownElements.minutes.textContent = "00";
        countdownElements.seconds.textContent = "00";
        return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownElements.days.textContent = String(days).padStart(2, "0");
    countdownElements.hours.textContent = String(hours).padStart(2, "0");
    countdownElements.minutes.textContent = String(minutes).padStart(2, "0");
    countdownElements.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================================================
   FORMAL INVITATION — ENVELOPE / LETTER REVEAL
========================================================= */

const invitationArtArea = document.getElementById("invitationArtArea");
const invitationArrow = document.getElementById("invitationArrow");
const envelopeHint = document.getElementById("envelopeHint");
let invitationOpened = false;

function toggleInvitationReveal() {
    invitationOpened = !invitationOpened;
    invitationArtArea.classList.toggle("open", invitationOpened);
    invitationArrow.setAttribute("aria-expanded", String(invitationOpened));
    invitationArrow.setAttribute(
        "aria-label",
        invitationOpened ? "Hide the invitation letter" : "Reveal the invitation letter"
    );
    if (envelopeHint) {
        envelopeHint.textContent = invitationOpened
            ? "Your invitation awaits"
            : "Tap the arrow to reveal your invitation";
    }
}

if (invitationArrow) {
    invitationArrow.addEventListener("click", toggleInvitationReveal);
}

/* =========================================================
   OUR SOUNDTRACK — TILDA-STYLE PLAYER
========================================================= */

const tildaMusicButton = document.getElementById("tildaMusicButton");
const tildaMusicImage = document.getElementById("tildaMusicImage");
const weddingSong = document.getElementById("weddingSong");
const musicStatus = document.getElementById("musicStatus");

function updateMusicUI() {
    if (!tildaMusicButton || !tildaMusicImage || !weddingSong) return;

    const isPlaying = !weddingSong.paused && !weddingSong.ended;
    tildaMusicImage.classList.toggle("playing", isPlaying);
    tildaMusicButton.classList.toggle("is-playing", isPlaying);
    tildaMusicButton.setAttribute("aria-pressed", String(isPlaying));
    tildaMusicButton.setAttribute("aria-label", isPlaying ? "Pause wedding song" : "Play wedding song");

    if (musicStatus) {
        musicStatus.textContent = isPlaying ? "NOW PLAYING" : "TAP TO PLAY";
    }
}

if (tildaMusicButton && weddingSong) {
    tildaMusicButton.addEventListener("click", async () => {
        try {
            if (weddingSong.paused) {
                await weddingSong.play();
            } else {
                weddingSong.pause();
            }
        } catch (error) {
            // Playback can be blocked by browser policy; keep the UI stable.
        }
        updateMusicUI();
    });

    weddingSong.addEventListener("play", updateMusicUI);
    weddingSong.addEventListener("pause", updateMusicUI);
    weddingSong.addEventListener("ended", updateMusicUI);
    updateMusicUI();
}

/* =========================================================
   COLLEGE PHOTO + VIDEO SLIDESHOW
========================================================= */

const slides = document.querySelectorAll(".slide");
const slideCurrent = document.getElementById("slideCurrent");
let currentSlide = 0;

function playActiveSlideVideo() {
    slides.forEach((slide, index) => {
        const video = slide.querySelector("video");
        if (!video) return;

        if (index === currentSlide) {
            video.currentTime = 0;
            const promise = video.play();
            if (promise) promise.catch(() => {});
        } else {
            video.pause();
            video.currentTime = 0;
        }
    });
}

function changeSlide() {
    if (!slides.length) return;

    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");

    if (slideCurrent) {
        slideCurrent.textContent = String(currentSlide + 1).padStart(2, "0");
    }

    playActiveSlideVideo();
}

if (slides.length > 1) {
    setInterval(changeSlide, 4500);
    playActiveSlideVideo();
}

/* =========================================================
   CONFETTI — CHERRY RED / BROWN / PASTEL PINK
========================================================= */

const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let confettiPieces = [];

const confettiColors = [
    "#941f2d",
    "#c69e96",
    "#a23442",
    "#6a3d41",
    "#e1e8c3",
    "#762d21"
];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createConfetti() {
    confettiPieces = [];

    for (let i = 0; i < 55; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: -Math.random() * canvas.height,
            width: Math.random() * 7 + 3,
            height: Math.random() * 12 + 5,
            speed: Math.random() * 0.75 + 0.35,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 1.5 - 0.75,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            opacity: Math.random() * 0.38 + 0.12
        });
    }
}

function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((piece) => {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation * Math.PI / 180);
        ctx.globalAlpha = piece.opacity;
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        ctx.restore();
    });
}

function animateConfetti() {
    confettiPieces.forEach((piece) => {
        piece.y += piece.speed;
        piece.x += Math.sin(piece.y * 0.01) * 0.25;
        piece.rotation += piece.rotationSpeed;

        if (piece.y > canvas.height + 30) {
            piece.y = -30;
            piece.x = Math.random() * canvas.width;
        }
    });

    drawConfetti();
    requestAnimationFrame(animateConfetti);
}

createConfetti();
animateConfetti();

/* =========================================================
   IMAGE PARALLAX
========================================================= */

gsap.utils.toArray(".note-image img").forEach((image) => {
    gsap.to(image, {
        y: -25,
        ease: "none",
        scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

/* =========================================================
   VIDEO BEHAVIOUR
   Pause other videos when one starts.
========================================================= */

const videos = document.querySelectorAll(".wedding-video, .slide-video video");

videos.forEach((video) => {
    video.addEventListener("play", () => {
        videos.forEach((otherVideo) => {
            if (otherVideo !== video) otherVideo.pause();
        });
    });
});
