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

  setTextSize(textSize);
  document.querySelector("#text-size").addEventListener("input", (e) => {
    setTextSize(e.target.value);
  });

  renderText("Tunic Writer");
});
