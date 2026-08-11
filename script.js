// DNA Sequence Analyzer

function getSequence() {
    const input = document.getElementById("dnaSequence");

    if (!input) return "";

    return input.value.replace(/\s+/g, "").toUpperCase();
}


// ANALYZE BUTTON
function analyzeDNA() {

    const input = document.getElementById("dnaSequence");
    const result = document.getElementById("result");

    if (!input || !result) return;

    const sequence = getSequence();

    if (sequence === "") {
        result.innerHTML = "<p>Please enter a DNA sequence.</p>";
        return;
    }

    if (!/^[ATGC]+$/.test(sequence)) {
        result.innerHTML =
            "<p style='color:red;'>Invalid DNA sequence! Use only A, T, G and C.</p>";
        return;
    }

    const length = sequence.length;

    const A = (sequence.match(/A/g) || []).length;
    const T = (sequence.match(/T/g) || []).length;
    const G = (sequence.match(/G/g) || []).length;
    const C = (sequence.match(/C/g) || []).length;

    const gc = ((G + C) / length) * 100;
    const at = ((A + T) / length) * 100;

    result.innerHTML = `
        <h3>Analysis Result</h3>

        <p><strong>Sequence Length:</strong> ${length}</p>

        <p><strong>GC Content:</strong> ${gc.toFixed(2)}%</p>

        <p><strong>AT Content:</strong> ${at.toFixed(2)}%</p>

        <hr>

        <p><strong>Adenine (A):</strong> ${A}</p>
        <p><strong>Thymine (T):</strong> ${T}</p>
        <p><strong>Guanine (G):</strong> ${G}</p>
        <p><strong>Cytosine (C):</strong> ${C}</p>

        <h3>Reverse Complement</h3>

        <p>${getReverseComplement(sequence)}</p>
    `;
}


// SAMPLE BUTTON
function sampleDNA() {

    const input = document.getElementById("dnaSequence");

    if (!input) return;

    input.value =
        "ATGCGTACCGTAGCTAGCTAGGCTAACGTTAGCGATCGATCGGATCC";
}


// CLEAR BUTTON
function clearDNA() {

    const input = document.getElementById("dnaSequence");
    const result = document.getElementById("result");

    if (input) {
        input.value = "";
    }

    if (result) {
        result.innerHTML =
            "<p>Enter a DNA sequence and click Analyze.</p>";
    }
}


// REVERSE COMPLEMENT
function getReverseComplement(sequence) {

    const complement = {
        A: "T",
        T: "A",
        G: "C",
        C: "G"
    };

    return sequence
        .split("")
        .reverse()
        .map(base => complement[base])
        .join("");
}
