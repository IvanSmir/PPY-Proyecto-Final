
    document.addEventListener('DOMContentLoaded', function() {
        var startButton = document.getElementById('start');
        
        startButton.addEventListener('click', function() {
            document.getElementById("contenido").classList.add('fade-out');
            setTimeout(function() {
                window.location.href = 'map.html'; 
            }, 1000); 
        });
    });


    