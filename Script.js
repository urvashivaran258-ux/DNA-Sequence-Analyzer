function analyzeDNA() {
    let sequence = document.getElementById("dnaInput").value;

    sequence = sequence.toUpperCase().replace(/\s+/g, "");

    let result = document.getElementById("result");

    if (sequence.length === 0) {
        result.innerHTML = "<p>Please enter a DNA sequence.</p>";
        return;
    }

    if (!/^[ATGC]+$/.test(sequence)) {
        result.innerHTML =
            "<p>Invalid sequence! Please use only A, T, G and C.</p>";
        return;
    }

    let total = sequence.length;

    let A = (sequence.match(/A/g) || []).length;
    let T = (sequence.match(/T/g) || []).length;
    let G = (sequence.match(/G/g) || []).length;
    let C = (sequence.match(/C/g) || []).length;

    let AT = ((A + T) / total) * 100;
    let GC = ((G + C) / total) * 100;

    result.innerHTML = `
        <h2>Analysis Result</h2>

        <p><strong>Total Length:</strong> ${total}</p>

        <p><strong>Adenine (A):</strong>
        ${A} (${((A / total) * 100).toFixed(2)}%)</p>

        <p><strong>Thymine (T):</strong>
        ${T} (${((T / total) * 100).toFixed(2)}%)</p>

        <p><strong>Guanine (G):</strong>
        ${G} (${((G / total) * 100).toFixed(2)}%)</p>

        <p><strong>Cytosine (C):</strong>
        ${C} (${((C / total) * 100).toFixed(2)}%)</p>

        <hr>

        <p><strong>GC Content:</strong> ${GC.toFixed(2)}%</p>

        <p><strong>AT Content:</strong> ${AT.toFixed(2)}%</p>
    `;
}

function clearDNA() {
    document.getElementById("dnaInput").value = "";
    document.getElementById("result").innerHTML = "";
}
