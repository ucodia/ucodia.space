(function() {
    // app settings
    var settings = {};
    settings.diceSize = 30;
    settings.diceCorner = settings.diceSize / 5;
    settings.dotSize = settings.diceSize / 10;
    
    // app data
    var dataset = [];

    // add svg
    var svg = d3.select("body").append("svg");
    
    // hookup events
    window.addEventListener('resize', function() {
        layout();
        gen();
        draw();
    });
    document.addEventListener('click', function() {
        gen();
        draw();
    });
    
    // startup
    layout();
    gen();
    draw();
        
    function layout() {
        svg.attr("width", window.innerWidth);
        svg.attr("height", window.innerHeight);
        settings.columns = Math.ceil(window.innerWidth / settings.diceSize);
        settings.rows = Math.ceil(window.innerHeight / settings.diceSize);
    }
    
    function gen() {
        var count = settings.columns * settings.rows;
        dataset.splice(0, count);
        
        for (var i = 0; i < count; i++) {
            dataset[i] = {
                value: randomInt(1, 6),
                orientation: randomInt(0, 1)
            }
        }
    }
    
    function draw() {
        // data join
        var dice = svg.selectAll(".dice")
            .data(dataset);
        
        // add new elements
        var entering = dice.enter().append("g")
            .attr("class", "dice");
        
        appendDiceTo(entering);
        
        // update elements
        dice.attr("class", function(d, i) { return "dice dice" + d.value; })
            .attr("transform", function(d, i) {
                var col = i % settings.columns;
                var row = Math.floor(i / settings.columns);
                return "translate(" + col * settings.diceSize + "," + row * settings.diceSize + ") " +
                        "rotate(" + d.orientation * 90 + ", " + settings.diceSize / 2 + ", " + settings.diceSize / 2 + ")"; 
            });

        // remove old elements
        var exiting = dice.exit();
        exiting.remove();
    }
    
    function appendDiceTo(element) {
        element.append("rect")
            .attr("class", "outline")
            .attr("width", settings.diceSize)
            .attr("height", settings.diceSize)
            .attr("rx", settings.diceCorner)
            .attr("ry", settings.diceCorner);
        
        for (var i = 0; i < 9; i++) {
            element.append("ellipse")
                .attr("class", "dot dot" + (i + 1))
                .attr("cx", settings.diceSize / 4 * ((i % 3) + 1))
                .attr("cy", settings.diceSize / 4 * (Math.floor(i / 3) + 1))
                .attr("rx", settings.dotSize)
                .attr("ry", settings.dotSize);
        }
    }
    
    function randomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
})();