d3.csv('./data/PopulationData.csv').then(function(data){
  var popData = data.filter(function(d){
    var filterData = ['Upper middle income', 'World', 'Sub-Saharan Africa (IDA & IBRD countries)', 'Middle East & North Africa (IDA & IBRD countries)', 'Latin America & the Caribbean (IDA & IBRD countries)', 'Europe & Central Asia (IDA & IBRD countries)', 'East Asia & Pacific (IDA & IBRD countries)', 'Sub-Saharan Africa (excluding high income)', 'Post-demographic dividend', 'Pre-demographic dividend', 'Middle East & North Africa (excluding high income)', 'Middle income', 'Middle East & North Africa', 'Late-demographic dividend', 'Low & middle income', 'Lower middle income', 'Low income', 'Least developed countries: UN classification', 'Latin America & Caribbean', 'Latin America & Caribbean (excluding high income)', 'IDA only', 'IDA blend', 'IDA total', 'IDA & IBRD total', 'IBRD only', 'Heavily indebted poor countries (HIPC)', 'Fragile and conflict affected situations', 'Europe & Central Asia', 'Europe & Central Asia (excluding high income)', 'East Asia & Pacific', 'Early-demographic dividend', 'East Asia & Pacific (excluding high income)', 'High income', 'Euro area', 'European Union', 'North America', 'OECD members', 'South Asia (IDA & IBRD)', 'Sub-Saharan Africa', 'South Asia', 'Arab World', 'Not classified']

    if (!filterData.includes(d['Country Name'])) return d
  })

  var minYear = 1960;
  var maxYear = 2017;

  var height = 600;
  var width = 1000;
  var xPadding = 80;
  var padding = 10;

  var svg = d3.select('svg')
              .attr('height', height)
              .attr('width', width)

  svg
    .append('g')
    .attr('transform', 'translate('+ xPadding +',0)')
    .classed('y-axis', true)


  d3.select('input')
    .property('min', 1960)
    .property('max', 2017)
    .property('value', 1960)
    .on('input', function(){
      buildGraph(d3.event.target.value)
    })

  buildGraph('1960')

  function buildGraph(year){

    d3.select('h3')
      .text(year)
    var countries = []
    popData.forEach(function(d){
      countries.push(d['Country Code'])
    })

    var colorScale = d3.scaleSequential()
                       .domain(d3.extent(popData, d => +d[year]))
                       .interpolator(d3.interpolateRainbow)

    var xScale = d3.scaleBand()
                   .domain(countries)
                   .range([0, width - xPadding])

    var barWidth = xScale.bandwidth()

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(popData, d => +d[year])])
                   .range([height - padding, 5]).nice()

    var yAxis = d3.axisLeft(yScale)
                  .tickSizeInner(-width - padding)


    d3.select('.y-axis')
      .transition()
      .call(yAxis)


    var update = svg
                .selectAll('rect')
                  .data(popData)
    update
      .exit()
      .remove()

    update
      .enter()
      .append('rect')
        .attr('x', d => xScale(d['Country Code'])+ xPadding)
        .attr('y', d => yScale(+d[year]))
        .attr('height', d => height - yScale(+d[year]) + padding)
        .attr('fill', d => colorScale(d[year]))
        .attr('width', barWidth)
        .on('mousemove', d => buildTooltip(d, year, colorScale))
        .on('mouseout', d => clearTooltip())
      .merge(update)
      .on('mousemove', d => buildTooltip(d, year, colorScale))
      .on('mouseout', d => clearTooltip())
      .transition()
      .delay((d,i) => i * 3)
          .attr('x', d => xScale(d['Country Code'])+ xPadding)
          .attr('y', d => yScale(+d[year]))
          .attr('height', d => height - yScale(+d[year])+ padding)
          .attr('fill', d => colorScale(d[year]))
          .attr('width', barWidth)

  }
  var tooltip = d3.select('body')
                  .append('div')
                    .classed('tooltip', true)

  function buildTooltip(d, year, scale){

    var format = d3.format(",d")
    var formatPercent = d3.format('.3f')

    tooltip
      .style('opacity', 1)
      .style('background-color', 'rgba(205, 205, 205, 0.75)')
      .style('left', d3.event.x - (tooltip.node().offsetWidth / 2) + 'px')
      .style('top', d3.event.y + 25 + 'px')
      .html(`
        <p>Country: ${d['Country Name']}</p>
        <p>Population: ${format(+d[year])}</p>
        <p>Percent of Population: ${formatPercent(findAverage(popData, d, year))}%</p>
        `)
  }

  function clearTooltip(d){
    tooltip
    .style('opacity', 0)
  }

  function findAverage(data, d, year){
    total = 0.0
    console.log(data);
    data.forEach(function(d){
      total += +d[year]
    })
    onePct = total / 100.00
    percent = d[year] / onePct
    return percent
  }
})
