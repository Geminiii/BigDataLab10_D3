$(document).ready(function(){ 
//config
    var SVG = {
      paddingBottom: 30,
      paddingLeft: 50
    }

    //setup svg
  	var margin = {top:60, right: 40, bottom: 60, left: 40},
        width = 500 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom,
        svg = d3.select("svg")
                .attr("width",width)
                .attr("height",height)
                .append("g");

    // add the tooltip area to the webpage
    var tooltip = d3.select("#hovered")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var 
    xScale = d3.scale.linear().range([0, width-65]), 
    yScale = d3.scale.linear().range([height, 50]), 
    xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
    yAxis = d3.svg.axis().scale(yScale).orient("left");

    // load data
    d3.csv("car.csv", function(error, data) {
      
      // change string (from CSV) into number format
      data.forEach(function(d) {
        d.mpg= +d.mpg,
        d.cylinders= +d.cylinders,
        d.displacement= +d.displacement,
        d.horsepower= +d.horsepower,
        d.weight= +d.weight,
        d.acceleration= +d.acceleration,
        d.modelyear= d["model.year"];
      });
      //xScale = d3.scale.linear().domain([0, d3.max(data, "mpg")+1]).range([0, width-55]), 
      //yScale = d3.scale.linear().domain([0, d3.max(data, "mpg")+1]).range([height, 50]), 
      // data domain
      xScale.domain([0, d3.max(data, function(d) { return d[$('#sel-x').val()];})+1]).range([0, width-65]);
      yScale.domain([0, d3.max(data, function(d) { return d[$('#sel-y').val()];})+1]).range([height, 50]);

      // x-axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(" + SVG.paddingLeft + ", " + (height - SVG.paddingBottom) + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width-65)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text($('#sel-x').val());
      // y-axis
      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + SVG.paddingLeft + "," + (-SVG.paddingBottom) + ")")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("x", -50)
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text($('#sel-y').val());

      // draw dots
      var dots = svg.selectAll(".dots")
                    .data(data);

      dots.enter()
        .append("circle")
          .attr("class", "dots")
          .attr("r", 2)
          .attr("cx", function(d) { return d[$('#sel-x').val()];})
          .attr("cy", function(d) { return d[$('#sel-y').val()];})
          .style("fill", "#3399FF") 
          .on("mouseover", function(d) {
              tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
              tooltip.html(d["name"] + "<br/>")
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
          });
      //Update when x-axis change
      $('#sel-x').change(function(){
        xScale.domain([0, d3.max(data, function(d) { return d[$('#sel-x').val()]; })]);
        //yScale.domain([0, d3.max(data, function(d) { return d[$('#sel-y').val()]; })]);

        if ($('#sel-x').val()=="model.year") {
          xScale.domain([d3.min(data, function(d) { return d[$('#sel-x').val()]; })-5, d3.max(data, function(d) { return d[$('#sel-x').val()]; })]);
        }
        
        dots
          .transition()
          .duration(1000)
          .attr("cx", function (d) { return xScale(d[$('#sel-x').val()]);})
          .attr("cy", function (d) { return yScale(d[$('#sel-y').val()]);});
        
        svg.select(".x.axis")
            .transition()
            .duration(1000)
            .call(xAxis)
            .select(".label")
            .text($('#sel-x').val());
      });
      //Update when y-axis change
      $('#sel-y').change(function(){
        //xScale.domain([0, d3.max(data, function(d) { return d[$('#sel-x').val()]; })]);
        yScale.domain([0, d3.max(data, function(d) { return d[$('#sel-y').val()]; })]);
        
        if ($('#sel-y').val()=="model.year") {
          yScale.domain([d3.min(data, function(d) { return d[$('#sel-y').val()]; })-5, d3.max(data, function(d) { return d[$('#sel-y').val()]; })]);
        }

        dots.transition()
            .duration(1000)
            .attr("cx", function (d) { return xScale(d[$('#sel-x').val()]);})
            .attr("cy", function (d) { return yScale(d[$('#sel-y').val()]);});
        
        svg.select(".y.axis")
            .transition()
            .duration(1000)
            .call(yAxis)
            .select(".label")
            .text($('#sel-y').val());
      });

      var allData = data;
      //Update when query
      $('#update').click(function(){
        var queriedData = data.filter(function(d){ return d['mpg'] > +$('#mpg-min').val() && d['mpg'] < +$('#mpg-max').val()});
        var queriedDots = svg.selectAll(".dots").data(queriedData);
      xScale.domain([0, d3.max(queriedData, function(d) { return d[$('#sel-x').val()];})+1]).range([0, width-65]);
      yScale.domain([0, d3.max(queriedData, function(d) { return d[$('#sel-y').val()];})+1]).range([height, 50]);

        queriedDots.enter()
                  .append("circle")
                  .transition()
                  .duration(1000)
                  .attr("cx", function(d) { return d[$('#sel-x').val()];})
                  .attr("cy", function(d) { return d[$('#sel-y').val()];})
        queriedDots.exit().remove();
      });

      dots.exit().remove();
    });

});