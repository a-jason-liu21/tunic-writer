const vMap = Object.keys(symbolMap).reduce((p, n) => {
  if (symbolMap[n].vowel) p[n] = symbolMap[n];
  return p;
}, {});
const cMap = Object.keys(symbolMap).reduce((p, n) => {
  if (!symbolMap[n].vowel) p[n] = symbolMap[n];
  return p;
}, {});
const arpaMap = Object.keys(symbolMap).reduce((p, n) => {
  symbolMap[n].arpa.forEach((phoneme) => (p[phoneme] = n));
  return p;
}, {});

let textDisplay;
let textSize = 10;

const setTextSize = (val) => {
  localStorage.setItem("trunic-txt-size", val.toString());
  textSize = val;
  document.querySelector(
    "#text-size-display"
  ).innerText = `Text size: ${textSize}`;
  document.querySelector("#text-display").style.gap = textSize * 0.2 + "vh";
  document.querySelectorAll("svg").forEach((target) => {
    target.style.maxHeight = textSize + "vh";
  });
  document.querySelectorAll(".unknown-text").forEach((target) => {
    target.style.lineHeight = textSize * 0.8 + "vh";
    target.style.fontSize = textSize * 0.8 + "vh";
  });
};

const clearText = () => {
  const nodes = textDisplay.childNodes;
  while (nodes.length > 0) textDisplay.removeChild(nodes[0]);
};

const addWord = (word) => {
  word = word.toUpperCase();

  const newWordDiv = document.createElement("div");
  newWordDiv.classList.add("word");

  if (!(word in cmudict)) {
    const unknownText = document.createElement("span");
    unknownText.classList.add("unknown-text");
    unknownText.innerText = word;
    unknownText.style.lineHeight = textSize * 0.8 + "vh";
    unknownText.style.fontSize = textSize * 0.8 + "vh";
    newWordDiv.appendChild(unknownText);
  } else {
    const phonemes = cmudict[word].split(" ").reduce((p, n) => {
      n = n.replaceAll(/[^A-Z]/g, "");
      if (!(n in arpaMap)) {
        console.log(`Couldn't find phonetic mapping for ${n}!`);
        return;
      }
      n = arpaMap[n];
      if (
        p.length !== 0 &&
        !p.slice(-1)[0].includes(" ") &&
        symbolMap[n].vowel !== symbolMap[p.slice(-1)[0]].vowel
      ) {
        p[p.length - 1] += ` ${n}`;
      } else p.push(n);
      return p;
    }, []);

    phonemes.forEach((phoneme) => {
      newWordDiv.appendChild(renderSVG(phoneme, textSize));
    });
  }

  textDisplay.appendChild(newWordDiv);
};

const renderText = (text) => {
  clearText();

  for (const word of text.split(/(\s|[^a-zA-Z']+)/)) {
    if (word === "") continue;
    addWord(word);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  textDisplay = document.querySelector("#text-display");

  document.querySelector("#plaintext").addEventListener("input", (e) => {
    renderText(e.target.value);
  });

  if (localStorage.getItem("trunic-txt-size") != null) {
    textSize = Number(localStorage.getItem("trunic-txt-size"));
    document.querySelector("#text-size").value = textSize;
  }

  setTextSize(textSize);
  document.querySelector("#text-size").addEventListener("input", (e) => {
    setTextSize(e.target.value);
  });

  document.querySelector("#copy-btn").addEventListener("click", () => {
    const txtDisplayRect = textDisplay.getBoundingClientRect();
    const imgWidth = 640;
    const imgHeight = (imgWidth * txtDisplayRect.height) / txtDisplayRect.width;
    const c = document.createElement("canvas");
    c.width = imgWidth;
    c.height = imgHeight;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, imgWidth, imgHeight);
    const scalingRatio = imgWidth / txtDisplayRect.width;

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

    ctx.fillStyle = "#000";
    ctx.font = textSize * 0.27 + "vh Arial";

    for (const svg of document.querySelectorAll("svg")) {
      const { x, y, width: w, height: h } = svg.getBoundingClientRect();

      const [mx, my, mw, mh] = [
        (x - txtDisplayRect.x) * scalingRatio,
        (y - txtDisplayRect.y) * scalingRatio,
        w * scalingRatio,
        h * scalingRatio,
      ];

      for (const line of svg.querySelectorAll("line")) {
        ctx.beginPath();
        ctx.moveTo(
          mx + (mw * line.x1.baseVal.value) / 4.2,
          my + (mh * line.y1.baseVal.value) / 7
        );
        ctx.lineTo(
          mx + (mw * line.x2.baseVal.value) / 4.2,
          my + (mh * line.y2.baseVal.value) / 7
        );
        ctx.stroke();
      }

      for (const circle of svg.querySelectorAll("circle")) {
        ctx.beginPath();
        ctx.arc(
          mx + (mw * circle.cx.baseVal.value) / 4.2,
          my + (mh * circle.cy.baseVal.value) / 7,
          (circle.r.baseVal.value * mw) / 4.2,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
    }

    for (const span of document
      .querySelector("#text-display")
      .querySelectorAll("span")) {
      if (span.innerText.trim() != "") {
        const { x, y, width: w, height: h } = span.getBoundingClientRect();

        const [mx, my, mw, mh] = [
          (x - txtDisplayRect.x) * scalingRatio,
          (y - txtDisplayRect.y) * scalingRatio,
          w * scalingRatio,
          h * scalingRatio,
        ];

        ctx.fillText(span.innerText, mx, my + (mh * 2) / 3);
      }
    }

    c.toBlob((blob) => {
      navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      document.querySelector("#copy-btn").innerText = "Copied!";

      setTimeout(() => {
        document.querySelector("#copy-btn").innerText = "Copy to clipboard";
      }, 3000);
    });
  });

  renderText("Tunic Writer");
});
