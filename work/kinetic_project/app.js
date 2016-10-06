(function() {
  var gradients = [];
  var currentGradient = 0; 
  var backgrounds = [ '#ffffff', '#000000' ];
  var currentBackground = 0;

  $.getJSON("gradients.json", function(data) {
    gradients = data;
    
    nextGradient();
    defineBackground();
  });
  
  $('#zinnia-touch').on('touchstart click',function(e) {
    e.preventDefault();
    e.stopPropagation();
    nextGradient();    
  });

  $(document).on('touchstart click',function(e) {
    e.preventDefault();
    e.stopPropagation();
    nextBackground();    
  });

  function nextGradient() {
    currentGradient = getRandomInt(0, gradients.length - 1);
    defineGradient();
  }

  function nextBackground() {
    currentBackground = (currentBackground + 1) % backgrounds.length;
    defineBackground();
  }
  
  function defineGradient() {       
      var gradient = gradients[currentGradient];
      var svgGradients = [
        d3.select("#zinnia1-gradient"),
        d3.select("#zinnia2-gradient")
      ];
      
      for (var i = 0; i < svgGradients.length; i++) {
        var svgGradient = svgGradients[i];
        setGradient(svgGradient, gradient);
      }
  }

  function defineBackground() {
    var bg = backgrounds[currentBackground];     
    $(document.body).css("background-color", bg);
  }
  
  function setGradient(svgGradient, gradient) {
    svgGradient.selectAll(".zinnia-stop").remove();
    var step = gradient.colors.length === 2 ? 1 :1 / gradient.colors.length - 1;
    
    for (var i = 0; i < gradient.colors.length; i++) {
      var color = gradient.colors[i];
      svgGradient.append('stop')
        .attr({
          class: "zinnia-stop",
          offset: function() { return i * step },
          "stop-color": color
        });
    }
  }
  
  // utilities
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
})()