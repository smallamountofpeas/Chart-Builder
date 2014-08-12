// Collect data


// Define plotData array, global
  // array of night objects x,y = hours sleep, rating 
var plotData = [];
//for linear regression
var knownX = [];
var knownY = [];


// collectData function to collect x,y data from each night
function collectData() {
    //temp test
    //alert("Ok, collectData is running");
    
    // create class for a night
    function night(hours, rating) {
        this.x = parseFloat(hours);
        this.y = parseFloat(rating);
    }
    
    // define hours and rating by looping through inputs in form
    // loop increments by 2 to gather both hour and rating
    var inputs = document.getElementById("myInputs");
    for (i = 0; i < inputs.length; i += 2) {
        // assign value for hours and rating
        var hours = inputs.elements[i].value;
        var rating = inputs.elements[i + 1].value;
        //create the next night object with the 2 values
        var nextNight = new night(hours, rating);
        // push each night into plotData
        if (hours > 12) {
            alert("You have entered an invalid number.  Hours must be 0-12.  Do you really need more than 12 hours of sleep?!");
            plotData = [];
            inputs.elements[i].focus();
            return false;
        }
        if (rating > 5) {
            alert("You have entered an invalid number.  Rating must be 0-5.");
            plotData = [];
            inputs.elements[i + 1].focus();
            return false;
        }
        if (hours === "" && rating === "") {
            continue;    
        }
        else if (hours === "" || rating === "") {
            alert("Looks like you are missing some data.  Please make sure you have both Hours Sleep and Rating for each night that you want to track.");
            if (hours === "") {
                plotData = [];
                inputs.elements[i].focus();
                return false;    
            }
            else if (rating === "") {
                plotData = [];
                inputs.elements[i + 1].focus();
                return false;
            }
        }
        else {
            plotData.push(nextNight);
            knownX.push(parseFloat(hours));
            knownY.push(parseFloat(rating));
        } 
        
    }
}




//for bonus trend line (come back later to trouble shoot)
function linearRegression(x, y) {
                var lr = {};
                var n = y.length;
                var sum_x = 0;
                var sum_y = 0;
                var sum_xy = 0;
                var sum_xx = 0;
                var sum_yy = 0;
                
                for (var i = 0; i < y.length; i++) {
                        var x_unit = x[i] * ((myChart.width - 20) / 12);
                        var y_unit = y[i] * ((myChart.height - 20) / 5);
                        sum_x += x_unit;
                        sum_y += y_unit;
                        sum_xy += (x_unit*y_unit);
                        sum_xx += (x_unit*x_unit);
                        sum_yy += (y_unit*y_unit);
                } 
                
                lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
                lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
                                
                return lr;
}




//Onload Functions
function start() {
  prepareChart();
  plotChart();
  clearChart();
}
window.onload = start;




// Prepare the basic Chart graphics (label axis, etc)
function prepareChart() {
    // define canvas variables, global for use in other functions
    myChart = document.getElementById("myChart");
    c = myChart.getContext("2d"); 
    // draw blank chart
    c.strokeStyle = "#9D9D9D";
    c.fillStyle = "#9D9D9D";
    c.lineWidth = 2;
    c.beginPath();
    c.fillRect(9,9,302,302);
    c.clearRect(10,10,300,300);
    // draw unit markers
    var w = myChart.width - 20;
    var h = myChart.height - 20;
    // x axis
    for (i=10; i<=myChart.width; i+=(w/12)) {
        c.moveTo(i,310);
        c.lineTo(i,320);
        c.stroke();
        c.moveTo(i,0);
        c.lineTo(i,10);
        c.stroke();
    }    
    // y axis
    for (i=10; i<=myChart.height; i+=(h/5)) {
        c.moveTo(0,i);
        c.lineTo(10,i);
        c.stroke();
        c.moveTo(310,i);
        c.lineTo(320,i);
        c.stroke();
    }
 
}








// Plot Data
function plotChart() {
    // onclick of Plot Chart button
    var plot = document.getElementById("plot");
    plot.onclick = function() {
        collectData();
        //button test
        //alert("Plot onclick ok.");
        //data test
        /*
        for(i=0; i<plotData.length; i++) {
            alert("Night " + (i+1) + " = " + plotData[i].x +" hours, rating " + plotData[i].y);
        }
        */
        
        // plot all data
        for(i=0; i<plotData.length; i++) {
            // define x and y coordinates from data
                // x = hours, 0-12 
                // y = rating, 0-5 
            var w = myChart.width - 20;
            var h = myChart.height - 20;
            var x = 10 + (plotData[i].x * (w/12));
            var y = myChart.height - 10 - (plotData[i].y * (h/5));
            // draw plot point    
            c.lineWidth = 4;
            c.strokeStyle = "#FBFBFB";
            c.fillStyle = "#42560E";
            c.beginPath();
            //arc(x,y,r,start,stop)
            c.arc(x,y,5,0,2*Math.PI);
            c.stroke();
            c.fill();    
        }
        // Bonus: draw trend line (trouble shoot later)
        /*
        var lr = linearRegression(knownX, knownY);
        // now you have:
        // lr.slope
        // lr.intercept
        
        //ending x
        var lr_x = myChart.width - 10; 
        //starting y
        var lr_y = (myChart.height - 10) - lr.intercept; 
        c.lineWidth = 1;
        c.strokeStyle = "#42560E";
        c.moveTo(10,lr_y);
        c.lineTo(lr_x,(lr_x * lr.slope - lr_y));
        c.stroke();
        */
    };
}
    


// Clear Data
function clearChart() {
    var clear = document.getElementById("clear");
    clear.onclick = function() {
        // button test
        //alert("Clear onclick ok.");
        // clear chart area
        c.clearRect(0,0,myChart.width,myChart.height);
        prepareChart();
        // clear Inputs
        document.getElementById("myInputs").reset();
        plotData = [];
    };
}