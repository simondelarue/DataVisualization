/* ---------------------------- */
/* SET UP                       */
/* ---------------------------- */ 

var margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20); 

var raw_data = [];
var radar_data = [[
        {axis:"Attractiveness", value:22.514618/100},
        {axis:"Sincerity", value:17.305969/100},
        {axis:"Intelligence", value:20.195282/100},
        {axis:"Fun", value:17.44558/100},
        {axis:"Ambition", value:10.821216/100}
    ]
];

let selection_gender = 0 ;
let selection_question = 41;

let genders = ['All', 'Female', 'Male'];


/* ---------------------------- */
/* CANVAS                       */
/* ---------------------------- */

// Gender dropdown menu
let genderDropdownButton = d3.select("#genderDropdownButton")
      .selectAll('myOptions')
     	.data(genders)
      .enter()
    	.append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return map_gender(d); }) // corresponding value returned by button

// Clear Button
let clearButton = d3.select("body")
    .append("button") 
        .attr("class", "clearButton")
        .attr("type", "button")
        .text("Clear")
        .style("position", "absolute")
        .style("top", "0")
        .style("left", "100")    
        .on("click", callbackClearButton);

/* ---------------------------- */
/* FUNCTIONS                    */
/* ---------------------------- */

// Mapping gender function
function map_gender(gender){
    if (gender=="All"){
        return 0.5;
    } else {
        if (gender=="Female"){
            return 0;
        } else {
            return 1;
        }
    }
}

// Draw function
function draw(data, gender, question){
    for (let i=0; i<data.length; i++){
        if ((data[i].gender == gender) && (data[i].question==question)){
            radar_data.push([
                {axis:"Attractiveness", value:data[i].attr},
                {axis:"Ambition", value:data[i].amb},
                {axis:"Fun", value:data[i].fun},
                {axis:"Sincerity", value:data[i].sinc},
                {axis:"Intelligence", value:data[i].intel}
            ]);
        }
    }
}

// Update function
function update(selectedGender){
    for (let i=0; i<raw_data.length; i++){
        if ((raw_data[i].gender == selectedGender)){
            radar_data.push([
                {axis:"Attractiveness", value:raw_data[i].attr},
                {axis:"Ambition", value:raw_data[i].amb},
                {axis:"Fun", value:raw_data[i].fun},
                {axis:"Sincerity", value:raw_data[i].sinc},
                {axis:"Intelligence", value:raw_data[i].intel}
            ]);
        }
    }
    console.log('Size of radar data : ' + radar_data.length)
    //Call function to draw the Radar chart
    RadarChart(".radarChart", radar_data, radarChartOptions);
}


/* ---------------------------- */
/* CALLBACKS                    */
/* ---------------------------- */

// Callback on gender update
d3.select("#genderDropdownButton")
    .on("change", function(d) {
        var selectedOption = d3.select(this).property("value")
        update(selectedOption)
    })

// Callback clear button
function callbackClearButton(d){
    radar_data = [[
        {axis:"Attractiveness", value:0},
        {axis:"Sincerity", value:0},
        {axis:"Intelligence", value:0},
        {axis:"Fun", value:0},
        {axis:"Ambition", value:0}
        ]
    ];
    console.log('Size of radar data : 0')
    RadarChart(".radarChart", radar_data, radarChartOptions);
}

/* ---------------------------- */
/* RADAR OPTIONS                */
/* ---------------------------- */

var color = d3.scale.ordinal()
    .range(["#EDC951","#CC333F","#00A0B0"]);
    
var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.35,
    levels: 5,
    roundStrokes: true,
    color: color
};

/* ---------------------------- */
/* LOAD DATA                    */
/* ---------------------------- */

// Load data from .tsv file with d3 + preprocess them
d3.csv("preprocessed_data/radar.csv")
    .row( (d, i) => {
        return {
            gender: +d.gender,
            attr: +d.attr/100,
            sinc: +d.sinc/100,
            intel: +d.intel/100,
            fun: +d.fun/100,
            amb: +d.amb/100,
            question: +d.question,
        };
    })
    // Creates get Data and calls Draw function
    .get( (error, rows) => {
        console.log("Loaded " + rows.length + " rows");
        if (rows.length > 0) {
            raw_data = rows; // Fill global var dataset with rows
            //draw(raw_data, selection_gender, selection_question); 
            //Call function to draw the Radar chart
            RadarChart(".radarChart", radar_data, radarChartOptions);
        }
    });
