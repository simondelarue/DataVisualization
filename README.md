# DataVisualization - Speed Dating analysis 

_Contributors : Antoine Boulat, Simon Delarue, Mohammed El Yaagoubi, Mathias Nourry, Lingli Zhan_ 

**Table of contents**  

1. [Project description](#Description)   
    1.1 [Data](#Data)  
    1.2 [Environment](#Env)  
2. [Designs](#Designs)  
    2.1 [Ratings analysis](#Ratings)  
    2.2 [Evolution of ratings with regard of personal characteristics](#charac)  
    2.3 [Match analysis](#Match)  

## 1 Project description <a class="anchor" id="Description"></a>  

### 1.1 Data <a class="anchor" id="Data"></a>  

In this **Datavisualization project**, we analyse the [Speed Dating dataset](https://flowingdata.com/2008/02/06/speed-dating-data-attractiveness-sincerity-intelligence-hobbies/).  

The dataset contains 8379 entries for 195 variables. Yet, data is missing for almost 26% of the whole dataset (or is non relevant to be filled - for example if the candidates had to choose between specific items to fill). 

In the data, we have got information about candidates from all around the world, like gender, age, background (studies) but also about what they expect from the speed-dating meeting, i.e their goal. Finally, for each candidate we have the answers about questionnaires that were given to them, regarding their feelings about themselves, the attributes they put in their scorecards about the candidate they met and feeling about the event. Most of this information is already encoded as numerical values. A smaller part of the variables are still qualitative.

We have 551 unique candidates for the whole dataset, 49.94% female and 50.06% male. Data has been gathered on 21 waves of speed-dating.  

### 1.2 Environment <a class="anchor" id="Env"></a>  

We used the following technologies for this project 

<p align="center">
    <img src='img/technos_used.png'>
</p>


## 2 Designs <a class="anchor" id="Designs"></a>   

For the purpose of the project, we first designed **sketches** of the different visualizations we wanted to implement. On this basis, we developped the final web application that gathers all the designs.  

In the following sections, we present sketches as well as implemented designs.

### 2.1 Ratings analysis  <a class="anchor" id="Ratings"></a>  

It is quite usual that - when asked to judge and rate ourselves on subjective items such as attractiveness or fun - our own perception is different from the one proposed by a third-party. Yet, is this hypothesis just a feeling or can we measure this divergence ? 
This visualization proposes to give insight to answer this question, by providing the user with an interactive analysis based on ratings fulfilled by candidates before, during and after the speed dating exercise.

For this study, we propose a martini-glass based approach, meaning that the user is given a global idea about the answer, with a small analysis provided, and is then invited to interact with the tool in order to find answers to more precise questions that could eventually arise during the first part.

The general overview of the intial sketch desing was as following 

<p align="center">
    <img src='img/rating_analysis_1.png'>
</p>  

Using **python** for data preprocessing and **D3.js** to build radar chart and add interactivity, the final visualization tool looks like the following for the user.

This tool gives the user the ability to filter data on different dimensions :  
* Gender  
* Question asked to candidate  

Thanks to a **time slider** the user can get an intuition of the evolution of candidates answers on topic such as "what they look for" or "how they think they measure up".  

On the left of the tool, a small information textbox allows the user to understand how to actually read the radar chart, and provides a small analysis of the data initially displayed. For this information box, **match on content** is used, help the user recognize which features are analysed.

<p align="center">
    <img src='img/design_1.gif'>
</p> 


### 2.2 Evolution of ratings with regard of personal characteristics  <a class="anchor" id="Charac"></a>  

### 2.3 Match analysis  <a class="anchor" id="Match"></a>  


