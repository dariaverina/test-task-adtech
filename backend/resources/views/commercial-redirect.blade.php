<!DOCTYPE html>
<html>
<head>
    <title>Редирект</title>
    <style>
        body { 
            font-family: sans-serif; 
            text-align: center; 
            padding: 20px; 
            background: #f0f0f0; 
        }
        img { 
            max-width: 100%; 
            max-height: 300px; 
            margin: 20px 0; 
            border-radius: 8px; 
        }
        .timer { 
            font-size: 40px; 
            color: #2196f3; 
            font-weight: bold; 
            margin: 10px 0; 
        }
    </style>
</head>
<body>
    <h2>Рекламная пауза</h2>
    
    <img src="{{ asset('images/ad' . ($randomImage ?? 1) . '.jpg') }}" 
         onerror="this.src='https://via.placeholder.com/400x300?text=Реклама'">
    
    <div class="timer" id="timer">5</div>
    <div>Перенаправление через <span id="seconds">5</span> сек</div>
    
    <p><a href="{{ $original_url }}">Перейти сейчас</a></p>

    <script>
        let sec = 5;
        const timer = document.getElementById('timer');
        const span = document.getElementById('seconds');
        
        setInterval(() => {
            sec--;
            timer.textContent = sec;
            span.textContent = sec;
            if (sec <= 0) window.location.href = '{{ $original_url }}';
        }, 1000);
    </script>
</body>
</html>