const renderHorizontalBarChart = (svg, arr, xValue, yValue) => {    
  console.log(arr);
  const margin = {left:120, top:40, right:30, bottom:60};
  const width = +svg.attr('width') - margin.left - margin.right;
	const height = +svg.attr('height') - margin.top - margin.bottom;

  //instance of d3 linear scale
  const xScale = d3.scaleLinear()
  	.domain([0,d3.max(arr, xValue)])
  	.range([0, width]);
  console.log(xScale.domain());
  console.log(xScale.range());
	   
  const yScale = d3.scaleBand()
  	.domain(arr.map(yValue))
  	.range([0, height])
  	.padding(0.2);
  
  // Contry colors
  const names = arr.map(el => el.Country);
    const yColors = d3.scaleOrdinal()
  	.domain(names)
    .range(['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2']);  	  
  
  const g = svg.append('g')
  	.attr('transform', `translate(${margin.left},${margin.top})`);
  
  const yAxis = d3.axisLeft(yScale);
  yAxis(g.append('g'));  // invoke and action on d3 selection
  g.selectAll('.domain,.tick line')
  	.remove();
   console.log('Invoke action');
    
  const xTickFormat = number => d3.format('.3s')(number).replace('G','B');
  const xAxis = d3.axisBottom(xScale)
  	.tickFormat(xTickFormat)
  	.tickSize(`${-height + margin.top}`)
  
  // another way to invoke action on d3 selection
  const xAxisG = g.append('g').call(xAxis) 
  	.attr('transform', `translate(0, ${height})`);
  
  xAxisG
    .selectAll('text')
  	.attr("stroke", "darkblue")
  	.attr("y", "10");
   
  xAxisG
		.append('text')
  	.attr('class', 'bottom-text')
  	.attr('x', `${width/2 - 0}`)
    .attr('y', '50')
  	.attr('fill', 'black')
  	.text('Population in millions');
  
  g.selectAll('rect')
  	.data(arr).enter().append('rect')
  		.attr('fill', d => yColors(d.Country))
  		.attr('y', d => yScale(yValue(d)))
  		.attr("width", d => xScale(xValue(d)))
  		.attr("height", yScale.bandwidth()); // bandwidth is a computed with of a single bar
  
  g.append('text')
  	.text("Top 5 Most Populated countries")
  	.attr("font-size", "1.5em")
}
 
// Send http, parse response, return array
d3.csv('data.csv').then(data => {
  data.forEach(d => {d.Population=+d.Population * 1000}); 
  renderHorizontalBarChart(d3.select('svg'), data, d => d.Population, d => d.Country);
});

