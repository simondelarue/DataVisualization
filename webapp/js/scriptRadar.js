/* ---------------------------- */
/* SET UP                       */
/* ---------------------------- */ 

var margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 500 - margin.left - margin.right,
    height = width; 

// Raw data stores data directly from .csv files
var raw_data = [];

// Radar data stores data displayed at screen
// Below, initial values for radar chart when opening webpage
// These values are for All genders, on question 1_1
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

// Possible genders and questions
let genders = ['All', 'Female', 'Male'];
let questions = ['What you look for in the opposite sex ?', 
                'What do you think the opposite sex looks for in a date ?', 
                'How do you think you measure up ?', 
                'What you think MOST of your fellow men/women look for in the opposite sex?'];

// Inital values for selection in dropdown menus
let selectedGender = 0.5,
    selectedQuestion = 11;

// Question displayed at webpage opening
let questionLegend = ['What you look for in the opposite sex ?'];

// Boolean var that keep tracks of user hitting "clear" button
// Legend and data actions are done according this value
let clearedOnce = false;


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

// Questions dropdown menu
let questionDropdownButton = d3.select("#questionDropdownButton")
      .selectAll('myOptions')
     	.data(questions)
      .enter()
    	.append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return map_question(d); }) // corresponding value returned by button

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
    switch (gender){
        case "All": {return 0.5};
        case "Female": {return 0};
        case "Male": {return 1};
    }
}

// Mapping question function
function map_question(question){
    switch (question){
        case "What you look for in the opposite sex ?": {return 11};
        case "What do you think the opposite sex looks for in a date ?": {return 21};
        case "How do you think you measure up ?": {return 31};
        case "What you think MOST of your fellow men/women look for in the opposite sex?": {return 41};
        default: console.log("Error in question");
    }
}

// Mapping question function reversed
function map_question_reversed(number){
    switch (number){
        case "11": {return "What you look for in the opposite sex ?"};
        case "21": {return "What do you think the opposite sex looks for in a date ?"};
        case "31": {return "How do you think you measure up ?"};
        case "41": {return "What you think MOST of your fellow men/women look for in the opposite sex?"};
        default: console.log("Error in reversed question");
    }
}

// Preprocess function : Transform raw data to fit format required for radart chart
function preprocess(data, gender, question){
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

// Update function : triggered every time user selects field in dropdown menus
// After updating data, RadarChart function is called with updated values
function update(updatedGender, updatedQuestion){
    console.log('UPDATE triggered');
    for (let i=0; i<raw_data.length; i++){
        if ((raw_data[i].gender == updatedGender) && (raw_data[i].question == updatedQuestion)){
            if (clearedOnce){
                radar_data = [[
                    {axis:"Attractiveness", value:raw_data[i].attr},
                    {axis:"Ambition", value:raw_data[i].amb},
                    {axis:"Fun", value:raw_data[i].fun},
                    {axis:"Sincerity", value:raw_data[i].sinc},
                    {axis:"Intelligence", value:raw_data[i].intel}
                ]];
            } else {
                radar_data.push([
                    {axis:"Attractiveness", value:raw_data[i].attr},
                    {axis:"Ambition", value:raw_data[i].amb},
                    {axis:"Fun", value:raw_data[i].fun},
                    {axis:"Sincerity", value:raw_data[i].sinc},
                    {axis:"Intelligence", value:raw_data[i].intel}
                ]);
            }
        }        
    }
    clearedOnce = false;
    console.log('Size of radar data : ' + radar_data.length)
    //Call function to draw the Radar chart
    RadarChart(".radarChart", radar_data, radarChartOptions, questionLegend);
}


/* ---------------------------- */
/* CALLBACKS                    */
/* ---------------------------- */

// Callback on gender update
d3.select("#genderDropdownButton")
    .on("change", function(d) {
        selectedGender = d3.select(this).property("value")
        // Complete legend array
        questionLegend.push(map_question_reversed(selectedQuestion));
        // Update Radar chart
        update(selectedGender, selectedQuestion)
    });

// Callback on question update
d3.select("#questionDropdownButton")
    .on("change", function(d) {
        selectedQuestion = d3.select(this).property("value")
        // Complete legend array
        questionLegend.push(map_question_reversed(selectedQuestion));
        // Update Radar chart
        update(selectedGender, selectedQuestion)
    })

// Callback clear button
function callbackClearButton(d){

    clearedOnce = true;

    // Clear radar data
    radar_data = [[
        {axis:"Attractiveness", value:0},
        {axis:"Sincerity", value:0},
        {axis:"Intelligence", value:0},
        {axis:"Fun", value:0},
        {axis:"Ambition", value:0}
        ]
    ];

    // Clear question legend
    questionLegend = [];
    console.log('Size of radar data : 0')

    // Draw radar with no values
    RadarChart(".radarChart", radar_data, radarChartOptions, questionLegend);
};

/* ---------------------------- */
/* RADAR OPTIONS & LEGEND       */
/* ---------------------------- */

let color = d3.scale.ordinal()
    .range(["#EDC951","#CC333F","#00A0B0"]);
    
let radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.40,
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
            RadarChart(".radarChart", radar_data, radarChartOptions, questionLegend);
        }
    });