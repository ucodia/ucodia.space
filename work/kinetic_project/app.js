(function() {
    var gradients = [];

    
    $.getJSON("gradients.json", function(data) {
        gradients = data;
        
        // try to get gradient from URL
        var sel = null;      
        try { sel = JSON.parse(getParameterByName("style")); }
        catch (error) {}
        
        // if there is no proper URL defined gradient
        if (typeof(sel) !== 'number' || sel < 0 || sel > gradients.length - 1)
            sel = getRandomInt(0, gradients.length - 1);
        
        defineGradients(gradients[sel]);
    });
    
    $("#content").click(function() {
        var sel = getRandomInt(0, gradients.length - 1);
        defineGradients(gradients[sel]);
    });
    
    function defineGradients(gradient) {
        var svgGradients = [
            d3.select("#zinnia1-gradient"),
            d3.select("#zinnia2-gradient")
        ];
        
        for (var i = 0; i < svgGradients.length; i++) {
            var svgGradient = svgGradients[i];
            setGradient(svgGradient, gradient);
        }
    }
    
    function setGradient(svgGradient, gradient) {
        svgGradient.html("");
        var step = gradient.colors.length === 2 ? 1 :1 / gradient.colors.length - 1;
        
        for (var i = 0; i < gradient.colors.length; i++) {
            var color = gradient.colors[i];
            svgGradient.append('stop')
                .attr({
                    offset: function() { return i * step },
                    "stop-color": color
                });
        }
    }
    
    // utilities
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
})()