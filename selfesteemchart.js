(function() {
    // JavaScript source code
var mouseX
var mouseY


const data = [
    { study_load: 0, value: 17.35 },
    { study_load: 1, value: 24.88 },
    { study_load: 2, value: 22.50 },
    { study_load: 3, value: 15.55 },
    { study_load: 4, value: 9.10 },
    { study_load: 5, value: 9.76 }
];

const margin = { top: 100, right: 20, bottom: 60, left: 70 };
    const width = 400;
    const height = 300;

    const svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "scrollVisibility")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "fixed") // Set position to fixed for independent positioning
        .style("pointer-events", "none"); // Make sure the tooltip doesn't interfere with mouse events
    
    const xScale = d3.scaleBand().range([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(data.map(d => d.study_load));
    yScale.domain([0, 30]);

    // Create X axis
    svg.append("g")
        .attr("transform", "translate(10," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .classed("axis-label", true);

    // Create Y axis
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .attr("transform", "translate(-15, 0)")
        .classed("axis-label", true);

    // X-axis label
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + 45) + ")")
        .attr("class", "axis-label")
        .text("Study Load");

    // Y-axis label with rotation
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axis-label")
        .text("Average Self Esteem Level");

    // Title of graph
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("style", "font-size: 20px;")
        .text("Average Self Esteem Level vs Study Load");

    const colorScale = d3.scaleSequential(d3.interpolateRgb)
        .domain([30, 0])
        .interpolator(t => d3.interpolateRgb("green", "red")(t));

    const barWidth = xScale.bandwidth();

    const bars = svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.study_load) + 10)
        .attr("width", barWidth)
        .attr("y", d => yScale(d.value))
        .attr("height", d => height - yScale(d.value))
        .style("fill", d => colorScale(d.value))
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    // Add a text label to each bar
    bars.append("text")
        .attr("x", d => xScale(d.study_load) + barWidth / 2)
        .attr("y", d => yScale(d.value) - 5)
        .attr("text-anchor", "middle")
        .attr("style", "font-size: 12px;")
        .text(d => d.value.toFixed(2));

    const transitionTime = 250;

    function handleMouseOver(d, i) {
        // Show the tooltip
        tooltip.transition()
            .duration(200)
            .style("opacity", 1);
    
        // Update the tooltip content
        tooltip.html("Value: " + d.value.toFixed(2));
    
        // Grow the bar and apply cubic transition
        d3.select(this)
            .transition().duration(transitionTime)
            .attr("x", d => xScale(d.study_load) + 5)
            .attr("width", barWidth + 10)
            .attr("y", d => yScale(d.value) - 10)
            .attr("height", d => height - yScale(d.value) + 10);
    }
    
    function handleMouseOut(d, i) {
        // Hide the tooltip
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    
        // Shrink the bar and apply cubic transition
        d3.select(this)
            .transition().duration(transitionTime)
            .attr("x", d => xScale(d.study_load) + 10)
            .attr("width", barWidth)
            .attr("y", d => yScale(d.value))
            .attr("height", d => height - yScale(d.value));
    }

    document.addEventListener('mousemove', function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;

        // Assuming your elements have a class named "bar-label"
        const elements = document.getElementsByClassName('bar-label');

        // Iterate through all elements with the class

         // Update the tooltip position based on mouse coordinates
        tooltip.style("left", (mouseX+5) + "px")
        .style("top", (mouseY-35) + "px"); // Adjust the vertical offset as needed


        for (let i = 0; i < elements.length; i++) {
            const currentElement = elements[i];

            // Set x and y positions with units
            currentElement.style.left = mouseX + 'px';
            currentElement.style.top = mouseY + 'px';

            // Adjust positioning based on the dimensions of the text label
            const labelWidth = currentElement.offsetWidth;
            const labelHeight = currentElement.offsetHeight;

            currentElement.style.left = mouseX - labelWidth / 2 + 'px';
            currentElement.style.top = mouseY - labelHeight - 10 + 'px';
        }
    });

    document.addEventListener("DOMContentLoaded", function () {
        const svgContainer = svg;

        svgContainer.style("transition", "opacity 1s ease");

        window.addEventListener('scroll', handleScroll);

        function handleScroll() {
            const svgRect = svgContainer.node().getBoundingClientRect();
            const isVisible = (svgRect.top >= 0 && svgRect.bottom <= window.innerHeight);
            const isAbove100px = (svgRect.top <= 100);

            // Toggle classes based on viewport and position
            if (isVisible && !isAbove100px) {
                svgContainer.style("opacity", '1');
                handleOpacityChange();
            } else {
                svgContainer.style("opacity", '0.01');
                handleOpacityChange();
            }
        }
    });

    let isTransitionInProgress = false; // Variable to track transition state
    let targetOpacity = 1;

    function handleOpacityChange() {
        // Check if a transition is already in progress
        var svgOpacity = parseFloat(svg.style("opacity"));
        if (isTransitionInProgress && targetOpacity === svgOpacity) {
            return;
        }

        // Set the transition state to true
        isTransitionInProgress = true;

        // Transition the bars based on the SVG's opacity
        if (svgOpacity === 1) {
            // Transition bars to their respective size from 0px
            targetOpacity = 1;
            bars.transition()
                .duration(700)
                .attr("height", d => height - yScale(d.value))
                .attr("y", d => yScale(d.value))
                .on("end", function () {
                    // Set the transition state to false when the transition ends
                    isTransitionInProgress = false;
                });
        } else if (svgOpacity === 0.01) {
            // Transition bars to 0px in a 1 second transition from their respective size
            targetOpacity = 0.01;
            bars.transition()
                .duration(700)
                .attr("height", 0)
                .attr("y", height)
                .on("end", function () {
                    // Set the transition state to false when the transition ends
                    isTransitionInProgress = false;
                });
        }
    }
})();
