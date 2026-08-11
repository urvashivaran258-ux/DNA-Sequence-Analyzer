document.addEventListener("DOMContentLoaded", function () {

    const sequenceInput =
        document.getElementById("dnaSequence");

    const analyzeButton =
        document.getElementById("analyzeButton");

    const sampleButton =
        document.getElementById("sampleButton");

    const clearButton =
        document.getElementById("clearButton");

    const sequenceError =
        document.getElementById("sequenceError");

    const result =
        document.getElementById("result");

    const reverseComplement =
        document.getElementById("reverseComplement");

    const copyButton =
        document.getElementById("copyComplementButton");

    const copyMessage =
        document.getElementById("copyMessage");


    const sampleSequence =
        "ATGCGTACCGTAGCTAGCTAGGCTAACGTTAGCGATCGATCGGATCC";


    function cleanSequence(sequence) {

        return sequence
            .replace(/\s+/g, "")
            .toUpperCase();

    }


    function validDNA(sequence) {

        return /^[ATGC]+$/.test(sequence);

    }


    function countBase(sequence, base) {

        return [...sequence]
            .filter(function (letter) {
                return letter === base;
            }).length;

    }


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
            .map(function (base) {
                return complement[base];
            })
            .join("");

    }


    function analyzeDNA() {

        let sequence =
            cleanSequence(sequenceInput.value);


        if (sequence.length === 0) {

            sequenceError.textContent =
                "Please enter a DNA sequence.";

            sequenceError.hidden = false;

            return;
        }


        if (!validDNA(sequence)) {

            sequenceError.textContent =
                "Invalid DNA sequence! Use only A, T, G and C.";

            sequenceError.hidden = false;

            return;
        }


        sequenceError.hidden = true;

        sequenceInput.value = sequence;


        const length = sequence.length;


        const A = countBase(sequence, "A");

        const T = countBase(sequence, "T");

        const G = countBase(sequence, "G");

        const C = countBase(sequence, "C");


        const APercent =
            (A / length) * 100;

        const TPercent =
            (T / length) * 100;

        const GPercent =
            (G / length) * 100;

        const CPercent =
            (C / length) * 100;


        const GC =
            ((G + C) / length) * 100;

        const AT =
            ((A + T) / length) * 100;


        let gcLevel;


        if (GC < 40) {

            gcLevel = "Low";

        } else if (GC <= 60) {

            gcLevel = "Moderate";

        } else {

            gcLevel = "High";

        }


        document.getElementById("sequenceLength")
            .textContent = length;

        document.getElementById("gcContent")
            .textContent = GC.toFixed(2) + "%";

        document.getElementById("atContent")
            .textContent = AT.toFixed(2) + "%";

        document.getElementById("gcCategory")
            .textContent = gcLevel;


        document.getElementById("aCount")
            .textContent =
            A + " (" + APercent.toFixed(2) + "%)";


        document.getElementById("tCount")
            .textContent =
            T + " (" + TPercent.toFixed(2) + "%)";


        document.getElementById("gCount")
            .textContent =
            G + " (" + GPercent.toFixed(2) + "%)";


        document.getElementById("cCount")
            .textContent =
            C + " (" + CPercent.toFixed(2) + "%)";


        reverseComplement.textContent =
            getReverseComplement(sequence);

    }


    function clearDNA() {

        sequenceInput.value = "";

        sequenceError.hidden = true;

        document.getElementById("sequenceLength")
            .textContent = "—";

        document.getElementById("gcContent")
            .textContent = "—";

        document.getElementById("atContent")
            .textContent = "—";

        document.getElementById("gcCategory")
            .textContent = "—";

        document.getElementById("aCount")
            .textContent = "0";

        document.getElementById("tCount")
            .textContent = "0";

        document.getElementById("gCount")
            .textContent = "0";

        document.getElementById("cCount")
            .textContent = "0";

        reverseComplement.textContent =
            "Your result will appear here.";

        copyMessage.textContent = "";

    }


    function loadSample() {

        sequenceInput.value =
            sampleSequence;

        sequenceError.hidden = true;

    }


    async function copyReverseComplement() {

        const text =
            reverseComplement.textContent;


        if (
            !text ||
            text === "Your result will appear here."
        ) {

            copyMessage.textContent =
                "Analyze a sequence first.";

            return;

        }


        try {

            await navigator.clipboard.writeText(text);

            copyMessage.textContent =
                "Copied successfully!";

        } catch (error) {

            copyMessage.textContent =
                "Copy failed. Please copy manually.";

        }

    }
    <button onclick="clearDNA()">Clear</button>

    analyzeButton.addEventListener(
        "click",
        analyzeDNA
    );


    clearButton.addEventListener(
        "click",
        clearDNA
    );


    sampleButton.addEventListener(
        "click",
        loadSample
    );


    copyButton.addEventListener(
        "click",
        copyReverseComplement
    );

});
