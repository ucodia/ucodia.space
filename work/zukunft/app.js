(function() {
    // app settings
    var settings = {};
    settings.diceSize = 30;
    settings.diceCorner = settings.diceSize / 5;
    settings.dotSize = settings.diceSize / 10;
    
    // app data
    var dataset = [];
    
    // dice fact table
    var facts = [];
    facts[1] = [4];
    facts[2] = [2, 6];
    facts[3] = [2, 4, 6];
    facts[4] = [0, 2, 6, 8];
    facts[5] = [0, 2, 4, 6, 8];
    facts[6] = [0, 2, 3, 5, 6, 8];
    
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
        
        entering.append('rect')
            .attr("class", "outline")
            .attr("width", settings.diceSize)
            .attr("height", settings.diceSize)
            .attr("rx", settings.diceCorner)
            .attr("ry", settings.diceCorner);
        
        for (var i = 0; i < 9; i++) {
            entering.append("ellipse")
                .attr("class", "dot dot" + i)
                .attr("cx", settings.diceSize / 4 * ((i % 3) + 1))
                .attr("cy", settings.diceSize / 4 * (Math.floor(i / 3) + 1))
                .attr("rx", settings.dotSize)
                .attr("ry", settings.dotSize)
                .style("visibility", function(d) {
                    return facts[d.value].indexOf(i) === -1 ? "hidden" : "visible";
                });
        }
        
        // update elements
        dice.attr("transform", function(d, i) {
            var col = i % settings.columns;
            var row = Math.floor(i / settings.columns);
            return "translate(" + col * settings.diceSize + "," + row * settings.diceSize + ") " +
                    "rotate(" + d.orientation * 90 + ", " + settings.diceSize / 2 + ", " + settings.diceSize / 2 + ")"; 
        });
        
        for (var i = 0; i < 9; i++) {
            dice.select(".dot" + i)
                .style("visibility", function(d) {
                    return facts[d.value].indexOf(i) === -1 ? "hidden" : "visible";
                });
        } 

        // remove old elements
        var exiting = dice.exit();
        exiting.remove();
    }
    
    function randomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
})();