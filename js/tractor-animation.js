/**
 * Продвинутая система анимации для моделей тракторов
 * Версия: 1.2.0 (24.04.2025)
 */

class TractorAnimation {
    constructor() {
        this.init();
    }
    
    init() {
        // Инициализация анимации колес
        this.initWheelAnimations();
        
        // Инициализация 3D просмотрщика тракторов
        this.init3DViewers();
        
        // Инициализация эффектов при наведении
        this.initHoverEffects();
        
        // Добавление эффектов дыма
        this.addSmokeEffects();
        
        // Инициализация плавной анимации
        this.initSmoothAnimation();
    }
    
    initWheelAnimations() {
        const wheelFront = document.querySelector('.wheel-front');
        const wheelBack = document.querySelector('.wheel-back');
        
        if (wheelFront && wheelBack) {
            // Непрерывная анимация вращения для колес
            wheelFront.style.animation = 'wheelRotate 4s infinite linear';
            wheelBack.style.animation = 'wheelRotate 4s infinite linear';
            
            // Добавляем эффект вращения при прокрутке
            window.addEventListener('scroll', () => {
                const scrollSpeed = Math.min(Math.max(window.scrollY / 100, 0.5), 3);
                wheelFront.style.animationDuration = `${4 / scrollSpeed}s`;
                wheelBack.style.animationDuration = `${4 / scrollSpeed}s`;
            });
        }
    }
    
    init3DViewers() {
        const catalogItems = document.querySelectorAll('.catalog-item');
        
        catalogItems.forEach(item => {
            const image = item.querySelector('.placeholder-image');
            if (!image) return;
            
            // Создаем обертку для 3D эффекта
            const wrapper = document.createElement('div');
            wrapper.className = 'effect3d-wrapper';
            image.parentNode.insertBefore(wrapper, image);
            wrapper.appendChild(image);
            
            // Добавляем эффект 3D вращения
            wrapper.addEventListener('mousemove', e => {
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((x - centerX) / centerX) * 12; // Уменьшено для более плавного эффекта
                const rotateX = ((centerY - y) / centerY) * 8;  // Уменьшено для более плавного эффекта
                
                image.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.05)`;
                image.style.transition = 'transform 0.1s ease';
            });
            
            wrapper.addEventListener('mouseleave', () => {
                image.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
                image.style.transition = 'transform 0.5s ease-out';
            });
        });
    }
    
    initHoverEffects() {
        const tractorImages = document.querySelectorAll('.placeholder-image');
        
        tractorImages.forEach(image => {
            // Создаем элемент подсветки
            const highlight = document.createElement('div');
            highlight.className = 'tractor-highlight';
            image.appendChild(highlight);
            
            image.addEventListener('mousemove', e => {
                const rect = image.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                highlight.style.opacity = '0.7'; // Более заметная подсветка
                highlight.style.transform = `translate(${x}px, ${y}px)`;
            });
            
            image.addEventListener('mouseleave', () => {
                highlight.style.opacity = '0';
            });
        });
    }
    
    addSmokeEffects() {
        const heroTractor = document.querySelector('.hero-tractor');
        
        if (heroTractor) {
            // Создаем контейнер для дыма
            const smokeContainer = document.createElement('div');
            smokeContainer.className = 'smoke-container';
            heroTractor.appendChild(smokeContainer);
            
            // Добавляем частицы дыма
            for (let i = 0; i < 8; i++) {
                const smoke = document.createElement('div');
                smoke.className = 'smoke-particle';
                smoke.style.animationDelay = `${i * 0.3}s`;
                smoke.style.left = `${50 + (Math.random() * 20 - 10)}%`;
                smokeContainer.appendChild(smoke);
            }
        }
    }
    
    // Новый метод для плавной анимации элементов при скролле
    initSmoothAnimation() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        // Функция проверки видимости элемента в области просмотра
        const isElementInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        };
        
        // Функция анимации элементов при скролле
        const animateElementsOnScroll = () => {
            animatedElements.forEach(element => {
                if (isElementInViewport(element)) {
                    element.classList.add('visible');
                }
            });
        };
        
        // Первичный вызов для элементов, видимых при загрузке
        animateElementsOnScroll();
        
        // Добавляем обработчик скролла
        window.addEventListener('scroll', animateElementsOnScroll);
    }
}

// Инициализация системы анимации тракторов при загрузке документа
document.addEventListener('DOMContentLoaded', () => {
    const tractorAnimation = new TractorAnimation();
    
    // Добавляем динамическую тень под тракторами
    const tractorContainers = document.querySelectorAll('.item-image');
    tractorContainers.forEach(container => {
        const shadow = document.createElement('div');
        shadow.className = 'tractor-shadow';
        container.appendChild(shadow);
    });
    
    // Добавляем эффект звука двигателя при наведении
    const catalogItems = document.querySelectorAll('.catalog-item');
    
    // Переменная для отслеживания включенного звука
    let soundEnabled = localStorage.getItem('tractorSoundEnabled') === 'true';
    
    // Создаем переключатель звука в интерфейсе
    const soundToggle = document.createElement('div');
    soundToggle.className = 'sound-toggle';
    soundToggle.innerHTML = soundEnabled ? 
        '<i class="fas fa-volume-up"></i>' : 
        '<i class="fas fa-volume-mute"></i>';
    soundToggle.title = soundEnabled ? 'Выключить звук' : 'Включить звук';
    document.body.appendChild(soundToggle);
    
    // Обработчик клика по переключателю звука
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('tractorSoundEnabled', soundEnabled);
        
        // Обновляем иконку переключателя
        soundToggle.innerHTML = soundEnabled ? 
            '<i class="fas fa-volume-up"></i>' : 
            '<i class="fas fa-volume-mute"></i>';
        soundToggle.title = soundEnabled ? 'Выключить звук' : 'Включить звук';
        
        // Останавливаем все звуки, если звук выключен
        if (!soundEnabled) {
            document.querySelectorAll('.engine-sound').forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        }
    });
    
    // Логика воспроизведения звука при наведении
    catalogItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Прекращаем, если звук отключен
            if (!soundEnabled) return;
            
            // Создаем аудио элемент, если он не существует
            if (!item.querySelector('.engine-sound')) {
                const audio = document.createElement('audio');
                audio.className = 'engine-sound';
                audio.volume = 0.08; // Уменьшенная громкость
                audio.loop = true;
                
                // Создаем разные источники для совместимости
                const mp3Source = document.createElement('source');
                mp3Source.src = 'audio/engine.mp3';
                mp3Source.type = 'audio/mpeg';
                
                const oggSource = document.createElement('source');
                oggSource.src = 'audio/engine.ogg';
                oggSource.type = 'audio/ogg';
                
                audio.appendChild(mp3Source);
                audio.appendChild(oggSource);
                item.appendChild(audio);
            }
            
            // Запускаем звук с плавным нарастанием громкости
            const audio = item.querySelector('.engine-sound');
            audio.volume = 0;
            
            const fadeIn = setInterval(() => {
                if (audio.volume < 0.08) {
                    audio.volume += 0.01;
                } else {
                    clearInterval(fadeIn);
                }
            }, 50);
            
            audio.play().catch(err => {
                // Обработка ограничений автовоспроизведения
                console.log('Автоматическое воспроизведение звука заблокировано браузером');
            });
        });
        
        item.addEventListener('mouseleave', () => {
            const audio = item.querySelector('.engine-sound');
            if (audio) {
                // Плавное затухание звука
                const fadeOut = setInterval(() => {
                    if (audio.volume > 0.01) {
                        audio.volume -= 0.01;
                    } else {
                        audio.pause();
                        audio.currentTime = 0;
                        clearInterval(fadeOut);
                    }
                }, 50);
            }
        });
    });
    
    // Добавляем эффект параллакса для фона героя
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPosition = `center ${scrollPosition * 0.4}px`;
        });
    }
    
    // Маркировка наиболее эффективных тракторов
    const efficientTractors = document.querySelectorAll('.catalog-item[data-power="25"], .catalog-item[data-power="40"]');
    efficientTractors.forEach(tractor => {
        const badge = document.createElement('div');
        badge.className = 'eco-badge';
        badge.innerHTML = '<i class="fas fa-leaf"></i> Экономичный';
        tractor.querySelector('.item-content').prepend(badge);
    });
});

/**
 * Анимация тракторов для главной страницы
 * Версия 2.0.0 (24.04.2025)
 */

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Константы для анимации
    const CANVAS_WIDTH = window.innerWidth;
    const CANVAS_HEIGHT = 200;
    const TRACTOR_SIZE = 80;
    const WHEEL_RADIUS = 10;
    const ANIMATION_SPEED = 0.5;
    const GROUND_LEVEL = 160;
    
    // Создаем элемент канваса
    const createTractorCanvas = function() {
        const canvasContainer = document.querySelector('.tractor-animation-container');
        if (!canvasContainer) return null;
        
        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        canvas.classList.add('tractor-canvas');
        canvasContainer.appendChild(canvas);
        
        return canvas;
    };
    
    // Получаем контекст для рисования
    const canvas = createTractorCanvas();
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Позиции тракторов
    let tractorPositions = [
        {x: -TRACTOR_SIZE * 2, y: GROUND_LEVEL, speed: 1.5, color: '#FF5733'},
        {x: -TRACTOR_SIZE * 6, y: GROUND_LEVEL, speed: 2.0, color: '#33FF57'},
        {x: -TRACTOR_SIZE * 10, y: GROUND_LEVEL, speed: 1.2, color: '#3357FF'}
    ];
    
    // Функция для рисования колеса
    const drawWheel = function(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#333333';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Рисуем спицы колеса
        ctx.beginPath();
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.moveTo(x, y - radius);
        ctx.lineTo(x, y + radius);
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    };
    
    // Функция для рисования трактора
    const drawTractor = function(x, y, color) {
        // Кабина трактора
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // Основной корпус
        ctx.beginPath();
        ctx.rect(x, y - 40, 60, 25);
        ctx.fill();
        ctx.stroke();
        
        // Кабина водителя
        ctx.beginPath();
        ctx.rect(x + 10, y - 65, 30, 25);
        ctx.fill();
        ctx.stroke();
        
        // Окно кабины
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.rect(x + 15, y - 60, 20, 15);
        ctx.fill();
        ctx.stroke();
        
        // Двигатель
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(x + 40, y - 50, 20, 35);
        ctx.fill();
        ctx.stroke();
        
        // Труба
        ctx.beginPath();
        ctx.rect(x + 45, y - 70, 10, 20);
        ctx.fill();
        ctx.stroke();
        
        // Дым из трубы (случайные частицы)
        if (Math.random() > 0.3) {
            const particleCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < particleCount; i++) {
                const offsetX = Math.random() * 10 - 5;
                const offsetY = Math.random() * 10 - 20;
                const radius = Math.random() * 5 + 2;
                
                ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
                ctx.beginPath();
                ctx.arc(x + 50 + offsetX, y - 75 + offsetY, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Рисуем колеса
        drawWheel(x + 15, y, WHEEL_RADIUS * 1.5);
        drawWheel(x + 45, y, WHEEL_RADIUS * 1.5);
        
        // Передний бампер
        ctx.fillStyle = '#444444';
        ctx.beginPath();
        ctx.rect(x - 5, y - 25, 10, 10);
        ctx.fill();
        ctx.stroke();
        
        // Фара
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(x, y - 20, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Луч от фары при движении
        const gradient = ctx.createLinearGradient(x, y - 20, x - 50, y - 20);
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x, y - 25);
        ctx.lineTo(x - 50, y - 35);
        ctx.lineTo(x - 50, y - 5);
        ctx.lineTo(x, y - 15);
        ctx.closePath();
        ctx.fill();
    };
    
    // Функция для рисования земли (с травой)
    const drawGround = function() {
        // Земля
        const groundGradient = ctx.createLinearGradient(0, GROUND_LEVEL, 0, CANVAS_HEIGHT);
        groundGradient.addColorStop(0, '#8B4513');
        groundGradient.addColorStop(1, '#654321');
        
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, GROUND_LEVEL, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_LEVEL);
        
        // Травинки
        ctx.strokeStyle = '#0A5F38';
        ctx.lineWidth = 1;
        
        for(let i = 0; i < CANVAS_WIDTH; i += 15) {
            const height = Math.random() * 10 + 5;
            const offsetX = Math.random() * 8 - 4;
            
            ctx.beginPath();
            ctx.moveTo(i, GROUND_LEVEL);
            ctx.lineTo(i + offsetX, GROUND_LEVEL - height);
            ctx.stroke();
        }
    };
    
    // Функция для рисования неба с облаками
    const drawSky = function() {
        // Градиент неба
        const skyGradient = ctx.createLinearGradient(0, 0, 0, GROUND_LEVEL);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#C9E9F6');
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_LEVEL);
        
        // Облака (фиксированные)
        const clouds = [
            {x: 100, y: 40, size: 30},
            {x: 300, y: 60, size: 40},
            {x: 500, y: 30, size: 25},
            {x: 700, y: 50, size: 35}
        ];
        
        clouds.forEach(cloud => {
            drawCloud(cloud.x, cloud.y, cloud.size);
        });
    };
    
    // Функция для рисования одного облака
    const drawCloud = function(x, y, size) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + size, y - size/2, size * 0.8, 0, Math.PI * 2);
        ctx.arc(x + size * 1.5, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.5, y + size/2, size * 0.8, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    };
    
    // Функция для рисования солнца
    const drawSun = function() {
        const sunX = CANVAS_WIDTH - 80;
        const sunY = 60;
        const sunRadius = 30;
        
        // Сияние солнца
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2);
        sunGlow.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
        sunGlow.addColorStop(0.5, 'rgba(255, 255, 0, 0.2)');
        sunGlow.addColorStop(1, 'rgba(255, 255, 0, 0)');
        
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Само солнце
        const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
        sunGradient.addColorStop(0, '#FFFF99');
        sunGradient.addColorStop(1, '#FFCC00');
        
        ctx.fillStyle = sunGradient;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Лучи солнца
        ctx.strokeStyle = '#FFCC00';
        ctx.lineWidth = 2;
        
        for(let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const innerRadius = sunRadius + 5;
            const outerRadius = sunRadius + 15;
            
            ctx.beginPath();
            ctx.moveTo(
                sunX + innerRadius * Math.cos(angle),
                sunY + innerRadius * Math.sin(angle)
            );
            ctx.lineTo(
                sunX + outerRadius * Math.cos(angle),
                sunY + outerRadius * Math.sin(angle)
            );
            ctx.stroke();
        }
    };
    
    // Функция для добавления случайных элементов пейзажа (кусты, камни)
    const drawLandscapeElements = function() {
        // Кусты
        ctx.fillStyle = '#0A5F38';
        for(let i = 0; i < 5; i++) {
            const x = Math.random() * CANVAS_WIDTH;
            const y = GROUND_LEVEL;
            const size = Math.random() * 15 + 10;
            
            drawBush(x, y, size);
        }
        
        // Камни
        ctx.fillStyle = '#888888';
        ctx.strokeStyle = '#666666';
        for(let i = 0; i < 8; i++) {
            const x = Math.random() * CANVAS_WIDTH;
            const y = GROUND_LEVEL;
            const size = Math.random() * 8 + 5;
            
            ctx.beginPath();
            ctx.arc(x, y, size, Math.PI, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    };
    
    // Функция для рисования куста
    const drawBush = function(x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y - size/2, size, 0, Math.PI * 2);
        ctx.arc(x + size/2, y - size, size * 0.7, 0, Math.PI * 2);
        ctx.arc(x - size/2, y - size, size * 0.7, 0, Math.PI * 2);
        ctx.fill();
    };
    
    // Основная функция анимации
    const animate = function() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Рисуем задний фон
        drawSky();
        drawSun();
        drawLandscapeElements();
        drawGround();
        
        // Обновляем позиции тракторов
        tractorPositions = tractorPositions.map(tractor => {
            // Обновляем позицию
            tractor.x += tractor.speed * ANIMATION_SPEED;
            
            // Если трактор выехал за край, возвращаем его в начало
            if (tractor.x > CANVAS_WIDTH + TRACTOR_SIZE) {
                tractor.x = -TRACTOR_SIZE * 2;
                // Случайно выбираем новый цвет
                const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFD133'];
                tractor.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            // Рисуем трактор
            drawTractor(tractor.x, tractor.y, tractor.color);
            
            return tractor;
        });
        
        // Запускаем следующий кадр анимации
        requestAnimationFrame(animate);
    };
    
    // Обработка изменения размера окна
    window.addEventListener('resize', function() {
        // Обновляем размеры канваса
        canvas.width = window.innerWidth;
        
        // Перезапускаем анимацию
        animate();
    });
    
    // Запускаем анимацию
    animate();
});
