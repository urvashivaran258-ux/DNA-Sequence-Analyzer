document.addEventListener("DOMContentLoaded", function () {

    const dnaInput = document.getElementById("dnaSequence");
    const analyzeBtn = document.getElementById("analyzeButton");
    const sampleBtn = document.getElementById("sampleButton");
    const clearBtn = document.getElementById("clearButton");

    const sampleDNA =
        "ATGTAGCTTACCCCTTAGACCTTTTTGAAGAAGGTTCTGTTACTAACATGTTTACTTCCATTGTGGGTAA";

    // ANALYZE BUTTON
    analyzeBtn.addEventListener("click", function () {

        let sequence = dnaInput.value
            .toUpperCase()
            .replace(/\s/g, "");

        if (sequence.length === 0) {
            alert("Please enter a DNA sequence.");
            return;
        }

        if (!/^[ATGC]+$/.test(sequence)) {
            alert("Only A, T, G and C are allowed.");
            return;
        }

        let A = 0;
        let T = 0;
        let G = 0;
        let C = 0;

        for (let i = 0; i < sequence.length; i++) {

            if (sequence[i] === "A") A++;
            if (sequence[i] === "T") T++;
            if (sequence[i] === "G") G++;
            if (sequence[i] === "C") C++;
        }

        let length = sequence.length;

        let gc = ((G + C) / length) * 100;
        let at = ((A + T) / length) * 100;

        document.getElementById("sequenceLength").textContent = length;
        document.getElementById("gcContent").textContent =
            gc.toFixed(2) + "%";

        document.getElementById("atContent").textContent =
            at.toFixed(2) + "%";

        if (gc < 40) {
            document.getElementById("gcCategory").textContent = "Low";
        }
        else if (gc <= 60) {
            document.getElementById("gcCategory").textContent = "Moderate";
        }
        else {
            document.getElementById("gcCategory").textContent = "High";
        }

        document.getElementById("aCount").textContent = A;
        document.getElementById("tCount").textContent = T;
        document.getElementById("gCount").textContent = G;
        document.getElementById("cCount").textContent = C;

        document.getElementById("resultStatus").textContent =
            "Analysis Complete";

        // Reverse Complement
        let complement = "";

        for (let i = sequence.length - 1; i >= 0; i--) {

            if (sequence[i] === "A") complement += "T";
            if (sequence[i] === "T") complement += "A";
            if (sequence[i] === "G") complement += "C";
            if (sequence[i] === "C") complement += "G";
        }

        document.getElementById("reverseComplement").textContent =
            complement;
    });


    // SAMPLE BUTTON
    sampleBtn.addEventListener("click", function () {

        dnaInput.value = sampleDNA;

    });


    // CLEAR BUTTON
    clearBtn.addEventListener("click", function () {

        dnaInput.value = "";

        document.getElementById("sequenceLength").textContent = "—";
        document.getElementById("gcContent").textContent = "—";
        document.getElementById("atContent").textContent = "—";
        document.getElementById("gcCategory").textContent = "—";

        document.getElementById("aCount").textContent = "0";
        document.getElementById("tCount").textContent = "0";
        document.getElementById("gCount").textContent = "0";
        document.getElementById("cCount").textContent = "0";

        document.getElementById("reverseComplement").textContent =
            "Your result will appear here.";

        document.getElementById("resultStatus").textContent =
            "Waiting for sequence";

    });

});
