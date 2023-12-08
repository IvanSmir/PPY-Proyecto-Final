

let isZoomed = false;
let originalTransform = '';

document.getElementById('mapsvg').addEventListener('click', function(event) {
    var svg = document.getElementById('mapsvg');
    if (!isZoomed) {
        var svgRect = svg.getBoundingClientRect();
        var x = event.clientX - svgRect.left;
        var y = event.clientY - svgRect.top;

        var scale = 3; 
        var translateX = -x * (scale - 1);
        var translateY = -y * (scale - 1);

        originalTransform = svg.style.transform; 
        svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        isZoomed = true;
    } else{
        if (event.target.tagName === 'path') { 
            console.log('Círculo clickeado:', event.target.id);
        }
    }
});

document.getElementById("mapsvg").addEventListener('dblclick', function(event){
    var svg = document.getElementById('mapsvg');
    if(isZoomed){
        svg.style.transform = originalTransform; 
        isZoomed = false;
    }
})