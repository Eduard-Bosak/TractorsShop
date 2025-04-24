// Продвинутые анимации и эффекты для сайта Тракторов
// Версия 2.0.0 (24.04.2025)

document.addEventListener('DOMContentLoaded', function() {
    // Анимация элементов при появлении в зоне видимости
    const animateOnScroll = function() {
        // Выбираем все элементы с классом 'animated', которые ещё не запустили анимацию
        const elements = document.querySelectorAll('.animated:not(.fadeIn)');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            // Если элемент находится в зоне видимости
            if (elementPosition < windowHeight - 100) {
                // Применяем разные задержки для заголовков, текстов и кнопок в герое
                if (element.classList.contains('hero-title')) {
                    element.classList.add('fadeIn');
                } else if (element.classList.contains('hero-text')) {
                    setTimeout(() => {
                        element.classList.add('fadeIn');
                    }, 300);
                } else if (element.classList.contains('hero-actions')) {
                    setTimeout(() => {
                        element.classList.add('fadeIn');
                    }, 600);
                } else {
                    element.classList.add('fadeIn');
                }
            }
        });
        
        // Анимация заголовков секций
        const sectionTitles = document.querySelectorAll('.section-title:not(.fadeIn)');
        sectionTitles.forEach(title => {
            const titlePosition = title.getBoundingClientRect().top;
            
            if (titlePosition < windowHeight - 50) {
                title.classList.add('fadeIn');
                
                // Анимация подзаголовка секции с задержкой
                const subtitle = title.nextElementSibling;
                if (subtitle && subtitle.classList.contains('section-subtitle')) {
                    setTimeout(() => {
                        subtitle.classList.add('fadeIn');
                    }, 300);
                }
            }
        });
        
        // Анимация элементов каталога с последовательной задержкой
        const catalogItems = document.querySelectorAll('.catalog-item:not(.fadeIn)');
        catalogItems.forEach((item, index) => {
            const itemPosition = item.getBoundingClientRect().top;
            
            if (itemPosition < windowHeight - 50) {
                setTimeout(() => {
                    item.classList.add('fadeIn');
                    item.classList.add('animated');
                }, 150 * index); // Задержка увеличивается для каждого следующего элемента
            }
        });
        
        // Анимация сервисных блоков с последовательной задержкой
        const serviceItems = document.querySelectorAll('.service-item:not(.fadeIn)');
        serviceItems.forEach((item, index) => {
            const itemPosition = item.getBoundingClientRect().top;
            
            if (itemPosition < windowHeight - 50) {
                setTimeout(() => {
                    item.classList.add('fadeIn');
                    item.classList.add('animated');
                }, 150 * index);
            }
        });
        
        // Дополнительно анимируем все элементы с классом animate-on-scroll
        const animateElements = document.querySelectorAll('.animate-on-scroll:not(.visible)');
        animateElements.forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < windowHeight - 50) {
                setTimeout(() => {
                    element.classList.add('visible');
                }, 100 * index);
            }
        });
    };
    
    // Запускаем функцию анимации при прокрутке
    window.addEventListener('scroll', animateOnScroll);
    
    // Запускаем анимацию при первоначальной загрузке с задержкой
    setTimeout(() => {
        animateOnScroll();
    }, 1000); // Уменьшено с 1500мс для быстрого отображения
    
    // Добавляем 3D эффект наклона для элементов каталога
    const catalogItems = document.querySelectorAll('.catalog-item');
    catalogItems.forEach(item => {
        // Обработчик движения мыши для создания эффекта 3D наклона
        item.addEventListener('mousemove', function(e) {
            const width = this.offsetWidth;
            const height = this.offsetHeight;
            const centerX = this.offsetLeft + width/2;
            const centerY = this.offsetTop + height/2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            const rotateX = ( 5 * mouseY/(height/2) ).toFixed(2);
            const rotateY = ( -5 * mouseX/(width/2) ).toFixed(2);
            
            // Применяем 3D трансформацию в зависимости от положения курсора
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        // Сбрасываем эффект при выходе курсора за пределы элемента
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // Добавляем эффект параллакса для секции герой
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        // Применяем параллакс эффект только пока видна секция героя
        if (heroSection && scrollPosition <= heroSection.offsetHeight) {
            const moveValue = scrollPosition * 0.3; // Уменьшено для более плавного эффекта
            
            // Смещаем контент и изображение в противоположных направлениях
            if (heroContent) heroContent.style.transform = `translateY(${moveValue}px)`;
            if (heroImage) heroImage.style.transform = `translateY(-${moveValue}px)`;
        }
    });
    
    // Добавляем анимацию плавающего трактора в герое
    const heroTractor = document.querySelector('.hero-tractor');
    if (heroTractor) {
        // Активируем класс с анимацией
        heroTractor.classList.add('float-animation');
        
        // Добавляем эффект свечения при наведении
        heroTractor.addEventListener('mouseenter', function() {
            this.classList.add('glow-effect');
        });
        
        heroTractor.addEventListener('mouseleave', function() {
            this.classList.remove('glow-effect');
        });
    }
    
    // Добавляем эффект объемных теней для карточек
    const cards = document.querySelectorAll('.catalog-item, .service-item, .feature');
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Вычисляем смещение тени в зависимости от позиции курсора
            const shadowX = (x - centerX) / 10;
            const shadowY = (y - centerY) / 10;
            const shadowBlur = 20;
            const shadowColor = 'rgba(0,0,0,0.2)';
            
            this.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}`;
        });
        
        // Возвращаем обычную тень при уходе курсора
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });
    
    // Добавляем анимированные прогресс-бары для спецификаций
    const specs = document.querySelectorAll('.spec-value');
    specs.forEach(spec => {
        const value = spec.textContent;
        if (!isNaN(parseInt(value))) {
            const valueNum = parseInt(value);
            
            // Создаем прогресс бар
            const progressBar = document.createElement('div');
            progressBar.className = 'spec-progress';
            const progressFill = document.createElement('div');
            progressFill.className = 'spec-progress-fill';
            
            // Устанавливаем базовую начальную ширину
            progressFill.style.width = '0%';
            
            // Добавляем анимацию заполнения при прокрутке до элемента
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Анимируем ширину до целевого значения
                        const percentage = Math.min(100, valueNum);
                        progressFill.style.width = `${percentage}%`;
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            progressBar.appendChild(progressFill);
            spec.parentNode.appendChild(progressBar);
            observer.observe(spec.parentNode);
        }
    });
    
    // Добавляем анимацию для особенностей при прокрутке
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        // Добавляем классы для анимации при скролле
        feature.classList.add('animate-on-scroll');
        
        // Чередуем направление анимации
        if (index % 2 === 0) {
            feature.classList.add('from-left');
        } else {
            feature.classList.add('from-right');
        }
    });
    
    // Магнитный эффект для кнопок
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Небольшое смещение кнопки в сторону курсора
            this.style.transform = `translate(${x / 25}px, ${y / 25}px)`;
        });
        
        // Сброс позиции при выходе курсора
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
    
    // Эффект скремблинга (перемешивания) текста для заголовка героя
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Добавляем класс для стилизации эффекта
        heroTitle.classList.add('text-scramble');
        
        // Сохраняем оригинальный текст
        const originalText = heroTitle.innerText;
        
        // Символы для эффекта скремблинга
        const chars = '!<>-_\\/[]{}—=+*^?#_________';
        
        heroTitle.addEventListener('mouseenter', function() {
            let iterations = 0;
            // Длительность эффекта в итерациях
            const maxIterations = 10;
            
            // Функция для создания эффекта скремблинга
            const interval = setInterval(() => {
                this.innerText = this.innerText.split('')
                    .map((char, index) => {
                        // Постепенно восстанавливаем символы к оригиналу
                        if (index < iterations) {
                            return originalText[index];
                        }
                        // Заменяем остальные символы на случайные
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                if (iterations >= originalText.length) {
                    clearInterval(interval);
                }
                
                iterations += 1 / 3; // Замедляем скорость восстановления
            }, 50);
        });
    }
    
    // Создаем плавную прокрутку для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Функция для добавления анимированного фона с частицами на канвас
    function createParticlesBackground() {
        const canvas = document.createElement('canvas');
        canvas.className = 'particles-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.prepend(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Устанавливаем размеры канваса
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Создаем массив частиц
        const particles = [];
        const particleCount = Math.min(30, Math.floor(window.innerWidth / 50)); // Адаптивное количество частиц
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        
        // Преобразуем hex в rgba для создания полупрозрачных частиц
        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: hexToRgba(primaryColor || '#FF3B30', Math.random() * 0.2 + 0.1)
            });
        }
        
        // Анимируем частицы
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                // Перемещаем частицу
                p.x += p.vx;
                p.y += p.vy;
                
                // Обработка границ
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                // Рисуем частицу
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
            
            // Рисуем соединения между ближайшими частицами
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Соединяем частицы, если они достаточно близко
                    const maxDistance = 150;
                    if (distance < maxDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = hexToRgba(primaryColor || '#FF3B30', 0.1 * (1 - distance / maxDistance));
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Запускаем анимацию
        animate();
    }
    
    // Добавляем анимированный фон с частицами только для десктопа (оптимизация)
    if (window.innerWidth > 768) {
        createParticlesBackground();
    }
    
    // Добавляем анимацию "печатающегося текста" для подзаголовков
    const typingElements = document.querySelectorAll('.section-subtitle');
    typingElements.forEach(element => {
        // Сохраняем оригинальный текст
        const text = element.textContent;
        element.textContent = '';
        
        // Создаем обертку для курсора
        element.classList.add('typing-text');
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        element.appendChild(cursor);
        
        // Наблюдаем за появлением элемента в видимой области
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Запускаем эффект печати
                    let index = 0;
                    const typeInterval = setInterval(() => {
                        if (index < text.length) {
                            const textSpan = document.createElement('span');
                            textSpan.textContent = text[index];
                            element.insertBefore(textSpan, cursor);
                            index++;
                        } else {
                            clearInterval(typeInterval);
                            // Убираем курсор через некоторое время
                            setTimeout(() => {
                                cursor.style.display = 'none';
                            }, 1500);
                        }
                    }, 50);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
    
    // Добавляем случайные метки "Новинка!" к некоторым элементам каталога
    const allCatalogItems = document.querySelectorAll('.catalog-item');
    if (allCatalogItems.length > 0) {
        // Выбираем случайные элементы для метки
        const numberOfNewItems = Math.ceil(allCatalogItems.length * 0.3); // 30% элементов будут новинками
        
        // Создаем массив индексов и перемешиваем его
        const indices = Array.from({ length: allCatalogItems.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]]; // Обмен значениями
        }
        
        // Добавляем метки новинок
        for (let i = 0; i < numberOfNewItems; i++) {
            const newTag = document.createElement('div');
            newTag.className = 'new-tag';
            newTag.textContent = 'Новинка!';
            allCatalogItems[indices[i]].appendChild(newTag);
        }
    }
    
    // Добавляем анимацию загрузки
    window.addEventListener('load', () => {
        document.body.classList.add('page-loaded');
    });
});
