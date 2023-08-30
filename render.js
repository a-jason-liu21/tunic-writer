const lineClass = "svg-line";
const strokeWidth = 0.2 / 2;

const svgWidth = 4 + strokeWidth * 2;
const svgHeight = 7;

const pointMap = {
  tt: { x: 2, y: 0.5 },
  tl: { x: 0, y: 1.5 },
  tr: { x: 4, y: 1.5 },
  tb: { x: 2, y: 2.5 },
  ml: { x: 0, y: 3 },
  mm: { x: 2, y: 3 },
  mr: { x: 4, y: 3 },
  btl: { x: 0, y: 3.5 },
  bt: { x: 2, y: 3.5 },
  bl: { x: 0, y: 4.5 },
  br: { x: 4, y: 4.5 },
  bb: { x: 2, y: 5.5 },
};
const svgCircle = { x: 2, y: 6, r: 0.2 };

const lineMap = {
  tol: ["tl", "tt"],
  tor: ["tr", "tt"],
  til: ["tl", "tb"],
  tim: ["tt", "tb"],
  tir: ["tr", "tb"],
  s1: ["tl", "ml"],
  s2: ["btl", "bl"],
  bil: ["bl", "bt"],
  bim: ["bb", "bt"],
  bir: ["br", "bt"],
  bol: ["bl", "bb"],
  bor: ["br", "bb"],
  base: ["ml", "mr"],
  td: ["tb", "mm"],
};

const renderSVG = (phoneme, maxHeight, unit) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("svg-canvas");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  svg.style.maxHeight = maxHeight + unit;
  wrapper.appendChild(svg);

  let lines = [];
  if (phoneme.includes(" ")) {
    if (symbolMap[phoneme.split(" ")[0]].vowel) {
      const circleElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circleElement.setAttribute("cx", svgCircle.x + strokeWidth);
      circleElement.setAttribute("cy", svgCircle.y);
      circleElement.setAttribute("r", svgCircle.r);
      circleElement.classList.add(lineClass);
      lines.push(circleElement);
    }
    lines = lines.concat(renderLines(phoneme.split(" ")[0]));
    lines = lines.concat(renderLines(phoneme.split(" ")[1]));
  } else lines = renderLines(phoneme);

  const baseline = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  baseline.setAttribute("x1", pointMap[lineMap["base"][0]].x + strokeWidth);
  baseline.setAttribute("y1", pointMap[lineMap["base"][0]].y);
  baseline.setAttribute("x2", pointMap[lineMap["base"][1]].x + strokeWidth);
  baseline.setAttribute("y2", pointMap[lineMap["base"][1]].y);
  baseline.classList.add("baseline");
  baseline.classList.add(lineClass);
  svg.appendChild(baseline);

  lines.forEach((element) => svg.appendChild(element));
  return wrapper;
};

const renderLines = (phoneme) => {
  const lines = [...symbolMap[phoneme].lines];

  if (lines.includes("s")) {
    lines.splice(lines.indexOf("s"), 1);
    lines.push("s1");
    lines.push("s2");
  }
  let hasTopInner = false;
  let hasBottomInner = false;
  lines.forEach((x) => {
    if (x.startsWith("ti")) hasTopInner = true;
    if (x.startsWith("bi")) hasBottomInner = true;
  });
  if (hasTopInner && hasBottomInner) lines.push("td");

  return lines.map((line) => {
    const result = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    const pts = lineMap[line];
    result.setAttribute("x1", pointMap[pts[0]].x + strokeWidth);
    result.setAttribute("y1", pointMap[pts[0]].y);
    result.setAttribute("x2", pointMap[pts[1]].x + strokeWidth);
    result.setAttribute("y2", pointMap[pts[1]].y);
    result.classList.add(lineClass);
    return result;
  });
};
