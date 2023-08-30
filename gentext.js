const generateWord = (word, size, unit) => {
  word = word.toUpperCase();

  const newWordDiv = document.createElement("div");
  newWordDiv.classList.add("word");

  if (!(word in cmudict)) {
    const unknownText = document.createElement("span");
    unknownText.classList.add("unknown-text");
    unknownText.innerText = word;
    unknownText.style.lineHeight = size * 0.8 + unit;
    unknownText.style.fontSize = size * 0.8 + unit;
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
      newWordDiv.appendChild(renderSVG(phoneme, size, unit));
    });
  }

  return newWordDiv;
};

const generateText = (text, parent, size, unit) => {
  for (const word of text.split(/(\s|[^a-zA-Z']+)/)) {
    if (word === "") continue;
    parent.appendChild(generateWord(word, size, unit));
  }
};
