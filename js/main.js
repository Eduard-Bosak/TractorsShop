// Основной JavaScript функционал для сайта Тракторов
// Версия: 2.1.0 (24.04.2025)

document.addEventListener('DOMContentLoaded', function() {
    // Анимация точек в загрузчике
    const loaderDots = document.querySelector('.loader-dots');
    if (loaderDots) {
        let dotsCount = 0;
        const dotsInterval = setInterval(() => {
            dotsCount = (dotsCount + 1) % 4;
            loaderDots.textContent = '.'.repeat(dotsCount || 1);
        }, 500);
        
        // Очищаем интервал при завершении загрузки
        window.addEventListener('load', function() {
            clearInterval(dotsInterval);
        });
    }
    
    // Удаление прелоадера при полной загрузке страницы
    const loader = document.querySelector('.loader');
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.visibility = 'hidden';
                    document.body.classList.add('loaded');
                }, 600);
            } else {
                document.body.classList.add('loaded');
            }
        }, 1000); // Уменьшена задержка для более быстрой загрузки
    });

    // Обработка темной темы
    const themeToggle = document.getElementById('themeToggle');
    
    // Проверяем сохраненную тему в localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (savedTheme === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Если пользователь не выбирал тему, но его система настроена на темную тему
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
    
    // Переключение между темной и светлой темой
    if (themeToggle) {
        // Обновляем иконку при загрузке
        updateThemeIcon();
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            // Сохраняем выбор пользователя в localStorage
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            
            // Обновляем иконку
            updateThemeIcon();
        });
    }
    
    // Функция обновления иконки темы
    function updateThemeIcon() {
        if (!themeToggle) return;
        
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.title = 'Переключить на светлую тему';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.title = 'Переключить на темную тему';
        }
    }
    
    // Эффект прокрутки для шапки
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Переключение мобильного меню
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        // Создаем мобильное меню если оно не существует
        if (!document.querySelector('.mobile-nav')) {
            const mobileNav = document.createElement('div');
            mobileNav.className = 'mobile-nav';
            
            const navList = document.querySelector('.nav-list').cloneNode(true);
            mobileNav.appendChild(navList);
            
            // Добавляем переключатель темы в мобильное меню
            if (themeToggle) {
                const themeToggleClone = themeToggle.cloneNode(true);
                mobileNav.appendChild(themeToggleClone);
                
                // Обработчик для клонированного переключателя
                themeToggleClone.addEventListener('click', function() {
                    document.body.classList.toggle('dark-theme');
                    
                    // Сохраняем выбор пользователя в localStorage
                    if (document.body.classList.contains('dark-theme')) {
                        localStorage.setItem('theme', 'dark');
                    } else {
                        localStorage.setItem('theme', 'light');
                    }
                    
                    // Обновляем иконки на обоих переключателях
                    updateThemeIcon();
                });
            }
            
            // Добавляем кнопку связи в мобильное меню
            const contactBtn = document.querySelector('.contact-btn').cloneNode(true);
            mobileNav.appendChild(contactBtn);
            
            document.body.appendChild(mobileNav);
        }
        
        const mobileNav = document.querySelector('.mobile-nav');
        
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Закрываем мобильное меню при нажатии на ссылку
        const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Плавная прокрутка для якорных ссылок
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Пропускаем пустые якори
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                
                // Плавная прокрутка с учетом высоты шапки
                window.scrollTo({
                    top: targetPosition - headerHeight - 20, // Небольшой отступ для улучшения отображения
                    behavior: 'smooth'
                });
                
                // Обновляем URL без перезагрузки страницы
                history.pushState(null, null, targetId);
            }
        });
    });

    // Функционал фильтрации каталога
    const filterSelect = document.querySelector('.filter-select');
    const catalogItems = document.querySelectorAll('.catalog-item');
    const powerSlider = document.getElementById('power-slider');
    const powerValue = document.querySelector('.range-value');
    
    /* --- FIX: делаем элементы каталога видимыми --- */
    catalogItems.forEach(item => item.classList.add('animated'));
    /* --- конец исправлений --- */

    if (filterSelect && catalogItems.length) {
        // Добавляем счетчик видимых элементов
        const visibleCounter = document.createElement('div');
        visibleCounter.className = 'visible-counter';
        if (filterSelect.parentNode) {
            filterSelect.parentNode.appendChild(visibleCounter);
        }
        
        filterSelect.addEventListener('change', function() {
            filterCatalog();
            // Добавляем анимацию при изменении фильтра
            animateFilteredItems();
        });
    }
    
    if (powerSlider && powerValue) {
        powerSlider.addEventListener('input', function() {
            powerValue.textContent = this.value + ' л.с.';
            filterCatalog();
        });
        
        // Обновляем начальное значение
        powerValue.textContent = powerSlider.value + ' л.с.';
    }
    
    // Добавляем фильтр по цене
    const priceRange = document.getElementById('price-range');
    const priceValue = document.querySelector('.price-value');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            const formattedPrice = new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                maximumFractionDigits: 0
            }).format(this.value);
            
            priceValue.textContent = formattedPrice;
            filterCatalog();
        });
        
        // Обновляем начальное значение цены
        if (priceRange.value) {
            const formattedPrice = new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                maximumFractionDigits: 0
            }).format(priceRange.value);
            
            priceValue.textContent = formattedPrice;
        }
    }
    
    // Фильтрация элементов каталога
    function filterCatalog() {
        const selectedType = filterSelect ? filterSelect.value : 'all';
        const selectedPower = powerSlider ? parseInt(powerSlider.value) : 0;
        const selectedPrice = priceRange ? parseInt(priceRange.value) : 0;
        
        let visibleCount = 0;
        
        catalogItems.forEach(item => {
            const itemType = item.dataset.type;
            const itemPower = parseInt(item.dataset.power);
            const itemPrice = parseInt(item.dataset.price);
            
            const typeMatch = selectedType === 'all' || itemType === selectedType;
            const powerMatch = !selectedPower || itemPower >= selectedPower;
            const priceMatch = !selectedPrice || itemPrice <= selectedPrice;
            
            if (typeMatch && powerMatch && priceMatch) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Обновляем счетчик
        updateVisibleCounter(visibleCount);
        
        // Обновляем статус кнопки "Загрузить еще"
        const loadMoreBtn = document.querySelector('.btn-load-more');
        if (loadMoreBtn) {
            if (visibleCount <= 4) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        }
    }
    
    // Обновление счетчика видимых элементов
    function updateVisibleCounter(count) {
        const visibleCounter = document.querySelector('.visible-counter');
        if (visibleCounter) {
            visibleCounter.textContent = `Найдено: ${count} ${getNounPluralForm(count, 'трактор', 'трактора', 'тракторов')}`;
            
            // Анимация счетчика
            visibleCounter.classList.add('counter-updated');
            setTimeout(() => {
                visibleCounter.classList.remove('counter-updated');
            }, 500);
        }
    }
    
    // Функция для анимации отфильтрованных элементов
    function animateFilteredItems() {
        const visibleItems = Array.from(catalogItems).filter(item => item.style.display !== 'none');
        
        visibleItems.forEach((item, index) => {
            // Сначала скрываем все
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            // Затем показываем с задержкой
            setTimeout(() => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50 * index);
        });
    }
    
    // Функция для правильного склонения существительных
    function getNounPluralForm(number, one, two, five) {
        let n = Math.abs(number);      // латинская n
        n %= 100;
        if (n >= 5 && n <= 20) {
            return five;
        }
        n %= 10;
        if (n === 1) {
            return one;
        }
        if (n >= 2 && n <= 4) {
            return two;
        }
        return five;
    }

    // Функциональность загрузки дополнительных товаров
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) {
        let currentItems = 4;
        loadMoreBtn.addEventListener('click', function() {
            const elementList = [...document.querySelectorAll('.catalog-item')];
            const visibleItems = elementList.filter(item => item.style.display !== 'none');
            
            for(let i = currentItems; i < currentItems + 4; i++) {
                if(visibleItems[i]) {
                    // Добавляем анимацию появления
                    visibleItems[i].style.display = 'block';
                    visibleItems[i].style.opacity = '0';
                    visibleItems[i].style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        visibleItems[i].style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        visibleItems[i].style.opacity = '1';
                        visibleItems[i].style.transform = 'translateY(0)';
                    }, 100 * (i - currentItems));
                }
            }
            
            currentItems += 4;
            
            if(currentItems >= visibleItems.length) {
                // Красивый эффект исчезновения кнопки
                this.style.opacity = '0';
                this.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    this.style.display = 'none';
                }, 300);
            }
        });
    }

    // Обработка отправки формы обратной связи
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Добавляем маску для телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            });
        }
        
        // Реал-тайм валидация полей
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                // Убираем состояние ошибки при вводе
                this.classList.remove('error');
                const errorMsg = this.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Валидация формы
            let isValid = true;
            
            formInputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                showNotification('Пожалуйста, заполните все поля формы корректно', 'error');
                return;
            }

            // Создаем объект с данными формы
            const formData = {
                name: name,
                phone: phone,
                email: email,
                message: message,
                date: new Date().toISOString(),
                source: window.location.href
            };

            // Показываем индикатор загрузки
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerText;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            // Имитация задержки сети
            setTimeout(() => {
                // Пытаемся отправить данные (для демонстрации сохраняем в localStorage)
                saveRequestToLocalStorage(formData);
                
                // Показываем уведомление об успехе
                showNotification('Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                
                // Сбрасываем форму
                contactForm.reset();
                
                // Восстанавливаем кнопку
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Показываем благодарность
                showThankYouMessage();
            }, 1500);
        });
        
        // Функция для валидации отдельного поля
        function validateInput(input) {
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
            
            let isValid = true;
            let message = '';
            
            // Удаляем класс ошибки
            input.classList.remove('error');
            
            if (input.required && !input.value.trim()) {
                isValid = false;
                message = 'Это поле обязательно для заполнения';
            } else if (input.id === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    message = 'Пожалуйста, введите корректный email';
                }
            } else if (input.id === 'phone' && input.value) {
                // Проверяем, содержит ли строка нужное количество цифр
                const digitsOnly = input.value.replace(/\D/g, '');
                if (digitsOnly.length < 10) {
                    isValid = false;
                    message = 'Пожалуйста, введите полный номер телефона';
                }
            }
            
            if (!isValid) {
                input.classList.add('error');
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = message;
                input.parentElement.appendChild(errorElement);
            }
            
            return isValid;
        }
        
        // Функция для отображения сообщения благодарности
        function showThankYouMessage() {
            const thankYouOverlay = document.createElement('div');
            thankYouOverlay.className = 'thank-you-overlay';
            
            const thankYouContent = document.createElement('div');
            thankYouContent.className = 'thank-you-content';
            
            thankYouContent.innerHTML = `
                <i class="fas fa-check-circle success-icon"></i>
                <h3>Спасибо за ваше сообщение!</h3>
                <p>Мы получили вашу заявку и свяжемся с вами в ближайшее время.</p>
                <button class="btn btn-primary close-thank-you">Отлично</button>
            `;
            
            thankYouOverlay.appendChild(thankYouContent);
            document.body.appendChild(thankYouOverlay);
            
            // Анимация появления
            setTimeout(() => {
                thankYouOverlay.classList.add('visible');
            }, 10);
            
            // Добавляем обработчик для закрытия
            thankYouOverlay.querySelector('.close-thank-you').addEventListener('click', function() {
                thankYouOverlay.classList.remove('visible');
                setTimeout(() => {
                    thankYouOverlay.remove();
                }, 300);
            });
        }
    }

    // Функция для отображения уведомлений
    function showNotification(message, type = 'info') {
        // Удаляем предыдущие уведомления
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Выбираем иконку в зависимости от типа уведомления
        let icon = '';
        switch(type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        notification.innerHTML = `
            ${icon}
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('visible');
        }, 10);
        
        // Автоматическое скрытие
        const hideTimeout = setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Обработчик для закрытия уведомления
        notification.querySelector('.notification-close').addEventListener('click', function() {
            clearTimeout(hideTimeout);
            hideNotification(notification);
        });
    }
    
    // Функция для скрытия уведомления
    function hideNotification(notification) {
        notification.classList.remove('visible');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    // Функция для сохранения заявки в localStorage
    function saveRequestToLocalStorage(data, isPending = false) {
        // Получаем существующие заявки из localStorage
        let requests = JSON.parse(localStorage.getItem('tractorRequests') || '[]');
        
        // Добавляем статус к заявке (отправлена/ожидает отправки)
        data.status = isPending ? 'pending' : 'sent';
        data.id = generateUniqueId();
        
        // Добавляем новую заявку
        requests.push(data);
        
        // Ограничиваем количество сохраненных заявок (для экономии места)
        if (requests.length > 50) {
            requests = requests.slice(-50);
        }
        
        // Сохраняем обратно в localStorage
        localStorage.setItem('tractorRequests', JSON.stringify(requests));
    }
    
    // Генерируем уникальный ID для заявки
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    // Добавляем функционал для кнопки "Вверх"
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollTopBtn);
    
    // Показываем/скрываем кнопку в зависимости от прокрутки
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Обработчик нажатия на кнопку прокрутки вверх
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Добавляем счетчики с анимацией
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const targetValue = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // Длительность анимации в мс
        const framesPerSecond = 60;
        const frameDuration = 1000 / framesPerSecond;
        const totalFrames = Math.round(duration / frameDuration);
        
        // Функция для анимации счетчика
        function animateCounter() {
            let frame = 0;
            const initialValue = 0;
            const valueIncrement = targetValue / totalFrames;
            
            const counterInterval = setInterval(() => {
                frame++;
                const newValue = Math.round(initialValue + (valueIncrement * frame));
                
                // Форматируем число с разделителем тысяч
                counter.textContent = new Intl.NumberFormat('ru-RU').format(newValue);
                
                if (frame >= totalFrames) {
                    clearInterval(counterInterval);
                }
            }, frameDuration);
        }
        
        // Запускаем анимацию при появлении элемента в поле зрения
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
    
    // Активация текущего пункта меню в зависимости от прокрутки
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollY = window.pageYOffset;
        
        // Находим текущую секцию
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            if (scrollY >= sectionTop - headerHeight - 50) {
                current = section.getAttribute('id');
            }
        });
        
        // Обновляем активный пункт меню
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Инициализируем фильтрацию каталога при загрузке страницы
    filterCatalog();

    /* ---------- DETAIL MODAL for “Подробнее” ---------- */
    // присваиваем слушатель существующим кнопкам
    document.querySelectorAll('.catalog-item .btn-primary')
            .forEach(btn => btn.addEventListener('click', openDetailModal));

    // делегируем клики для динамически появляющихся карточек
    document.addEventListener('click', e => {
        const btn = e.target.closest('.catalog-item .btn-primary');
        if (btn) openDetailModal({ currentTarget: btn });
    });

    function openDetailModal(e) {
        const item = e.currentTarget.closest('.catalog-item');
        if (!item) return;

        // Build modal skeleton only once
        let modal = document.querySelector('.detail-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'detail-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                    <div class="modal-body"></div>
                </div>`;
            document.body.appendChild(modal);

            // generic close handlers
            modal.addEventListener('click', ev => {
                if (ev.target === modal || ev.target.closest('.modal-close')) closeModal();
            });
            document.addEventListener('keydown', ev => {
                if (ev.key === 'Escape') closeModal();
            });
        }

        // fill modal with card data
        const body = modal.querySelector('.modal-body');
        body.innerHTML = `
            <div class="modal-image">${item.querySelector('.item-image').innerHTML}</div>
            <div class="modal-info">
                <h2>${item.querySelector('.item-title').textContent}</h2>
                <p>${item.querySelector('.item-description').textContent}</p>
                <p class="price">${item.querySelector('.price').textContent}</p>
            </div>`;

        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        const modal = document.querySelector('.detail-modal');
        if (modal) modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
    /* ---------- end modal ---------- */

    /* ---------- Плавное перемешивание символов в заголовке ---------- */
    class TextScrambler {
        constructor(el) {
            this.el = el;
            this.chars = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЮЯ!?@#&$';
        }
        // метод запуска эффекта
        scramble(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 20);
                const end = start + Math.floor(Math.random() * 20);
                queue.push({ from, to, start, end, char: '' });
            }
            let frame = 0;
            const update = () => {
                let output = '';
                let complete = 0;
                queue.forEach(item => {
                    if (frame >= item.end) {
                        complete++;
                        output += item.to;
                    } else if (frame >= item.start) {
                        if (!item.char || Math.random() < 0.28) {
                            item.char = this.randomChar();
                        }
                        output += `<span class="text-scramble-dud">${item.char}</span>`;
                    } else {
                        output += item.from;
                    }
                });
                this.el.innerHTML = output;
                if (complete === queue.length) {
                    cancelAnimationFrame(this.frameRequest);
                } else {
                    this.frameRequest = requestAnimationFrame(update);
                }
                frame++;
            };
            update();
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Настройка для заголовка героя
    const heroTitle = document.querySelector('.hero-title.text-scramble');
    if (heroTitle) {
        const scrambler = new TextScrambler(heroTitle);

        // Запускаем эффект, когда заголовок появляется в зоне видимости
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scrambler.scramble(heroTitle.textContent);
                    observer.unobserve(heroTitle);
                }
            });
        }, { threshold: 0.6 });

        observer.observe(heroTitle);
    }
    /* ---------- конец эффекта scramble ---------- */

    /* -------- обработчики дополнительных кнопок -------- */
    // Кнопка "Применить фильтры"
    const applyBtn = document.querySelector('.btn-filter');
    if (applyBtn) applyBtn.addEventListener('click', () => {
        filterCatalog();
        animateFilteredItems();
    });

    // Кнопка "Сбросить"
    const resetBtn = document.querySelector('.btn-reset');
    if (resetBtn) resetBtn.addEventListener('click', () => {
        document.querySelector('.filter-select').value = 'all';
        document.getElementById('power-slider').value = 20;
        document.querySelector('.range-value').textContent = '20 л.с.';
        const priceRange = document.getElementById('price-range');
        if (priceRange) {
            priceRange.value = 0;
            const priceValue = document.querySelector('.price-value');
            if (priceValue) priceValue.textContent = '';
        }
        filterCatalog();
        animateFilteredItems();
    });

    // Кнопка «Поиск»
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            let sc = document.querySelector('.search-container');
            if (!sc) {
                sc = document.createElement('div');
                sc.className = 'search-container';
                sc.innerHTML = `
                    <form class="search-form">
                        <input class="search-input" placeholder="Поиск..." />
                        <button class="search-submit"><i class="fas fa-search"></i></button>
                    </form>`;
                document.body.appendChild(sc);
            }
            sc.classList.toggle('visible');
        });
    }

    // Кнопка «Связаться с нами» в шапке
    const contactBtnHeader = document.querySelector('.contact-btn');
    if (contactBtnHeader) {
        contactBtnHeader.addEventListener('click', () => {
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        });
    }
    /* -------- конец обработчиков -------- */

    /* -------- избранное -------- */
    // Загружаем сохранённые избранные
    let favourites = JSON.parse(localStorage.getItem('tzrFavourites') || '[]');

    // Функция сохранения
    const saveFavourites = () => localStorage.setItem('tzrFavourites', JSON.stringify(favourites));

    // Навешиваем обработчики на сердечки
    document.querySelectorAll('.catalog-item .btn-icon').forEach(btn=>{
        const title = btn.closest('.catalog-item').querySelector('.item-title').textContent;
        // Восстанавливаем состояние при загрузке
        if (favourites.includes(title)) btn.classList.add('active');

        btn.addEventListener('click', e=>{
            e.stopPropagation();
            btn.classList.toggle('active');
            const added = btn.classList.contains('active');
            if (added){
                favourites.push(title);
                showNotification('Добавлено в избранное','success');
            }else{
                favourites = favourites.filter(t=>t!==title);
                showNotification('Удалено из избранного','warning');
            }
            saveFavourites();
        });
    });
    /* -------- конец избранного -------- */

    /* -------- уведомление для футера -------- */
    // Новый вариант: единый делегированный обработчик
    const footer = document.querySelector('footer');
    if (footer) {
        footer.addEventListener('click', e => {
            const link = e.target.closest('a');
            if (link) {
                e.preventDefault();
                showNotification('Этот раздел ещё в разработке', 'info');
            }
        });
    }
    /* -------- конец -------- */
});
