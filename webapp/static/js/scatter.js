/* ============================ */
/* SCATTER PLOT SCRIPT           */
/* ============================ */ 

/* ---------------------------- */
/* SET UP                       */
/* ---------------------------- */ 
// Raw data stores data directly from .csv files
var raw_data = [];

var margin = {top: 100, right: 100, bottom: 100, left: 50},
width = 650 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

let clearedOnce = false;
let genders = ['All', 'Female', 'Male'];
let features = ['Attractive Score', 'Same Religion', 'Often party','Often flirting']

// Inital values for selections in dropdown menus and selectors
let selectedGender = 0.5,
    selectedFeature = '1';

// Gender dropdown menu
let genderDropdownButton = d3.select("#genderDropdownButton-scatter")
    .selectAll('myOptions')
        .data(genders)
        .enter()
    	    .append('option')
                .text(function (d) { return d; }) // text showed in the menu
                .attr("value", function (d) { return map_gender(d); }) // corresponding value returned by button

     

// Features dropdown menu
let featureDropdownButton = d3.select("#featureDropdownButton-scatter")
.selectAll('myOptions')
   .data(features)
    .enter()
      .append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return map_feature(d); }) // corresponding value returned by button


// Mapping gender function
function map_gender(gender){
  switch (gender){
      case "All": {return 0.5};
      case "Female": {return 0};
      case "Male": {return 1};
  }
}

// Mapping feature function
function map_feature(feature){
  switch (feature){
      case "Attractive Score": {return 1};
      case "Same Religion": {return 3};
      case "Same Passion": {return 2};
      case "Often party": {return 4};
      case "Often flirting": {return 5};
      //default: console.log("Error in feature");
  }
}


let cols = ['match', 'attr_o', 'int_corr', 'imprelig', 'go_out', 'date', 'income', 'mn_sat']

function update(selectedGender, selectedFeature){
  //console.log(selectFeature)
  pathData = "../static/preprocessed_data/df_match_full.csv"

  if (selectedGender == 1) {
    pathData = "../static/preprocessed_data/df_match_male.csv"
  }
  if (selectedGender == 0) {
    pathData = "../static/preprocessed_data/df_match_female.csv"
  }

  draw(pathData, cols[ selectedFeature ])
  //clearedOnce = False
  

}

// Callback on question update

d3.select("#genderDropdownButton-scatter")
    .on("change", function(d) {
        selectedGender = d3.select(this).property("value")
        d3.select("svg").remove();
        update(selectedGender, selectedFeature)
    })


d3.select("#featureDropdownButton-scatter")
    .on("change", function(d) {
        selectedFeature = d3.select(this).property("value")
        //clearedOnce = True;
        d3.select("svg").remove();
        update(selectedGender, selectedFeature)
       })



function draw(dataPath, chosenFeature){
  d3.csv(dataPath, types, function(error, data){

    var regression; 

    let svg = d3.select("body")
    //.attr("class", "scatter-info-container")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 1200)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    svg.append("svg:image")
    .attr('x', 600)
    .attr('y', -60)
    .attr('width', 550)
    .attr('height', 550)
    .attr("xlink:href", "https://raw.githubusercontent.com/simondelarue/DataVisualization/main/notebooks/solar-correlation-map/solar_match.png")
  
    let x = d3.scaleLinear().domain([0, 100]).range([0, width]);
    let y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
      
    var xAxis = d3.axisBottom().scale(x);
    var yAxis = d3.axisLeft().scale(y);

    y.domain(d3.extent(data, function(d){ return d['match'] }));
    x.domain(d3.extent(data, function(d){ return d[chosenFeature] }));

    
    // see below for an explanation of the calcLinear function
    var lg = calcLinear(data, "x", "y", d3.min(data, function(d){ return +d[chosenFeature]}), d3.max(data, function(d){ return +d[chosenFeature]}));

    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom().scale(x));

  
    // text label for the x axis
    svg.append("text")
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
      .style("text-anchor", "middle");
  
    // Add the y Axis
    svg.append("g").call(d3.axisLeft(y));
  
    // text label for the y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Match Ratio");   
  
    svg.selectAll(".point")
        .data(data)
      .enter().append("circle")
        .attr("class", "point")
        .attr("r", 3)
        .attr("cy", function(d){ return y( d['match'] ); })
        .attr("cx", function(d){ return x( d[chosenFeature] ); });

    svg.append("g")
        .append("line")
        .attr("class", "regression")
        .attr("x1", x(lg.ptA.x))
        .attr("y1", y(lg.ptA.y))

        .attr("x2", x(lg.ptB.x))
        .attr("y2", y(lg.ptB.y));


  
  } );
}


function types(d){
d.x = +d.attr_o;
d.y = +d.match;

return d;
}

// Calculate a linear regression from the data

// Takes 5 parameters:
// (1) Your data
// (2) The column of data plotted on your x-axis
// (3) The column of data plotted on your y-axis
// (4) The minimum value of your x-axis
// (5) The minimum value of your y-axis

// Returns an object with two points, where each point is an object with an x and y coordinate

function calcLinear(data, x, y, minX, minY){
/////////
//SLOPE//
/////////

// Let n = the number of data points
var n = data.length;

// Get just the points
var pts = [];
data.forEach(function(d,i){
var obj = {};
obj.x = d[x];
obj.y = d[y];
obj.mult = obj.x*obj.y;
pts.push(obj);
});

// Let a equal n times the summation of all x-values multiplied by their corresponding y-values
// Let b equal the sum of all x-values times the sum of all y-values
// Let c equal n times the sum of all squared x-values
// Let d equal the squared sum of all x-values
var sum = 0;
var xSum = 0;
var ySum = 0;
var sumSq = 0;

pts.forEach(function(pt){
sum = sum + pt.mult;
xSum = xSum + pt.x;
ySum = ySum + pt.y;
sumSq = sumSq + (pt.x * pt.x);
});
var a = sum * n;
var b = xSum * ySum;
var c = sumSq * n;
var d = xSum * xSum;

// Plug the values that you calculated for a, b, c, and d into the following equation to calculate the slope
// slope = m = (a - b) / (c - d)
var m = (a - b) / (c - d);

/////////////
//INTERCEPT//
/////////////

// Let e equal the sum of all y-values
var e = ySum;
// Let f equal the slope times the sum of all x-values
var f = m * xSum;
// Plug the values you have calculated for e and f into the following equation for the y-intercept
// y-intercept = b = (e - f) / n
var b = (e - f) / n;

    // Print the equation below the chart
    //document.getElementsByClassName("body")[0].innerHTML = "y = " + m + " x + " + b;
    //document.getElementsByClassName("body")[1].innerHTML = "x = ( y - " + b + " ) / " + m;

// return an object of two points
// each point is an object with an x and y coordinate
return {
ptA : {
  x: minX,
  y: m * minX + b
},
ptB : {
  x: minY,
  y: m * minY + b
}
}

}