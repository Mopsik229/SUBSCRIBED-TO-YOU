document.addEventListener('DOMContentLoaded', function() {
            window.addEventListener('scroll', function() {
                const navbar = document.querySelector('.navbar');
                if (window.scrollY > 50) {
                    navbar.classList.add('revealed');
                } else {
                    navbar.classList.remove('revealed');
                }
            });
            
            const staticEffect = document.querySelector('.static-effect');
            setInterval(() => {
                const randomX = Math.floor(Math.random() * 100);
                const randomY = Math.floor(Math.random() * 100);
                staticEffect.style.backgroundPosition = `${randomX}% ${randomY}%`;
            }, 100);
            
            const messages = document.querySelectorAll('.message-container .message');
            messages.forEach((msg, index) => {
                msg.style.animationDelay = `${index * 0.2}s`;
            });
            
            const videoLoop = document.querySelector('.video-loop');
            setInterval(() => {
                const randomSize = 0.95 + Math.random() * 0.1;
                videoLoop.style.transform = `scale(${randomSize})`;
            }, 8000);
        });

                    const binaryRain = document.getElementById('binaryRain');
            const characters = ['0', '1'];
            
            function createBinaryDigit() {
                const digit = document.createElement('div');
                digit.classList.add('binary-digit');
                digit.textContent = characters[Math.floor(Math.random() * characters.length)];
                digit.style.left = Math.random() * 100 + 'vw';
                digit.style.animationDuration = (Math.random() * 10 + 10) + 's';
                digit.style.opacity = Math.random() * 0.3 + 0.1;
                
                binaryRain.appendChild(digit);
                
                // Удаляем элемент после завершения анимации
                setTimeout(() => {
                    digit.remove();
                }, parseFloat(digit.style.animationDuration) * 1000);
            }
            
            // Запускаем создание цифр
            setInterval(createBinaryDigit, 100);
            
            // Анимация "цифрового призрака"
            const ghostEyes = document.querySelectorAll('.ghost-eye');
            let eyeMoveTimeout;
            
            function moveEyes() {
                ghostEyes.forEach(eye => {
                    // Случайное смещение зрачков
                    const x = (Math.random() * 10 - 5) + 'px';
                    const y = (Math.random() * 5 - 2.5) + 'px';
                    eye.style.transform = `translate(${x}, ${y})`;
                });
                
                // Рандомная задержка для следующего движения
                const delay = Math.random() * 3000 + 1000;
                eyeMoveTimeout = setTimeout(moveEyes, delay);
            }
            
            // Начинаем анимацию глаз
            moveEyes();
            
            // Останавливаем анимацию при уходе со страницы
            window.addEventListener('beforeunload', function() {
                clearTimeout(eyeMoveTimeout);
            });

            class FuzzyText {
            constructor(canvas, options = {}) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.options = {
                    text: options.text || '404\nnot found',
                    fontSize: options.fontSize || 'clamp(2rem, 10vw, 6rem)',
                    fontWeight: options.fontWeight || 900,
                    fontFamily: options.fontFamily || 'inherit',
                    color: options.color || '#fff',
                    enableHover: options.enableHover !== undefined ? options.enableHover : true,
                    baseIntensity: options.baseIntensity !== undefined ? options.baseIntensity : 0.18,
                    hoverIntensity: options.hoverIntensity !== undefined ? options.hoverIntensity : 0.5,
                    lineHeight: options.lineHeight || 1.0
                };
                
                this.animationFrameId = null;
                this.isHovering = false;
                this.isCancelled = false;
                
                this.init();
            }
            
            async init() {
                await this.waitForFonts();
                if (this.isCancelled) return;
                
                this.setupCanvas();
                this.setupEventListeners();
                this.runAnimation();
            }
            
            async waitForFonts() {
                if (document.fonts?.ready) {
                    await document.fonts.ready;
                }
            }
            
            setupCanvas() {
                // Split text into lines
                this.lines = this.options.text.split('\n');
                
                // Create offscreen canvas for text measurement
                const offscreen = document.createElement('canvas');
                const offCtx = offscreen.getContext('2d');
                
                const computedFontFamily = this.options.fontFamily === 'inherit' ? 
                    window.getComputedStyle(this.canvas).fontFamily || 'sans-serif' : 
                    this.options.fontFamily;
                
                const fontSizeStr = typeof this.options.fontSize === 'number' ? 
                    `${this.options.fontSize}px` : this.options.fontSize;
                
                // Get numeric font size
                const numericFontSize = this.getNumericFontSize();
                const lineHeight = numericFontSize * this.options.lineHeight;
                
                // Set context for measurement
                offCtx.font = `${this.options.fontWeight} ${fontSizeStr} ${computedFontFamily}`;
                offCtx.textBaseline = 'alphabetic';
                
                // Measure all lines
                let maxWidth = 0;
                let totalHeight = 0;
                const lineMetrics = [];
                
                for (const line of this.lines) {
                    const metrics = offCtx.measureText(line);
                    const lineWidth = metrics.width;
                    const actualAscent = metrics.actualBoundingBoxAscent || numericFontSize;
                    const actualDescent = metrics.actualBoundingBoxDescent || numericFontSize * 0.2;
                    
                    if (lineWidth > maxWidth) maxWidth = lineWidth;
                    
                    lineMetrics.push({
                        width: lineWidth,
                        ascent: actualAscent,
                        descent: actualDescent,
                        height: actualAscent + actualDescent
                    });
                }
                
                // Calculate total height
                totalHeight = lineMetrics.reduce((sum, metric, index) => {
                    return sum + metric.height + (index > 0 ? lineHeight - metric.ascent : 0);
                }, 0);
                
                // Create offscreen canvas
                const extraWidthBuffer = 10;
                offscreen.width = Math.ceil(maxWidth + extraWidthBuffer);
                offscreen.height = Math.ceil(totalHeight);
                
                // Clear and redraw
                offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
                offCtx.font = `${this.options.fontWeight} ${fontSizeStr} ${computedFontFamily}`;
                offCtx.textBaseline = 'alphabetic';
                offCtx.fillStyle = this.options.color;
                
                // Draw lines
                let currentY = lineMetrics[0].ascent;
                for (let i = 0; i < this.lines.length; i++) {
                    const line = this.lines[i];
                    const metrics = lineMetrics[i];
                    const x = (offscreen.width - metrics.width) / 2;
                    
                    offCtx.fillText(line, x, currentY);
                    
                    // Move to next line position
                    if (i < this.lines.length - 1) {
                        currentY += lineHeight;
                    }
                }
                
                this.offscreen = offscreen;
                this.offscreenWidth = offscreen.width;
                this.tightHeight = offscreen.height;
                this.xOffset = 0;
                
                // Set main canvas dimensions
                const horizontalMargin = 50;
                const verticalMargin = 20;
                this.canvas.width = offscreen.width + horizontalMargin * 2;
                this.canvas.height = offscreen.height + verticalMargin * 2;
                this.ctx.translate(horizontalMargin, verticalMargin);
                
                // Set interactive area
                this.interactiveLeft = horizontalMargin;
                this.interactiveTop = verticalMargin;
                this.interactiveRight = this.interactiveLeft + offscreen.width;
                this.interactiveBottom = this.interactiveTop + offscreen.height;
                
                this.fuzzRange = 30;
            }
            
            getNumericFontSize() {
                if (typeof this.options.fontSize === 'number') {
                    return this.options.fontSize;
                }
                
                const temp = document.createElement('span');
                temp.style.fontSize = this.options.fontSize;
                document.body.appendChild(temp);
                const computedSize = window.getComputedStyle(temp).fontSize;
                document.body.removeChild(temp);
                return parseFloat(computedSize);
            }
            
            runAnimation() {
                if (this.isCancelled) return;
                
                this.ctx.clearRect(
                    -this.fuzzRange,
                    -this.fuzzRange,
                    this.offscreenWidth + 2 * this.fuzzRange,
                    this.tightHeight + 2 * this.fuzzRange
                );
                
                const intensity = this.isHovering ? 
                    this.options.hoverIntensity : 
                    this.options.baseIntensity;
                
                for (let j = 0; j < this.tightHeight; j++) {
                    const dx = Math.floor(intensity * (Math.random() - 0.5) * this.fuzzRange);
                    this.ctx.drawImage(
                        this.offscreen,
                        0,
                        j,
                        this.offscreenWidth,
                        1,
                        dx,
                        j,
                        this.offscreenWidth,
                        1
                    );
                }
                
                this.animationFrameId = requestAnimationFrame(() => this.runAnimation());
            }
            
            isInsideTextArea(x, y) {
                return (
                    x >= this.interactiveLeft &&
                    x <= this.interactiveRight &&
                    y >= this.interactiveTop &&
                    y <= this.interactiveBottom
                );
            }
            
            handleMouseMove(e) {
                if (!this.options.enableHover) return;
                
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.isHovering = this.isInsideTextArea(x, y);
            }
            
            handleMouseLeave() {
                this.isHovering = false;
            }
            
            handleTouchMove(e) {
                if (!this.options.enableHover) return;
                e.preventDefault();
                
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                
                this.isHovering = this.isInsideTextArea(x, y);
            }
            
            handleTouchEnd() {
                this.isHovering = false;
            }
            
            setupEventListeners() {
                if (this.options.enableHover) {
                    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
                    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
                    this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
                    this.canvas.addEventListener('touchend', () => this.handleTouchEnd());
                }
            }
            
            updateOptions(newOptions) {
                this.options = { ...this.options, ...newOptions };
                
                // Cancel current animation
                cancelAnimationFrame(this.animationFrameId);
                
                // Remove existing event listeners
                this.removeEventListeners();
                
                // Reinitialize
                this.isCancelled = false;
                this.init();
            }
            
            removeEventListeners() {
                if (this.options.enableHover) {
                    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
                    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
                    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
                    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
                }
            }
            
            destroy() {
                this.isCancelled = true;
                cancelAnimationFrame(this.animationFrameId);
                this.removeEventListeners();
            }
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            const canvas = document.getElementById('fuzzyCanvas');
            const textInput = document.getElementById('textInput');
            const baseIntensitySlider = document.getElementById('baseIntensity');
            const hoverIntensitySlider = document.getElementById('hoverIntensity');
            const enableHoverCheckbox = document.getElementById('enableHover');
            const applyBtn = document.getElementById('applyBtn');
            const demo1Btn = document.getElementById('demo1Btn');
            const demo2Btn = document.getElementById('demo2Btn');
            const resetBtn = document.getElementById('resetBtn');
            const baseValueDisplay = document.getElementById('baseValue');
            const hoverValueDisplay = document.getElementById('hoverValue');
            
            // Create initial fuzzy text
            const fuzzyText = new FuzzyText(canvas, {
                text: '404\nnot found',
                baseIntensity: 0.2,
                hoverIntensity: 0.5,
                enableHover: true
            });
            
            // Update displays
            baseValueDisplay.textContent = baseIntensitySlider.value;
            hoverValueDisplay.textContent = hoverIntensitySlider.value;
            
            // Event listeners
            baseIntensitySlider.addEventListener('input', () => {
                baseValueDisplay.textContent = baseIntensitySlider.value;
            });
            
            hoverIntensitySlider.addEventListener('input', () => {
                hoverValueDisplay.textContent = hoverIntensitySlider.value;
            });
            
            applyBtn.addEventListener('click', () => {
                fuzzyText.updateOptions({
                    text: textInput.value,
                    baseIntensity: parseFloat(baseIntensitySlider.value),
                    hoverIntensity: parseFloat(hoverIntensitySlider.value),
                    enableHover: enableHoverCheckbox.checked
                });
            });
            
            demo1Btn.addEventListener('click', () => {
                textInput.value = 'HELLO\nWORLD';
                baseIntensitySlider.value = 0.3;
                hoverIntensitySlider.value = 0.8;
                enableHoverCheckbox.checked = true;
                baseValueDisplay.textContent = '0.3';
                hoverValueDisplay.textContent = '0.8';
                
                fuzzyText.updateOptions({
                    text: 'HELLO\nWORLD',
                    baseIntensity: 0.3,
                    hoverIntensity: 0.8,
                    enableHover: true
                });
            });
            
            demo2Btn.addEventListener('click', () => {
                textInput.value = 'FUZZY\nTEXT';
                baseIntensitySlider.value = 0.1;
                hoverIntensitySlider.value = 0.3;
                enableHoverCheckbox.checked = true;
                baseValueDisplay.textContent = '0.1';
                hoverValueDisplay.textContent = '0.3';
                
                fuzzyText.updateOptions({
                    text: 'FUZZY\nTEXT',
                    baseIntensity: 0.1,
                    hoverIntensity: 0.3,
                    enableHover: true
                });
            });
            
            resetBtn.addEventListener('click', () => {
                textInput.value = '404\nnot found';
                baseIntensitySlider.value = 0.2;
                hoverIntensitySlider.value = 0.5;
                enableHoverCheckbox.checked = true;
                baseValueDisplay.textContent = '0.2';
                hoverValueDisplay.textContent = '0.5';
                
                fuzzyText.updateOptions({
                    text: '404\nnot found',
                    baseIntensity: 0.2,
                    hoverIntensity: 0.5,
                    enableHover: true
                });
            });
        });