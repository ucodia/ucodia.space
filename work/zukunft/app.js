(function() {
    // app settings
    var settings = {
        tileSize: 25
    };
    
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
        setup();
        gen();
        redraw();
    });
    document.addEventListener('click', function() {
        gen();
        redraw();
    });
    
    // startup
    setup();
    gen();
    draw();
        
    function setup() {
        svg.attr("width", window.innerWidth);
        svg.attr("height", window.innerHeight);
        settings.columns = Math.ceil(window.innerWidth / settings.tileSize);
        settings.rows = Math.ceil(window.innerHeight / settings.tileSize);
    }
    
    function gen() {
        dataset = [];
        
        for (var i = 0; i < settings.columns * settings.rows; i++) {
            dataset[i] = {
                value: randomInt(1, 6),
                orientation: randomInt(0, 1)
            }
        }
    }
    
    function draw() {
        // bind data
        var g = svg.selectAll('g')
            .data(dataset)
            .enter()
                .append('g')
                .classed('dice', true)
                .attr("transform", function(d, i) {
                    var col = i % settings.columns;
                    var row = Math.floor(i / settings.columns);
                    return "translate(" + col * settings.tileSize + "," + row * settings.tileSize + ") " +
                        "rotate(" + d.orientation * 90 + ", " + settings.tileSize / 2 + ", " + settings.tileSize / 2 + ")"; 
                });    
        
        // add outline
        g.append('rect')
            .attr("width", settings.tileSize)
            .attr("height", settings.tileSize)
            .attr("rx", settings.tileSize / 10)
            .attr("ry", settings.tileSize / 10)
            .classed("outline", true);
        
        // add dots
        for (var i = 0; i < 9; i++) {
            g.append('ellipse')
                .attr("cx", settings.tileSize / 4 * ((i % 3) + 1))
                .attr("cy", settings.tileSize / 4 * (Math.floor(i / 3) + 1))
                .attr("rx", settings.tileSize / 10)
                .attr("ry", settings.tileSize / 10)
                .style("visibility", function(d) {
                    return facts[d.value].indexOf(i) === -1 ? "hidden" : "visible";
                })
                .classed("dot", true);
        }
    }
    
    function redraw() {
        svg.selectAll('.dice').remove();
        draw();
    }
    
    function randomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
})()