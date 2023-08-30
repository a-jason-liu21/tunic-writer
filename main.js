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

const textDisplay = document.querySelector("#text-display");
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

const generatePreviewText = (text) => {
  textDisplay.innerHTML = "";
  generateText(text, textDisplay, textSize, "vh");
};

document.querySelector("#plaintext").addEventListener("input", (e) => {
  generatePreviewText(e.target.value);
});

if (localStorage.getItem("trunic-txt-size") != null) {
  textSize = Number(localStorage.getItem("trunic-txt-size"));
  document.querySelector("#text-size").value = textSize;
}

setTextSize(textSize);
document.querySelector("#text-size").addEventListener("input", (e) => {
  setTextSize(e.target.value);
});

document.querySelector("#copy-btn").addEventListener("click", async () => {
  await copyToClipboard(document.querySelector("#plaintext").value);

  document.querySelector("#copy-btn").innerText = "Copied!";

  setTimeout(() => {
    document.querySelector("#copy-btn").innerText = "Copy to clipboard";
  }, 3000);
});

generatePreviewText("Tunic Writer");
