function graph(year,savings){
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 560
      height = 500
  
  // append the svg object to the body of the page
  var svg = d3.select("#graph2")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  

  //Read the data
  //var yearly=document.getElementById("graphData").innerHTML;
  var jsonO = [{"Value":0, "Date":(Date.now())}, {"Value":9000,"Date":(Date.now()+24*60*60*1000*365)}];
  const string=JSON.stringify(jsonO)
  const yearly=JSON.parse(year);
  const savingsAmount=JSON.parse(savings);
  //d3.json(obj,
  
    // When reading the csv, I must format variables:
    /*function(d){
      return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
    },*/
  
    // Now I can use this dataset:
    //function(error, data) {
        //if(error) {throw error};
      //console.log(obj);
      // Add X axis --> it is a date format
      var x = d3.scaleTime()
        .domain([Date.now(), Date.now()+24*60*60*1000*365])
        .range([ 0, width ]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  
      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, 100000])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));
  
      // Add the line
      svg.append("path")
        .datum(yearly)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d){return x(d.Date)})
          .y(function(d){return y(d.Value)})
        )
      svg.append("path")
        .datum(savingsAmount)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d){return x(d.Date)})
          .y(function(d){return y(d.Value)})
        )
  
    }