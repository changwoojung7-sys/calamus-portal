document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const dreamInput = document.getElementById('dreamInput');
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');

    analyzeBtn.addEventListener('click', async () => {
        const dreamText = dreamInput.value.trim();

        if (!dreamText) {
            alert("꿈 내용을 입력해주세요!");
            return;
        }

        // UI Loading State
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<span class="icon">⌛</span> 해몽 중입니다... (약 10초 소요)';

        // Hide previous result properly
        resultCard.classList.remove('show');
        resultCard.style.display = 'none';
        resultContent.innerHTML = '';

        try {
            // 1. Call API (Local Mock or Cloudflare Function)
            const response = await fetch('/api/dream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dream: dreamText })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "서버 통신 오류");
            }

            const data = await response.json();

            // 2. Show Result
            resultCard.style.display = 'block'; // Explicitly set to block to override 'none'
            // Trigger reflow to restart animation if needed
            void resultCard.offsetWidth;
            resultCard.classList.add('show');

            // Typewriter Effect (Simple & Safe)
            typeWriter(data.result, resultContent);

        } catch (error) {
            alert("오류가 발생했습니다: " + error.message);
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<span class="icon">🔮</span> 해몽 다시하기';
        }
    });

    // Typewriter Effect Function
    function typeWriter(text, element) {
        element.innerHTML = "";
        let i = 0;
        const speed = 15;

        function type() {
            if (i < text.length) {
                // Just append characters safely
                // For better UX with markdown, we can render full markdown at end
                // We use white-space: pre-wrap in CSS, so \n works as newline
                element.append(text.charAt(i));
                i++;
                setTimeout(type, speed);
            } else {
                // Final formatting: Convert **bold** to <strong>
                // AND ensure we don't break the text we just typed
                element.innerHTML = text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            }
        }
        type();
    }
});
