export const initPreloader = () => {
    const loader = document.getElementById('main-preloader');
    if (!loader) return;

    const startAnimation = () => {
        // Задержка 1.4с (пока печатаются буквы)
        setTimeout(() => {
            // Добавляем класс масштабирования
            loader.classList.add('zoom-out'); 
            
            // Ждем завершения CSS транзиции (0.8s)
            setTimeout(() => {
                loader.style.display = 'none';
                // Возвращаем скролл
                document.body.style.overflowY = 'auto';
            }, 800); 
        }, 1400);
    };

    if (document.readyState === 'complete') {
        startAnimation();
    } else {
        window.addEventListener('load', startAnimation);
    }
}