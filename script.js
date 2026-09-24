// Screen navigation variables
let showConfetti = false;
let nouvelle, ancienne, pression;

// 🎨 Palette: Custom Reds, Warm Yellows, and Deep Browns
let themeCouleur = [
  '#C62828', '#781D1D', // Reds
  '#FFD54F', '#FFB300', // Yellows
  '#6D4C41', '#4E342E'  // Browns
];

// ==========================================
// 1. ORIGINAL PAGE LOAD ANIMATIONS
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    const envelopeScreen = document.getElementById('screen-envelope');
    const cardImage = document.querySelector('.card-bg');

    setTimeout(() => {
        envelopeScreen.classList.add('animate-in');
    }, 300);

    setTimeout(() => {
        cardImage.classList.add('nodding-card');
    }, 1500); 
});

// ==========================================
// 2. OPEN BUTTON ACTION & ARRIVAL ENGINES
// ==========================================
function openInvitation() {
    // Navigate from /envelop/ to /invitation/
    window.location.href = "../invitation/index.html";
}

// ==========================================
// 🌟 NEW: BI-DIRECTIONAL SCROLL REVEAL TRACKER
// ==========================================
function initBiDirectionalScrollReveal() {
    const targets = document.querySelectorAll('.scroll-reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is rolling into visibility -> Fade In smoothly
                entry.target.classList.add('visible');
            } else {
                // Element is moving out of view -> Fade Out smoothly (Works going up or down)
                // We check boundingClientRect to make sure it only updates when scrolled past
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove('visible');
                }
            }
        });
    };

    // Fine-tune thresholds so elements pop in exactly when they cross into the viewport window
    const options = {
        root: null, 
        threshold: 0.1,
        rootMargin: "-20px 0px -40px 0px"
    };

    const observer = new IntersectionObserver(revealCallback, options);
    targets.forEach(target => observer.observe(target));
}

// ==========================================
// 3. MIXED SPARKLE & SQUARE CONFETTI ENGINE
// ==========================================
class ParticuleMagique {
  constructor(parent) {
    this.parent = parent;
    this.gravite = parent.gravite;
    
    // MIXED TYPES: ~85% tiny sparkles, ~15% classic little squares
    this.typeParticule = random(0, 1) > 0.85 ? 'carre' : 'etoile';
    
    this.initParticule();
  }
  
  initParticule() {
    // SPREAD ADJUSTMENT: Widened horizontal spawn zone beyond edge boundaries (-60px to width + 60px)
    // DISTANCE ADJUSTMENT: Deeply staggered vertical heights (up to -900px) creates clean separation between elements
    this.position = createVector(random(-60, width + 60), random(-40, -900));
    
    // Perfect slow, lazy falling drift parameters calibrated for a 6-second lifespan
    this.velocite = createVector(random(-0.4, 0.4), random(0.8, 1.4));
    this.friction = 0.992; 
    
    // Individual sizing configurations
    if (this.typeParticule === 'carre') {
      this.taille = random(6, 10); 
    } else {
      this.taille = random(3, 7);  
    }
    
    // Twinkling, rotation, and sway tracking offsets
    this.priseAngle = random(0, TWO_PI);
    this.priseVitesse = random(0.01, 0.04); 
    this.rotationInitiale = random(0, TWO_PI);
    this.vitesseRotation = random(-0.04, 0.04);
    
    this.couleurBase = color(random(themeCouleur));
  }
  
  dessiner() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotationInitiale);
    noStroke();
    fill(this.couleurBase);

    if (this.typeParticule === 'carre') {
      let etapeFlipping = Math.sin(this.priseAngle);
      scale(1, etapeFlipping);
      rect(-this.taille / 2, -this.taille / 2, this.taille, this.taille);
    } else {
      let oscillationTaille = this.taille * (0.6 + Math.cos(this.priseAngle) * 0.4);
      
      beginShape();
      vertex(0, -oscillationTaille);
      vertex(oscillationTaille * 0.25, -oscillationTaille * 0.25);
      vertex(oscillationTaille, 0);
      vertex(oscillationTaille * 0.25, oscillationTaille * 0.25);
      vertex(0, oscillationTaille);
      vertex(-oscillationTaille * 0.25, oscillationTaille * 0.25);
      vertex(-oscillationTaille, 0);
      vertex(-oscillationTaille * 0.25, -oscillationTaille * 0.25);
      endShape(CLOSE);
    }
    
    this.priseAngle += this.priseVitesse;
    this.rotationInitiale += this.vitesseRotation;
    
    pop();
  }
  
  integration() {
    this.velocite.add(this.gravite);
    
    // Gentle horizontal air drift sway
    this.position.x += Math.sin(this.priseAngle) * 0.3;
    
    this.velocite.mult(this.friction);
    this.position.add(this.velocite);
  }
  
  rendu() {
    this.integration();
    this.dessiner();
  }
}

class SystemeDeConfettis {
  constructor(nombreMax) {
    this.nombreMax = nombreMax;
    this.gravite = createVector(0, 0.015); 
    this.particules = [];
    
    for (let i = 0; i < this.nombreMax; i++) {
      this.particules.push(new ParticuleMagique(this));
    }
  }
  
  rendu() {
    if (pression) {
      this.gravite.x = (mouseX - pmouseX) / 60;
    }
    this.particules.forEach(p => p.rendu());
  }
}

let systemeGlobal;
let tempsDebutAnimation;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  systemeGlobal = new SystemeDeConfettis(180);
}

function draw() {
  clear(); 
  
  if (showConfetti) {
    if (!tempsDebutAnimation) {
      tempsDebutAnimation = millis();
    }
    
    if (millis() - tempsDebutAnimation < 17000) {
      systemeGlobal.rendu();
    } else {
      showConfetti = false;
      clear(); 
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if (showConfetti) pression = true;
}

function mouseReleased() {
  pression = false;
  systemeGlobal.gravite.x = 0;
}