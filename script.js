const svg = d3.select("#gameCanvas");
const nodes = [];  // 게임 점 리스트
const links = [];  // 연결선 리스트
let selectedNode = null;

// SVG 클릭 시 점 추가
svg.on("click", function(event) {
    const [x, y] = d3.pointer(event);
    addNode(x, y);
});

function addNode(x, y) {
    const node = { id: nodes.length, x: x, y: y };
    nodes.push(node);
    update();
}

function addLink(source, target) {
    links.push({ source, target });
    update();
}

function update() {
    // 연결선 업데이트
    svg.selectAll("line").data(links).join("line")
        .attr("class", "line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    // 점 노드 업데이트
    const nodeSelection = svg.selectAll("circle").data(nodes, d => d.id);
    nodeSelection.enter()
        .append("circle")
        .attr("class", "node")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 10)
        .attr("fill", "lightblue")
        .on("click", function(event, d) {
            d3.event.stopPropagation();
            if (selectedNode) {
                if (selectedNode !== d) {
                    addLink(selectedNode, d);
                    d3.select(this).classed("selected", false);
                }
                selectedNode = null;
            } else {
                selectedNode = d;
                d3.select(this).classed("selected", true);
            }
        });

    nodeSelection
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("class", d => d === selectedNode ? "node selected" : "node");

    nodeSelection.exit().remove();
}
