document.addEventListener("DOMContentLoaded", function () {

    const sequenceInput = document.getElementById("dnaSequence");
    const analyzeButton = document.getElementById("analyzeButton");
    const clearButton = document.getElementById("clearButton");

    function analyzeDNA() {

        if (!sequenceInput) return;

        const sequence = sequenceInput.value
            .replace(/\s/g, "")
            .toUpperCase();

        if (sequence === "") {
            alert("Please enter a DNA sequence.");
            return;
        }

        if (!/^[ATGC]+$/.test(sequence)) {
            alert("Invalid DNA sequence! Use only A, T, G and C.");
            return;
        }

        const length = sequence.length;

        const a = (sequence.match(/A/g) || []).length;
        const t = (sequence.match(/T/g) || []).length;
        const g = (sequence.match(/G/g) || []).length;
        const c = (sequence.match(/C/g) || []).length;

        const aPercent = (a / length) * 100;
        const tPercent = (t / length) * 100;
        const gPercent = (g / length) * 100;
        const cPercent = (c / length) * 100;

        const gcContent = ((g + c) / length) * 100;

        const result = document.getElementById("result");

        if (result) {
            result.innerHTML = `
                <h3>Analysis Result</h3>

                <p><strong>Sequence Length:</strong> ${length}</p>

                <p><strong>A:</strong> ${a} 
                (${aPercent.toFixed(2)}%)</p>

                <p><strong>T:</strong> ${t} 
                (${tPercent.toFixed(2)}%)</p>

                <p><strong>G:</strong> ${g} 
                (${gPercent.toFixed(2)}%)</p>

                <p><strong>C:</strong> ${c} 
                (${cPercent.toFixed(2)}%)</p>

                <p><strong>GC Content:</strong> 
                ${gcContent.toFixed(2)}%</p>

                <p><strong>AT Content:</strong> 
                ${(100 - gcContent).toFixed(2)}%</p>
            `;
        }
    }

    function clearDNA() {

        if (sequenceInput) {
            sequenceInput.value = "";
        }

        const result = document.getElementById("result");

        if (result) {
            result.innerHTML = `
                <p>Enter a DNA sequence and click Analyze.</p>
            `;
        }
    }

    if (analyzeButton) {
        analyzeButton.addEventListener("click", analyzeDNA);
    }

    if (clearButton) {
        clearButton.addEventListener("click", clearDNA);
    }

});
