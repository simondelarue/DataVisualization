// ================
// Variables
// ================

// Filter svg geometry
const w_filter = 800;
const h_filter = 150;
let margin_filter = {left: 100, right: 100, top: 50, bottom: 50};

// Flower svg geometry
const w_flower = 700;
const h_flower = 450;
let margin_flower = {left: 50, right: 50, top: 50, bottom: 50};

// Ticket info svg geometry
const w_ticket = 500;
const h_ticket = 450;
let margin_ticket = {left: 50, right: 50, top: 50, bottom: 50};

// Data
let dataset = [];

// Filter svg  
let filter_svg = d3.select("body")
    .append("svg")
    .attr("class", "filter_svg")
    .style("position", "absolute")
    .style("top", 100)
    .style("left", 500)
    .style("width", margin_filter.left + w_filter + margin_filter.right)
    .style("height", margin_filter.top + h_filter + margin_filter.bottom);

// Flower svg
let flower_svg = d3.select("body")
    .append("svg")
    .attr("class", "flower_svg")
    .style("position", "absolute")
    .style("top", 100 + margin_filter.top + h_filter + margin_filter.bottom)
    .style("left", 200)
    .style("width", margin_flower.right + w_flower + margin_flower.left)
    .style("height", margin_flower.top + h_flower + margin_flower.bottom);

// Ticket div
let ticket_div = d3.select("body")
    .append("div")
    .attr("class", "ticket_svg")
    .style("position", "absolute")
    .style("top", 100 + margin_filter.top + h_filter + margin_filter.bottom)
    .style("left", 200 + margin_flower.left + w_flower + margin_flower.right)
    .style("width", margin_ticket.left + w_ticket + margin_ticket.right)
    .style("height", margin_ticket.top + h_ticket + margin_ticket.bottom);

// ================ 
// Functions
// ================

// ----------------
// Flower
// Constructor
// ----------------

function dashboard_constructor(data) {

    // --- Create gender selection ---

    let gender_icon = ["\uf182", "\uf183"];
    let gender_icon_legend = ["women", "men"];

    // Button geometry
    let bWidth = 100; 
    let bHeight = 80; 
    let bSpace = 20; 

    // Color
    let defaultColor = '#073B4C';
    let clickedColor = '#1FB7EA';

    // Subtitle gender selection
    filter_svg.append("text")
        .attr("class", "subtitle")
        .attr("text-anchor", "start")
        .text("Gender selection :")
        .style("font-size", 12)
        .attr("x", margin_filter.left)
        .attr("y", margin_filter.top);

    // Gender selection buttons
    let gender_buttons = filter_svg.append("g");

    // Groups for each button (which will hold a rect and text)
    let gender_button_groups = gender_buttons.selectAll("g.button")
        .data(gender_icon)
        .enter()
        .append("g")
        .attr("class", "button")
        .attr("id", (d, i) => "button_" + gender_icon_legend[i])
        .style("cursor", "pointer")
        .on("click", (d, i) => {

            // --- Update button ---

            // Change button color for clicked one
            d3.select("#button_" + gender_icon_legend[i])
                .select("rect")
                .attr("fill", clickedColor);

            // Change button color for not-clicked one
            d3.select(i == 0 ? "#button_" + gender_icon_legend[1]: "#button_" + gender_icon_legend[0])
                .select("rect")
                .attr("fill", defaultColor);

            // --- Update bar chart ---

            // Recover age selection
            age_range_selected = slider.value()

            // Remove old bar chart
            slider_svg.selectAll(".distrib_age")
                .remove();

            // Create new bar chart
            slider_svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "distrib_age")
                .attr("fill", d => (d.gender == i & d.age >= age_range_selected[0] & d.age <= age_range_selected[1]) ? clickedColor : defaultColor)
                .attr("stroke-width", 1)
                .attr("stroke", "white")
                .attr("x", d => d.gender == i ? xScale(d.age) : 0)
                .attr("y", d => d.gender == i ? -yScale(d.nb_instances) : 0)
                .attr("width", d => d.gender == i ? 11 : 0)
                .attr("height", d => d.gender == i ? yScale(d.nb_instances)-6 : 0);

            // --- Update Flower chart ---

            // Test existence of age in data
            if (d3.sum(d3.range(age_range_selected[0], age_range_selected[1]+1).map(age => data.filter(d => d.gender == i).map(d => d.age).includes(age))) > 0) {
                
                // Plot flower
                draw_flower(i, age_range_selected)

                // Simulate a click on a petal to plot the ticket for default criterion "Attractive"
                document.querySelector("#petal_attractive").dispatchEvent(new Event('click'));

            } else {

                // --- Flower chart ---

                // Remove old petals
                flower_petals.selectAll("g.petal")
                    .remove();

                // Remove old title
                flower_petals.select(".title_flower_chart")
                    .remove();

                // Title of flower chart
                flower_petals.append("text")
                    .attr("class", "title_flower_chart")
                    .text(gender_icon_legend[i] + " " + age_range_selected.join("-") + " years old")
                    .style("font-size", 20)
                    .style("font-weight", "bold")
                    .style("text-anchor", "middle")
                    .attr("x", margin_flower.left + w_flower/2)
                    .attr("y", 20);

                // Error message
                flower_petals.append("text")
                    .attr("class", "Error_message_missing_values")
                    .text("No values for filters selected.")
                    .style("text-anchor", "middle")
                    .style("fill", "red")
                    .style("font-size", 15)
                    .style("font-weight", "bold")
                    .attr("x", margin_flower.left + w_flower/2)
                    .attr("y", margin_flower.top + h_flower/2)

                // --- Ticket ---

                // Remove ticket
                d3.select(".ticket_head")
                    .remove();
                d3.select(".ticket_info")
                    .remove();

            };

        });

    // Adding a rect to each button group
    gender_button_groups.append("rect")
        .attr("fill", (d, i) => gender_icon_legend[i] == "women" ? clickedColor : defaultColor)
        .attr("width", bWidth)
        .attr("height", bHeight)
        .attr("x", (d,i) => margin_filter.left + (bWidth+bSpace)*i)
        .attr("y", margin_filter.top + 20)
        .attr("rx", 10) 
        .attr("ry", 10);                

    // Adding text to each button group, centered within the button rect
    gender_button_groups.append("text")
        .text(d => d) 
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-family", "FontAwesome")
        .attr("fill", "white")
        .style("font-size", 60)  
        .attr("x", (d,i) => margin_filter.left + (bWidth+bSpace)*i + bWidth/2)
        .attr("y", margin_filter.top + 20 + bHeight/2);

    // --- Create age selection ---

    let xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.age))
        .range([-5, 395]);
    
    let yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.nb_instances))
        .range([10, h_filter-40]);

    // Subtitle gender selection
    filter_svg.append("text")
        .attr("class", "subtitle")
        .attr("text-anchor", "start")
        .text("Age selection :")
        .style("font-size", 12)
        .attr("x", margin_filter.left + w_filter + margin_filter.right - 550)
        .attr("y", margin_filter.top);

    // Gender selection slider   
    let slider = d3.sliderBottom()
        .step(1)
        .domain(d3.extent(data, d => d.age))
        .default([25, 30])
        .width(400)
        .on("onchange", age_range_selected => {

            // --- Update age range selected ---

            d3.selectAll(".distrib_age")
                .attr("fill", d => (d.age >= age_range_selected[0]) & (d.age <= age_range_selected[1]) ? clickedColor : defaultColor);

            // --- Update Flower chart ---

            d3.range(2).map(i => {

                if (d3.select("#button_" + gender_icon_legend[i]).select("rect").attr("fill") == clickedColor) {

                    console.log("ok")

                    // Test existence of age in data
                    if (d3.sum(d3.range(age_range_selected[0], age_range_selected[1]+1).map(age => data.filter(d => d.gender == i).map(d => d.age).includes(age))) > 0) {
                        
                        // Plot flower
                        draw_flower(i, age_range_selected)

                        // Simulate a click on a petal to plot the ticket for default criterion "Attractive"
                        document.querySelector("#petal_attractive").dispatchEvent(new Event('click'));

                    } else {

                        // --- Flower chart ---

                        // Remove old petals
                        flower_petals.selectAll("g.petal")
                            .remove();

                        // Remove old title
                        flower_petals.select(".title_flower_chart")
                            .remove();

                        // Title of flower chart
                        flower_petals.append("text")
                            .attr("class", "title_flower_chart")
                            .text(gender_icon_legend[i] + " " + age_range_selected.join("-") + " years old")
                            .style("font-size", 20)
                            .style("font-weight", "bold")
                            .style("text-anchor", "middle")
                            .attr("x", margin_flower.left + w_flower/2)
                            .attr("y", 20);

                        // Error message
                        flower_petals.append("text")
                            .attr("class", "Error_message_missing_values")
                            .text("No values for filters selected.")
                            .style("text-anchor", "middle")
                            .style("fill", "red")
                            .style("font-size", 15)
                            .style("font-weight", "bold")
                            .attr("x", margin_flower.left + w_flower/2)
                            .attr("y", margin_flower.top + h_flower/2)

                        // --- Ticket ---

                        // Remove ticket
                        d3.select(".ticket_head")
                            .remove();
                        d3.select(".ticket_info")
                            .remove();

                    };

                }

            })

        });

    let slider_svg = filter_svg.append("svg")
        .attr("x", margin_filter.left + w_filter + margin_filter.right - 550)
        .attr("y", margin_filter.top + 20)
        .attr("width", 450)
        .attr("height", h_filter)
        .append("g")
        .attr("transform", "translate(15," + (h_filter - 40) + ")")
        .call(slider);

    // Bar chart 
    slider_svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "distrib_age")
        .attr("fill", d => (d.gender == 0 & d.age >= 25 & d.age <= 30) ? clickedColor : defaultColor)
        .attr("stroke-width", 1)
        .attr("stroke", "white")
        .attr("x", d => d.gender == 0 ? xScale(d.age) : 0)
        .attr("y", d => d.gender == 0 ? -yScale(d.nb_instances) : 0)
        .attr("width", d => d.gender == 0 ? 11 : 0)
        .attr("height", d => d.gender == 0 ? yScale(d.nb_instances)-6 : 0);
                
    // --- Create flower chart ---

    let petalxTransfo = [400, 425, 425, 400, 375, 375];
    let petalyTransfo = [275, 275, 300, 325, 300, 275];
    let labelRotation = [0, 60, -60, 0, 60, -60];
    let labelxTransfo = [445, 420, 360, 310, 350, 420];
    let labelyTransfo = [300, 325, 365, 300, 215, 250]
    let petalFill = ['#FFADAD', '#FFD6A5', '#80ed99', '#468FAF', '#BDB2FF', '#FFC6FF'];
    let petalStroke = ['#e5383b', '#ff9f1c', '#57CC99', '#014F86', '#9785FF', '#ea698b'];

    function draw_flower(gender, age_range) {

        let flower_petals_label = ["attractive", "sincere", "intelligent", "fun", "ambitious", "shared_interests"]
        let data_subsample = Object.values(data.filter(d => d.gender == gender & d.age >= age_range[0] & d.age <= age_range[1])).map(d => Object.values(d).slice(2,8))
        let flower_petals_data = d3.range(flower_petals_label.length).map(i => d3.mean(data_subsample, d => d[i]))
        
        let flower_data = d3.range(flower_petals_data.length).map(i => {
            return {label: flower_petals_label[i], value: flower_petals_data[i]}
        });

        let petalWidthScale = d3.scaleLinear()
            .domain(d3.extent(flower_petals_data, d => d))
            .range([100, 250]);

        // Remove error message
        flower_petals.select(".Error_message_missing_values")
            .remove();

        // Remove title
        flower_petals.select(".title_flower_chart")
            .remove();

        // Remove old petals
        flower_petals.selectAll("g.petal")
            .remove();

        // Title of flower chart
        flower_petals.append("text")
            .attr("class", "title_flower_chart")
            .text(age_range[0] == age_range[1] ? 
                gender_icon_legend[gender].slice(0,1).toUpperCase() + gender_icon_legend[gender].slice(1) + " " + age_range[0] + " years old" :
                gender_icon_legend[gender].slice(0,1).toUpperCase() + gender_icon_legend[gender].slice(1) + " " + age_range.join("-") + " years old" 
                )
            .style("font-size", 20)
            .style("font-weight", "bold")
            .style("text-anchor", "middle")
            .attr("x", margin_flower.left + w_flower/2)
            .attr("y", 20);
        
        // Groups for each petal (which will hold a rect and text)
        let flower_petal_groups = flower_petals.selectAll("g.petal")
            .data(flower_data)
            .enter()
            .append("g")
            .attr("class", "petal")
            .attr("id", d => "petal_" + d.label)
            .style("cursor", "pointer")
            .on("click", (d, i) => {
                
                // Color petal selected
                d3.selectAll("g.petal")
                    .select("rect")
                    .style("fill", (d_bis, i_bis) => i_bis == i ? petalStroke[i_bis]:petalFill[i_bis])

                // Remove old ticket
                d3.select(".ticket_head")
                    .remove();
                d3.select(".ticket_info")
                    .remove();

                // Define ticket
                draw_ticket(gender, age_range, d, i)

            });

        // Adding rect to each petal group
        flower_petal_groups.append("rect")
            .attr("rx", 25)
            .attr("ry", 25)
            .style("cursor", "pointer")
            .style("fill", (d, i) => petalFill[i])
            .style("stroke",(d, i) => petalStroke[i])
            .style("stroke-width", 3)
            .attr("width", d => petalWidthScale(d.value))
            .attr("height", 50)
            .attr("transform", (d, i) => "translate(" + petalxTransfo[i] + "," + petalyTransfo[i] + ") " + "rotate(" + 60*i + ")");

        // Adding text to each petal group
        flower_petal_groups.append("text")
            .text(d => d3.format(".0f")(d.value) + "/100")
            .style("fill", "black")
            .style("font-weight", "bold")
            .attr("transform", (d, i) => "translate(" + labelxTransfo[i] + "," + labelyTransfo[i] + ") " + "rotate(" + labelRotation[i] + ")")
            
        // Groups for each legend (which will hold a rect and text)
        let flower_legend_groups = flower_petals.selectAll("g.legend")
            .data(flower_petals_label)
            .enter()
            .append("g")
            .attr("class", "legend");

        // Adding a rect to each legend group
        flower_legend_groups.append("rect")
            .style("fill", (d, i) => petalFill[i])
            .style("stroke", (d, i) => petalStroke[i])
            .style("stroke-width", 3)
            .attr("width", 30)
            .attr("height", 20)
            .attr("x", 20)
            .attr("y", (d, i) => margin_flower.top + i*30);
        
        // Adding text to each legend group
        flower_legend_groups.append("text")
            .text(d => d.slice(0, 1).toUpperCase() + d.slice(1).replace("_", " "))
            .attr("x", 60)
            .attr("y", (d, i) => margin_flower.top + i*30 + 15);
  
    }

    // Initialize flower's petals
    let flower_petals = flower_svg.append("g");

    // Simulate a click on women button to plot the flower chart for default selection
    document.querySelector("#button_women").dispatchEvent(new Event('click'));

    // Simulate a click on a petal to plot the ticket for default criterion "Attractive"
    document.querySelector("#petal_attractive").dispatchEvent(new Event('click'));

    // --- Create ticket section ---

    function draw_ticket(gender, age_range, petal_data, index_data) {

        opposite_gender = gender == 1 ? 0:1
        gender_opposite_ages = Object.values(data.filter(d => d.gender === opposite_gender)).map(d => d.age)
        nearest_ages_opposite_gender = age_range.map(
            age => gender_opposite_ages[gender_opposite_ages.map(d=> Math.abs(age-d)).indexOf(d3.min(gender_opposite_ages.map(d=> Math.abs(age-d))))]
        )

        // Define head of the ticket
        let ticket_head = ticket_div.append("svg")
            .attr("class", "ticket_head")
            .style("width", margin_ticket.left + w_ticket + margin_ticket.right)
            .style("height", margin_ticket.top + 50);

        // Adding title to the head
        ticket_head.append("text")
            .attr("class", "title_ticket")
            .text(petal_data.label.slice(0, 1).toUpperCase() + petal_data.label.slice(1).replace("_", " ") + " :")
            .attr("text-anchor", "start")
            .style("font-size", 20)
            .style("font-weight", "bold")
            .style("fill", petalStroke[index_data])
            .attr("x", margin_ticket.left)
            .attr("y", margin_ticket.top);

        // Adding delimitation to the head
        ticket_head.append("line")
            .style("stroke", "grey")
            .attr("x1", margin_ticket.left)
            .attr("y1", margin_ticket.top + 20)
            .attr("x2", margin_ticket.left + w_ticket)
            .attr("y2", margin_ticket.top + 20);

        // Define information div
        if (age_range[0] == age_range[1]) {

            html_text = "<li>How important is the <font style='font-weight:bold' color=" + petalStroke[index_data] + "> " + petal_data.label.replace("_", " ") + 
            "</font> criterion for " + gender_icon_legend[gender] + " to look for in the opposite sex ?<br><br></li>" +

            age_range[0] + " years old " + gender_icon_legend[gender] + " give an average of <font style='font-weight:bold' color='grey'>" + 
            d3.format(".0f")(petal_data.value) + "</font>/100 to the criterion " + 
            "<font style='font-weight:bold' color=" + petalStroke[index_data] + "> " + petal_data.label.replace("_", " ") + "</font>. " +
            "The average score given by " + gender_icon_legend[gender] + " of all ages is <font style='font-weight:bold' color='grey'>" +
            d3.format(".0f")(d3.mean(Object.values(data.filter(d => d.gender === gender)).map(d => Object.values(d).slice(2,8)[index_data]))) + "</font>/100." +

            "<br><br><br>" + 

            "<li> According to these " + gender_icon_legend[gender] + ", how important do other " + gender_icon_legend[gender] + " consider the criterion <font style='font-weight:bold' color=" +
            petalStroke[index_data] + "> " + petal_data.label.replace("_", " ") + "</font> in the opposite sex ?<br><br></li>" + 

            age_range[0] + " years old " + gender_icon_legend[gender] + " estimate that fellow " + gender_icon_legend[gender] + " in their age group rate the importance of the criterion <font style='font-weight:bold' color=" +
            petalStroke[index_data] + "> " + petal_data.label.replace("_", " ") + "</font> as <font style='font-weight:bold' color='grey'>" +
            d3.format(".0f")(d3.range(6).map(i => d3.mean(Object.values(data.filter(d => d.gender == gender & d.age == age_range[0])).map(d => Object.values(d).slice(8,14)), d => d[i]))[index_data]) +
            "</font>/100 when looking for a partner." +

            "<br><br><br>" +

            "<li> And " + gender_icon_legend[opposite_gender] + ", what importance do they attach to this criterion in the opposite sex ?<br><br></li>" +

            nearest_ages_opposite_gender[0] + " years old " + gender_icon_legend[opposite_gender] + ", the nearest available age group, give a score of <font style='font-weight:bold' color='grey'>" + 
            d3.format(".0f")(d3.range(6).map(i => d3.mean(Object.values(data.filter(d => d.gender == opposite_gender & d.age == nearest_ages_opposite_gender[0])).map(d => Object.values(d).slice(2,8)), d => d[i]))[index_data]) + 
            "</font>/100 to the <font style='font-weight:bold' color=" + 
            petalStroke[index_data] + "> " + petal_data.label.replace("_", " ") + "</font> criterion in terms of importance in the opposite sex."

        } else {

            html_text = "<li>How important is the <font style='font-weight:bold' color=" + petalStroke[index_data] + "> " + petal_data.label.replace("_", " ") + 
            "</font> criterion for " + gender_icon_legend[gender] + " to look for in the opposite sex ?<br><br></li>" +

            age_range.join("-") + " years old " + gender_icon_legend[gender] + " give an average of <font style='font-weight:bold' color='grey'>" + 
            d3.format(".0f")(petal_data.value) + "</font>/100 to the criterion " + 
            "<font style='font-weight:bold' color=" + petalStroke[index_data] + "> " + petal_data.label.replace("_", " ") + "</font>. " +
            "The average score given by " + gender_icon_legend[gender] + " of all ages is <font style='font-weight:bold' color='grey'>" +
            d3.format(".0f")(d3.mean(Object.values(data.filter(d => d.gender === gender)).map(d => Object.values(d).slice(2,8)[index_data]))) + "</font>/100." +

            "<br><br><br>" + 

            "<li> According to these " + gender_icon_legend[gender] + ", how important do other " + gender_icon_legend[gender] + " consider the criterion <font style='font-weight:bold' color=" +
            petalStroke[index_data] + "> " + petal_data.label.replace("_", " ") + "</font> in the opposite sex ?<br><br></li>" + 

            age_range.join("-") + " years old " + gender_icon_legend[gender] + " estimate that fellow " + gender_icon_legend[gender] + " in their age group rate the importance of the criterion <font style='font-weight:bold' color=" +
            petalStroke[index_data] + "> " + petal_data.label.replace("_", " ") + "</font> as <font style='font-weight:bold' color='grey'>" +
            d3.format(".0f")(d3.range(6).map(i => d3.mean(Object.values(data.filter(d => d.gender == gender & d.age >= age_range[0] & d.age <= age_range[1])).map(d => Object.values(d).slice(8,14)), d => d[i]))[index_data]) +
            "</font>/100 when looking for a partner." +

            "<br><br><br>" +

            "<li> And " + gender_icon_legend[opposite_gender] + ", what importance do they attach to this criterion in the opposite sex ?<br><br></li>" +

            nearest_ages_opposite_gender.join("-") + " years old " + gender_icon_legend[opposite_gender] + ", the nearest available age group, give a score of <font style='font-weight:bold' color='grey'>" + 
            d3.format(".0f")(d3.range(6).map(i => d3.mean(Object.values(data.filter(d => d.gender == opposite_gender & d.age >= nearest_ages_opposite_gender[0] & d.age <= nearest_ages_opposite_gender[1])).map(d => Object.values(d).slice(2,8)), d => d[i]))[index_data]) + 
            "</font>/100 to the <font style='font-weight:bold' color=" + 
            petalStroke[index_data] + "> " + petal_data.label.replace("_", " ") + "</font> criterion in terms of importance in the opposite sex."

        }



        ticket_div.append("div")
            .attr("class", "ticket_info")
            .html(html_text)
            .style("position", "relative")
            .style("font-size", 14)
            .style("fill", "white")
            .style("text-align", "left")
            .style("left", margin_ticket.left)
            .style("width", w_ticket);

    }

}

// ================
// Callbacks
// ================

// --- Import data ---

d3.csv("../static/preprocessed_data/flower_data_aggregated.csv")
    .row( (d, i) => {
            return {
                gender: +d.gender,
                age: +d.age,

                attractive: +d.attr1_1,
                sincere: +d.sinc1_1,
                intelligent: +d.intel1_1,
                fun: +d.fun1_1,
                ambitious: +d.amb1_1,
                shared_interests: +d.shar1_1,

                attractive_F: +d.attr4_1,
                sincere_F: +d.sinc4_1,
                intelligent_F: +d.intel4_1,
                fun_F: +d.fun4_1,
                ambitious_F: +d.amb4_1,
                shared_interests_F: +d.shar4_1,
       
                nb_instances: +d.nb_instances
            };
        } 
    )
    // Creates get Data and calls Draw function
    .get( (error, rows) => {
        console.log("Loaded " + rows.length + " rows");
        if (rows.length > 0) {
            console.log("First row 65: ", rows[0]); //-> checking purpuse
            console.log("Last row: ", rows[rows.length-1]);
            dataset = rows;           
            dashboard_constructor(dataset);
        }
    });