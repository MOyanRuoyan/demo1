(function() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    const trailParticles = [];

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        
        for (let i = 0; i < 2; i++) {
            createTrailParticle(mouseX, mouseY);
        }
    });

    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'drag-trail';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const hue = 150 + Math.random() * 60;
        particle.style.background = `hsl(${hue}, 100%, 60%)`;
        particle.style.boxShadow = `0 0 6px hsl(${hue}, 100%, 60%)`;
        
        document.body.appendChild(particle);
        trailParticles.push({
            element: particle,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1
        });
    }

    function updateTrail() {
        for (let i = trailParticles.length - 1; i >= 0; i--) {
            const p = trailParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.03;
            
            p.element.style.left = p.x + 'px';
            p.element.style.top = p.y + 'px';
            p.element.style.opacity = p.life;
            p.element.style.transform = `translate(-50%, -50%) scale(${p.life})`;
            
            if (p.life <= 0) {
                p.element.remove();
                trailParticles.splice(i, 1);
            }
        }
        requestAnimationFrame(updateTrail);
    }
    updateTrail();

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    document.addEventListener('mousedown', (e) => {
        dot.classList.add('clicking');
        createRipple(e.clientX, e.clientY);
        createExplosion(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', () => {
        dot.classList.remove('clicking');
    });

    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    }

    function createExplosion(x, y) {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 60 + Math.random() * 80;
            const hue = 150 + Math.random() * 80;
            
            particle.style.background = `hsl(${hue}, 100%, 60%)`;
            particle.style.color = `hsl(${hue}, 100%, 60%)`;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            document.body.appendChild(particle);
            
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;
            
            let posX = x, posY = y;
            let vx = dx, vy = dy;
            let life = 1;
            
            const animate = () => {
                posX += vx * 0.05;
                posY += vy * 0.05;
                vy += 0.5;
                life -= 0.02;
                
                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.opacity = life;
                particle.style.transform = `translate(-50%, -50%) scale(${life})`;
                
                if (life > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            animate();
        }
    }

    const interactiveElements = document.querySelectorAll('a, button, input, .card, .article-card, .cate-card, .tag-item, .interactive, .category-tabs .tab');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            glow.style.width = '600px';
            glow.style.height = '600px';
        });
        el.addEventListener('mouseleave', () => {
            glow.style.width = '400px';
            glow.style.height = '400px';
        });
    });

    document.addEventListener('mousemove', (e) => {
        const title = document.querySelector('.title, .page-title, .blog-title, h1');
        if (title) {
            const rect = title.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const offsetX = (e.clientX - centerX) * 0.02;
            const offsetY = (e.clientY - centerY) * 0.02;
            title.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        a, button, input, .card, .article-card, .cate-card, .tag-item, .category-tabs .tab {
            cursor: none !important;
        }
    `;
    document.head.appendChild(style);
})();
