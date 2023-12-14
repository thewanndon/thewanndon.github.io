// JavaScript source code
var mouseX
var mouseY


const data = [
    { study_load: 0, average_academic_performance: 2.46 },
    { study_load: 1, average_academic_performance: 4.18 },
    { study_load: 2, average_academic_performance: 3.35 },
    { study_load: 3, average_academic_performance: 2.15 },
    { study_load: 4, average_academic_performance: 1.74 },
    { study_load: 5, average_academic_performance: 1.83 }
];

const margin = { top: 300, right: 20, bottom: 500, left: 70 };
const width = 400;
const height = 300;

const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "scrollVisibility")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3.scaleBand().range([0, width]).padding(0.1);
const yScale = d3.scaleLinear().range([height, 0]);

xScale.domain(data.map(d => d.study_load));
yScale.domain([0, d3.max(data, d => d.average_academic_performance)]);

// Create X axis
svg.append("g")
    .attr("transform", "translate(10," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .classed("axis-label", true); // Use classed() to add the class

// Create Y axis
svg.append("g")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .attr("transform", "translate(-15, 0)")
    .classed("axis-label", true); // Use classed() to add the class

// X-axis label
svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + 45) + ")")
    .attr("class", "axis-label") // Use classed() to add the class
    .text("Study Load");

// Y-axis label with rotation
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axis-label") // Use classed() to add the class
    .text("Average Academic Performance");

const colorScale = d3.scaleSequential(d3.interpolateRgb)
    .domain([d3.max(data, d => d.average_academic_performance), 0])
    .interpolator(t => d3.interpolateRgb("green", "red")(t));

const barWidth = xScale.bandwidth();

const bars = svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.study_load))
    .attr("width", barWidth)
    .attr("y", d => yScale(d.average_academic_performance))
    .attr("height", d => height - yScale(d.average_academic_performance))
    .style("fill", d => colorScale(d.average_academic_performance))
    .style("stroke", "black")  // Set the border color to black
    .style("stroke-width", "1px")  // Set the border width to 1px
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);


bars.append("text")
    .attr("class", "bar-label")
    .attr("id", function (d) { return d.study_load + "_academicPerfLabel"; })
    .text(function (d) { return (d.average_academic_performance); });  

const transitionTime = 250
function handleMouseOver(d, i) {
    // Grow the bar and apply cubic transition
    d3.select(this)
        .transition().duration(transitionTime)
        .attr("x", d => xScale(d.study_load) - 5)
        .attr("width", barWidth + 10)
        .attr("y", d => yScale(d.average_academic_performance) - 10)
        .attr("height", d => height - yScale(d.average_academic_performance) + 10);

    // Assuming your element has an id named "example-id"
    const myElement = document.getElementById(d.study_load+"_academicPerfLabel");

    // Now you can manipulate the selected element
    myElement.style.opacity = 1;

}

function handleMouseOut(d, i) {
    // Shrink the bar and apply cubic transition
    d3.select(this)
        .transition().duration(transitionTime)
        .attr("x", d => xScale(d.study_load))
        .attr("width", barWidth)
        .attr("y", d => yScale(d.average_academic_performance))
        .attr("height", d => height - yScale(d.average_academic_performance));

    // Hide and remove text label
    const myElement = document.getElementById(d.study_load + "_academicPerfLabel");
    myElement.style.opacity = 0;
}
document.addEventListener('mousemove', function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    // Assuming your elements have a class named "bar-label"
    const elements = document.getElementsByClassName('bar-label');

    // Iterate through all elements with the class
    for (let i = 0; i < elements.length; i++) {
        const currentElement = elements[i];

        // Set x and y positions with units
        currentElement.style.left = mouseX + 'px'; // Add 'px' to set the desired x position
        currentElement.style.top = mouseY + 'px';  // Add 'px' to set the desired y position

        // Adjust positioning based on the dimensions of the text label
        const labelWidth = currentElement.offsetWidth;
        const labelHeight = currentElement.offsetHeight;

        currentElement.style.left = mouseX - labelWidth / 2 + 'px'; // Center horizontally
        currentElement.style.top = mouseY - labelHeight - 10 + 'px'; // Offset vertically
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const svgContainer = svg;

    svgContainer.style("transition", "opacity 1s ease")

    window.addEventListener('scroll', handleScroll);

    function handleScroll() {
        const svgRect = svgContainer.node().getBoundingClientRect();
        const isVisible = (svgRect.top >= 0 && svgRect.bottom <= window.innerHeight);
        const isAbove100px = (svgRect.top <= 100);

        // Toggle classes based on viewport and position
        if (isVisible && !isAbove100px) {
            svgContainer.style("opacity", '1');
        } else {
            svgContainer.style("opacity", '0.01');
        }
    }
});
