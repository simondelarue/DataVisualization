/* ============================ */
/* RADAR CHART SCRIPT           */
/* ============================ */ 

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
// These values are for All genders, on question 1 and 2 at time 1
var radar_data = [[
        {axis:"Attractiveness", value:22.514618/100},
        {axis:"Sincerity", value:17.305969/100},
        {axis:"Intelligence", value:20.195282/100},
        {axis:"Fun", value:17.44558/100},
        {axis:"Ambition", value:10.821216/100}
    ], [
        {axis:"Attractiveness", value:30.242579/100},
        {axis:"Sincerity", value:13.196501/100},
        {axis:"Intelligence", value:14.416354/100},
        {axis:"Fun", value:18.548026/100},
        {axis:"Ambition", value:11.735934/100}
    ]
];

// All possible genders and questions
let genders = ['All', 'Female', 'Male'];
let questions = ['What you look for in the opposite sex ?', 
                'What do you think the opposite sex looks for in a date ?', 
                'How do you think you measure up ?', 
                'What you think MOST of your fellow men/women look for in the opposite sex?'];

// Inital values for selections in dropdown menus and selectors
let selectedGender = 0.5,
    selectedQuestion = '1',
    selectedTime = '1';

// Questions displayed at webpage opening
let questionLegend = ['What you look for in the opposite sex ?', 
                      'What do you think the opposite sex looks for in a date ?'];

// Boolean var that keep tracks of user hitting "clear" button
// Legend and data actions are done according this value
let clearedOnce = false;

// History of choices. Default value corresponds to combination of default values
// for selectedQuestion and selectedGender respectively
let history = ["1_0.5", "2_0.5"];


/* ---------------------------- */
/* CANVAS                       */
/* ---------------------------- */

/* Radar Information */
let radar_info_container = d3.select(".radarChart")
    .append("div")
        .attr("class", "radar-info-container");

let radar_info_title = radar_info_container.append("div")
    .attr("class", "radar-info-title")
    .append("p")
        .attr("class", "radar-info-title-text")
            .text("Reading grid")

let radar_info = radar_info_container.append("div")
    .attr("class", "radar-info")
    .append("p")
        .attr("class", "radar-info-text")
        .html("<span class='time-span'>Before speed dating</span>, <span class='lookfor-text'>people tend to look for attractive person (23%) first, and give less importance to ambition (11%).</span> <br/><br/><span class='oppos-lookfor-text'>On average, people think opposite sex is looking for attractiveness first (30%) and gives less importance to ambition (11%).</span> </br></br> It is interesting to note that on the attractiveness characteristic, the difference between what people are looking for and what they think other people are looking for is over 30%.<br/><br/><strong>Try to use filters and time slider to get a better understanding on rating's evolution !</strong>");

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
let clearButton = d3.select(".radarChart")
    .append("button") 
        .attr("class", "clearButton")
        .attr("type", "button")
        .text("Clear") 
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
        case "What you look for in the opposite sex ?": {return '1'};
        case "What do you think the opposite sex looks for in a date ?": {return '2'};
        case "How do you think you measure up ?": {return '3'};
        case "What you think MOST of your fellow men/women look for in the opposite sex?": {return '4'};
        default: console.log("Error in question");
    }
}

// Mapping question function reversed
function map_question_reversed(number){
    switch (number){
        case "1": {return "What you look for in the opposite sex ?"};
        case "2": {return "What do you think the opposite sex looks for in a date ?"};
        case "3": {return "How do you think you measure up ?"};
        case "4": {return "What you think MOST of your fellow men/women look for in the opposite sex?"};
        default: console.log("Error in reversed question");
    }
}

// Build history key format
function history_key(question, gender) {
    return question[0] + '_' + String(gender);
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
    console.log('Update triggered');

    for (let i=0; i<raw_data.length; i++){
        if ((raw_data[i].gender == updatedGender) && (raw_data[i].question[0] == updatedQuestion)
            && (raw_data[i].question[1] == selectedTime)){
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

// Update function according to time slider
// After update, RadarChart function is called on every request saved in history, with corresponding time
function update_time(hist, updatedTime) {
    console.log('Update time triggered');
    console.log('hist : ' + hist);

    radar_data_time = [];

    for (let req=0; req<hist.length; req++){
        for (let i=0; i<raw_data.length; i++){
            if ((raw_data[i].gender == hist[req].substr(2)) &&
                (raw_data[i].question[0] == hist[req][0]) &&
                (raw_data[i].question[1] == updatedTime)) {
                    radar_data_time.push([
                        {axis:"Attractiveness", value:raw_data[i].attr},
                        {axis:"Ambition", value:raw_data[i].amb},
                        {axis:"Fun", value:raw_data[i].fun},
                        {axis:"Sincerity", value:raw_data[i].sinc},
                        {axis:"Intelligence", value:raw_data[i].intel}
                    ])
                }
        }
        RadarChart(".radarChart", radar_data_time, radarChartOptions, questionLegend)
    }
}


/* ---------------------------- */
/* CALLBACKS                    */
/* ---------------------------- */

// Callback on gender update
d3.select("#genderDropdownButton")
    .on("change", function(d) {
        selectedGender = d3.select(this).property("value")

        // Update only if one of the selections is different from what's currently displayed
        if (!(history.includes(history_key(selectedQuestion, selectedGender)))) {
            // Fill history
            history.push(history_key(selectedQuestion, selectedGender));
            console.log('history after gender update : ' + history)
            // Complete legend array and add information about gender in legend
            if (selectedGender=="0") {
                questionLegend.push(map_question_reversed(selectedQuestion) + " (F)");    
            } else {
                if (selectedGender=="1") {
                    questionLegend.push(map_question_reversed(selectedQuestion) + " (M)");
                } else {
                    questionLegend.push(map_question_reversed(selectedQuestion));
                }
            }
            // Update Radar chart
            update(selectedGender, selectedQuestion)
        }
    });

// Callback on question update
d3.select("#questionDropdownButton")
    .on("change", function(d) {
        selectedQuestion = d3.select(this).property("value")

        // Update only if one of the selections is different from what's currently displayed
        if (!(history.includes(history_key(selectedQuestion, selectedGender)))) {
            // Fill history
            history.push(history_key(selectedQuestion, selectedGender));
            console.log('history after question update : ' + history)
            // Complete legend array
            if (selectedGender=="0") {
                questionLegend.push(map_question_reversed(selectedQuestion) + " (F)");    
            } else {
                if (selectedGender=="1") {
                    questionLegend.push(map_question_reversed(selectedQuestion) + " (M)");
                } else {
                    questionLegend.push(map_question_reversed(selectedQuestion));
                }
            }
            // Update Radar chart
            update(selectedGender, selectedQuestion)
        }
    })

// Callback on Time slider
d3.select("#myRange")
    .on("change", function(d) {
        selectedTime = d3.select(this).property("value")
        // Update time value for every displayed chart
        console.log('SELECTED TIME : ', selectedTime);
        // Update Radar chart
        console.log('History ' + history + ' selectedTime ' + selectedTime);
        update_time(history, selectedTime);
    })

// Callback clear button
function callbackClearButton(d){

    clearedOnce = true;
    // Clear history of user's selections
    history = [];

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
    .range(["#a6cee3", "#fb9a99", "#b2df8a",
            "#fdbf6f", "#ff7f00", "#cab2d6", "#8dd3c7", "#1f78b4"])
    
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
d3.csv("../static/preprocessed_data/radar_all.csv")
    .row( (d, i) => {
        if (d.question[0]=="3") {
            let points = d3.sum([+d.attr, +d.sinc, +d.intel, +d.fun, +d.amb]);
            return {
                gender: +d.gender,
                attr: +d.attr/points,
                sinc: +d.sinc/points,
                intel: +d.intel/points,
                fun: +d.fun/points,
                amb: +d.amb/points,
                question: (+d.question).toString(),
            };
        } else {
            return {
                gender: +d.gender,
                attr: +d.attr/100,
                sinc: +d.sinc/100,
                intel: +d.intel/100,
                fun: +d.fun/100,
                amb: +d.amb/100,
                question: (+d.question).toString(),
            };
        } 
    })
    // Creates get Data and calls Draw function
    .get( (error, rows) => {
        console.log("Loaded " + rows.length + " rows");
        if (rows.length > 0) {
            
            // Fill global var dataset with rows
            raw_data = rows; 

            //Call function to draw the Radar chart
            RadarChart(".radarChart", radar_data, radarChartOptions, questionLegend);
        }
    });
