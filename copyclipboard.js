const RENDER_TEXT_SIZE = 40;

const getCopyableCanvas = async (parentEl) => {
  const boundingRect = parentEl.getBoundingClientRect();
  const bx = boundingRect.x;
  const by = boundingRect.y;
  const bw = boundingRect.width;
  const bh = boundingRect.height;

  const c = document.createElement("canvas");
  c.width = bw;
  c.height = bh;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, bw, bh);

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;

  ctx.fillStyle = "#000000";
  ctx.font = RENDER_TEXT_SIZE * 0.85 + "px Arial";

  for (const svg of parentEl.querySelectorAll("svg")) {
    const { x: rx, y: ry, width: w, height: h } = svg.getBoundingClientRect();

    const [x, y] = [rx - bx, ry - by];

    for (const line of svg.querySelectorAll("line")) {
      ctx.beginPath();
      ctx.moveTo(
        x + (w * line.x1.baseVal.value) / 4.2,
        y + (h * line.y1.baseVal.value) / 7
      );
      ctx.lineTo(
        x + (w * line.x2.baseVal.value) / 4.2,
        y + (h * line.y2.baseVal.value) / 7
      );
      ctx.stroke();
    }

    for (const circle of svg.querySelectorAll("circle")) {
      ctx.beginPath();
      ctx.arc(
        x + (w * circle.cx.baseVal.value) / 4.2,
        y + (h * circle.cy.baseVal.value) / 7,
        (circle.r.baseVal.value * w) / 4.2,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    }
  }

  for (const span of parentEl.querySelectorAll("span")) {
    if (span.innerText.trim() != "") {
      const {
        x: rx,
        y: ry,
        width: w,
        height: h,
      } = span.getBoundingClientRect();

      const [x, y] = [rx - bx, ry - by];

      ctx.fillText(span.innerText, x, y + (h * 2) / 3);
    }
  }

  return c;
};

const canvasToClipboard = async (c) => {
  return new Promise((res) => {
    c.toBlob((blob) => {
      navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      res();
    });
  });
};

const copyToClipboard = async (text) => {
  // Create an invisible div to render our flex elements
  const displayArea = document.createElement("div");
  displayArea.style.position = "fixed";
  displayArea.style.left = 0;
  displayArea.style.top = 0;
  displayArea.style.display = "inline-block";
  displayArea.style.opacity = 0;
  displayArea.style.maxWidth = `${RENDER_TEXT_SIZE * 20}px`;

  const parent = displayArea.appendChild(document.createElement("div"));
  parent.style.padding = `${RENDER_TEXT_SIZE / 5}px`;
  parent.style.gap = `${RENDER_TEXT_SIZE * 0.2}px`;
  parent.style.display = "flex";
  parent.style.flexWrap = "wrap";

  generateText(text, parent, RENDER_TEXT_SIZE, "px");

  document.body.appendChild(displayArea);

  // Wait for flexbox to calculate (wait for next animation frame)
  await new Promise(requestAnimationFrame);

  // Render and copy
  const c = await getCopyableCanvas(parent);

  await canvasToClipboard(c);

  // Clean up
  document.body.removeChild(displayArea);
};
