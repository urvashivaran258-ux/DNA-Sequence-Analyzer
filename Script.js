document.addEventListener("DOMContentLoaded", () => {
  const sequenceInput = document.getElementById("dnaSequence");
  const analyzeButton = document.getElementById("analyzeButton");
  const sampleButton = document.getElementById("sampleButton");
  const clearButton = document.getElementById("clearButton");
  const sequenceError = document.getElementById("sequenceError");

  const motifInput = document.getElementById("motifInput");
  const motifButton = document.getElementById("motifButton");
  const motifResult = document.getElementById("motifResult");

  const reverseComplementOutput =
    document.getElementById("reverseComplement");
  const copyComplementButton = document.getElementById(
    "copyComplementButton"
  );
  const copyMessage = document.getElementById("copyMessage");

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  let currentSequence = "";

  const sampleSequence =
    "ATGCGTACCGTAGCTAGCTAGGCTAACGTTAGCGATCGATCGGATCCGATGCTAGCTAGCATG";

  function cleanSequence(value) {
    return value.replace(/\s+/g, "").toUpperCase();
  }

  function isValidDNA(sequence) {
    return sequence.length > 0 && /^[ATGC]+$/.test(sequence);
  }

  function showError(message) {
    if (!sequenceError) return;

    sequenceError.textContent = message;
    sequenceError.hidden = false;
  }

  function hideError() {
    if (!sequenceError) return;

    sequenceError.textContent = "";
    sequenceError.hidden = true;
  }

  function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }

  function setBarWidth(id, percentage) {
    const element = document.getElementById(id);

    if (element) {
      element.style.width = `${percentage}%`;
    }
  }

  function countBases(sequence) {
    return {
      A: [...sequence].filter((base) => base === "A").length,
      T: [...sequence].filter((base) => base === "T").length,
      G: [...sequence].filter((base) => base === "G").length,
      C: [...sequence].filter((base) => base === "C").length
    };
  }

  function calculatePercentage(value, total) {
    return total === 0 ? 0 : (value / total) * 100;
  }

  function getGCLevel(gcContent) {
    if (gcContent < 40) {
      return "Low";
    }

    if (gcContent <= 60) {
      return "Moderate";
    }

    return "High";
  }

  function getReverseComplement(sequence) {
    const complementMap = {
      A: "T",
      T: "A",
      G: "C",
      C: "G"
    };

    return sequence
      .split("")
      .reverse()
      .map((base) => complementMap[base])
      .join("");
  }

  function getSequenceFromInput() {
    if (!sequenceInput) {
      return "";
    }

    const sequence = cleanSequence(sequenceInput.value);

    if (sequence.length === 0) {
      showError("Please enter a DNA sequence.");
      return "";
    }

    if (!isValidDNA(sequence)) {
      showError("Invalid DNA sequence. Use only A, T, G, and C.");
      return "";
    }

    hideError();
    sequenceInput.value = sequence;
    currentSequence = sequence;

    return sequence;
  }

  function updateAnalysisResults(sequence) {
    const counts = countBases(sequence);
    const sequenceLength = sequence.length;

    const gcContent = calculatePercentage(
      counts.G + counts.C,
      sequenceLength
    );

    const atContent = calculatePercentage(
      counts.A + counts.T,
      sequenceLength
    );

    setText("sequenceLength", sequenceLength);
    setText("gcContent", `${gcContent.toFixed(2)}%`);
    setText("atContent", `${atContent.toFixed(2)}%`);
    setText("gcCategory", getGCLevel(gcContent));

    setText("aCount", counts.A);
    setText("tCount", counts.T);
    setText("gCount", counts.G);
    setText("cCount", counts.C);

    setBarWidth(
      "aBar",
      calculatePercentage(counts.A, sequenceLength)
    );

    setBarWidth(
      "tBar",
      calculatePercentage(counts.T, sequenceLength)
    );

    setBarWidth(
      "gBar",
      calculatePercentage(counts.G, sequenceLength)
    );

    setBarWidth(
      "cBar",
      calculatePercentage(counts.C, sequenceLength)
    );

    if (reverseComplementOutput) {
      reverseComplementOutput.textContent =
        getReverseComplement(sequence);
    }

    const resultStatus = document.getElementById("resultStatus");

    if (resultStatus) {
      resultStatus.textContent = "Analysis complete";
      resultStatus.classList.add("success");
    }

    updateORFResult(sequence);
  }

  function findMotifPositions(sequence, motif) {
    const positions = [];
    let searchPosition = 0;

    while (searchPosition <= sequence.length - motif.length) {
      const foundPosition = sequence.indexOf(motif, searchPosition);

      if (foundPosition === -1) {
        break;
      }

      positions.push(foundPosition + 1);
      searchPosition = foundPosition + 1;
    }

    return positions;
  }

  function searchMotif() {
    if (!motifInput || !motifResult) {
      return;
    }

    const sequence = currentSequence ||
      (sequenceInput ? cleanSequence(sequenceInput.value) : "");

    const motif = cleanSequence(motifInput.value);

    if (!isValidDNA(sequence)) {
      motifResult.textContent =
        "Please analyze a valid DNA sequence first.";
      return;
    }

    if (!isValidDNA(motif)) {
      motifResult.textContent =
        "Please enter a valid motif using only A, T, G, and C.";
      return;
    }

    const positions = findMotifPositions(sequence, motif);

    if (positions.length === 0) {
      motifResult.textContent =
        `Motif ${motif} was not found in this sequence.`;
      return;
    }

    motifResult.textContent =
      `Motif ${motif} was found ${positions.length} time${
        positions.length === 1 ? "" : "s"
      } at position${
        positions.length === 1 ? "" : "s"
      }: ${positions.join(", ")}.`;
  }

  function findLongestORF(sequence) {
    const stopCodons = ["TAA", "TAG", "TGA"];
    let longestORF = null;

    for (let frame = 0; frame < 3; frame++) {
      for (
        let start = frame;
        start <= sequence.length - 3;
        start += 3
      ) {
        if (sequence.slice(start, start + 3) !== "ATG") {
          continue;
        }

        for (
          let stop = start + 3;
          stop <= sequence.length - 3;
          stop += 3
        ) {
          const codon = sequence.slice(stop, stop + 3);

          if (stopCodons.includes(codon)) {
            const orfSequence = sequence.slice(start, stop + 3);

            if (
              !longestORF ||
              orfSequence.length > longestORF.sequence.length
            ) {
              longestORF = {
                sequence: orfSequence,
                startPosition: start + 1,
                endPosition: stop + 3,
                codonCount: orfSequence.length / 3
              };
            }

            break;
          }
        }
      }
    }

    return longestORF;
  }

  function updateORFResult(sequence) {
    const orfResult = document.getElementById("orfResult");

    if (!orfResult) {
      return;
    }

    const longestORF = findLongestORF(sequence);

    if (!longestORF) {
      orfResult.textContent =
        "No complete open reading frame was found.";
      return;
    }

    orfResult.textContent =
      `Longest ORF: ${longestORF.codonCount} codons, ` +
      `from position ${longestORF.startPosition} ` +
      `to position ${longestORF.endPosition}. ` +
      `Sequence: ${longestORF.sequence}`;
  }

  function resetResults() {
    [
      "sequenceLength",
      "gcContent",
      "atContent",
      "gcCategory"
    ].forEach((id) => setText(id, "—"));

    ["aCount", "tCount", "gCount", "cCount"].forEach((id) => {
      setText(id, "0");
    });

    ["aBar", "tBar", "gBar", "cBar"].forEach((id) => {
      setBarWidth(id, 0);
    });

    if (reverseComplementOutput) {
      reverseComplementOutput.textContent =
        "Your result will appear here.";
    }

    if (motifResult) {
      motifResult.textContent =
        "Analyze a sequence and enter a motif to begin.";
    }

    if (motifInput) {
      motifInput.value = "";
    }

    if (copyMessage) {
      copyMessage.textContent = "";
    }

    const resultStatus = document.getElementById("resultStatus");

    if (resultStatus) {
      resultStatus.textContent = "Waiting for sequence";
      resultStatus.classList.remove("success");
    }

    const orfResult = document.getElementById("orfResult");

    if (orfResult) {
      orfResult.textContent =
        "Analyze a sequence to scan for an open reading frame.";
    }
  }

  async function copyReverseComplement() {
    if (!reverseComplementOutput || !currentSequence) {
      if (copyMessage) {
        copyMessage.textContent =
          "Analyze a sequence before copying.";
      }

      return;
    }

    const text = reverseComplementOutput.textContent;

    try {
      await navigator.clipboard.writeText(text);

      if (copyMessage) {
        copyMessage.textContent =
          "Reverse complement copied successfully.";
      }
    } catch (error) {
      const temporaryTextArea = document.createElement("textarea");

      temporaryTextArea.value = text;
      document.body.appendChild(temporaryTextArea);
      temporaryTextArea.select();
      document.execCommand("copy");
      temporaryTextArea.remove();

      if (copyMessage) {
        copyMessage.textContent =
          "Reverse complement copied successfully.";
      }
    }
  }

  if (analyzeButton) {
    analyzeButton.addEventListener("click", () => {
      const sequence = getSequenceFromInput();

      if (sequence) {
        updateAnalysisResults(sequence);
      }
    });
  }

  if (sampleButton) {
    sampleButton.addEventListener("click", () => {
      if (!sequenceInput) {
        return;
      }

      sequenceInput.value = sampleSequence;
      hideError();
      sequenceInput.focus();
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      if (sequenceInput) {
        sequenceInput.value = "";
      }

      currentSequence = "";
      hideError();
      resetResults();
    });
  }

  if (motifButton) {
    motifButton.addEventListener("click", searchMotif);
  }

  if (motifInput) {
    motifInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        searchMotif();
      }
    });
  }

  if (copyComplementButton) {
    copyComplementButton.addEventListener(
      "click",
      copyReverseComplement
    );
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (formMessage) {
        formMessage.hidden = false;
        formMessage.textContent =
          "Thank you for your message. Your form was submitted successfully.";
      }

      contactForm.reset();
    });
  }
});
