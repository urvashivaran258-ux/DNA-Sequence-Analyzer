document.addEventListener("DOMContentLoaded", function () {

    const sequenceInput = document.getElementById("dnaSequence");
    const analyzeButton = document.getElementById("analyzeButton");
    const sampleButton = document.getElementById("sampleButton");
    const clearButton = document.getElementById("clearButton");

    const motifInput = document.getElementById("motifInput");
    const motifButton = document.getElementById("motifButton");
    const motifResult = document.getElementById("motifResult");

    const reverseComplement = document.getElementById("reverseComplement");
    const copyButton = document.getElementById("copyComplementButton");
    const copyMessage = document.getElementById("copyMessage");

    let currentSequence = "";

    const sampleSequence =
        "ATGCGTACCGTAGCTAGCTAGGCTAACGTTAGCGATCGATCGGATCCGATGCTAGCTAGCATG";


    /* ---------- CLEAN DNA ---------- */

    function cleanDNA(sequence) {
        return sequence.replace(/\s+/g, "").toUpperCase();
    }


    /* ---------- VALIDATE DNA ---------- */

    function validDNA(sequence) {
        return /^[ATGC]+$/.test(sequence);
    }


    /* ---------- COUNT BASES ---------- */

    function countBases(sequence) {

        let A = 0;
        let T = 0;
        let G = 0;
        let C = 0;

        for (let base of sequence) {

            if (base === "A") A++;
            if (base === "T") T++;
            if (base === "G") G++;
            if (base === "C") C++;
        }

        return { A, T, G, C };
    }


    /* ---------- ANALYZE ---------- */

    function analyzeDNA() {

        if (!sequenceInput) return;

        let sequence = cleanDNA(sequenceInput.value);

        if (sequence.length === 0) {
            alert("Please enter a DNA sequence.");
            return;
        }

        if (!validDNA(sequence)) {
            alert("Invalid DNA sequence. Use only A, T, G and C.");
            return;
        }

        sequenceInput.value = sequence;
        currentSequence = sequence;

        const counts = countBases(sequence);
        const length = sequence.length;

        const gc = ((counts.G + counts.C) / length) * 100;
        const at = ((counts.A + counts.T) / length) * 100;


        /* Results */

        setText("sequenceLength", length);
        setText("gcContent", gc.toFixed(2) + "%");
        setText("atContent", at.toFixed(2) + "%");

        let level = "Low";

        if (gc >= 40 && gc <= 60) {
            level = "Moderate";
        }

        if (gc > 60) {
            level = "High";
        }

        setText("gcCategory", level);


        /* Nucleotide Count */

        setText("aCount", counts.A);
        setText("tCount", counts.T);
        setText("gCount", counts.G);
        setText("cCount", counts.C);


        /* Reverse Complement */

        const reverse = getReverseComplement(sequence);

        if (reverseComplement) {
            reverseComplement.textContent = reverse;
        }


        /* Status */

        setText("resultStatus", "Analysis Complete");


        /* ORF */

        findORF(sequence);
    }


    /* ---------- SET TEXT ---------- */

    function setText(id, value) {

        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }


    /* ---------- REVERSE COMPLEMENT ---------- */

    function getReverseComplement(sequence) {

        const map = {
            A: "T",
            T: "A",
            G: "C",
            C: "G"
        };

        let result = "";

        for (let i = sequence.length - 1; i >= 0; i--) {
            result += map[sequence[i]];
        }

        return result;
    }


    /* ---------- SAMPLE BUTTON ---------- */

    if (sampleButton) {

        sampleButton.addEventListener("click", function () {

            sequenceInput.value = sampleSequence;

            currentSequence = sampleSequence;

            analyzeDNA();
        });
    }


    /* ---------- CLEAR BUTTON ---------- */

    if (clearButton) {

        clearButton.addEventListener("click", function () {

            sequenceInput.value = "";

            currentSequence = "";

            setText("sequenceLength", "—");
            setText("gcContent", "—");
            setText("atContent", "—");
            setText("gcCategory", "—");

            setText("aCount", "0");
            setText("tCount", "0");
            setText("gCount", "0");
            setText("cCount", "0");

            setText("resultStatus", "Waiting for sequence");

            if (reverseComplement) {
                reverseComplement.textContent =
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

            setText(
                "orfResult",
                "Analyze a sequence to scan for an open reading frame."
            );
        });
    }


    /* ---------- ANALYZE BUTTON ---------- */

    if (analyzeButton) {

        analyzeButton.addEventListener("click", function () {
            analyzeDNA();
        });
    }


    /* ---------- MOTIF SEARCH ---------- */

    function searchMotif() {

        if (!sequenceInput || !motifInput || !motifResult) {
            return;
        }

        let sequence = cleanDNA(sequenceInput.value);
        let motif = cleanDNA(motifInput.value);

        if (!validDNA(sequence)) {

            motifResult.textContent =
                "Please enter a valid DNA sequence first.";

            return;
        }

        if (!validDNA(motif)) {

            motifResult.textContent =
                "Please enter a valid motif using A, T, G and C.";

            return;
        }


        let positions = [];
        let start = 0;

        while (true) {

            let position = sequence.indexOf(motif, start);

            if (position === -1) {
                break;
            }

            positions.push(position + 1);

            start = position + 1;
        }


        if (positions.length === 0) {

            motifResult.textContent =
                "Motif " + motif + " was not found.";

        } else {

            motifResult.textContent =
                "Motif " +
                motif +
                " found " +
                positions.length +
                " time(s) at position(s): " +
                positions.join(", ");
        }
    }


    if (motifButton) {

        motifButton.addEventListener("click", function () {
            searchMotif();
        });
    }


    /* ---------- MOTIF ENTER KEY ---------- */

    if (motifInput) {

        motifInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchMotif();
            }
        });
    }


    /* ---------- ORF SEARCH ---------- */

    function findORF(sequence) {

        const orfResult =
            document.getElementById("orfResult");

        if (!orfResult) {
            return;
        }

        const stopCodons = ["TAA", "TAG", "TGA"];

        let longestORF = null;


        for (let frame = 0; frame < 3; frame++) {

            for (
                let start = frame;
                start <= sequence.length - 3;
                start += 3
            ) {

                if (
                    sequence.substring(start, start + 3) !== "ATG"
                ) {
                    continue;
                }


                for (
                    let stop = start + 3;
                    stop <= sequence.length - 3;
                    stop += 3
                ) {

                    const codon =
                        sequence.substring(stop, stop + 3);


                    if (stopCodons.includes(codon)) {

                        const orf =
                            sequence.substring(
                                start,
                                stop + 3
                            );


                        if (
                            longestORF === null ||
                            orf.length >
                            longestORF.sequence.length
                        ) {

                            longestORF = {

                                sequence: orf,

                                start: start + 1,

                                end: stop + 3,

                                codons: orf.length / 3
                            };
                        }

                        break;
                    }
                }
            }
        }


        if (!longestORF) {

            orfResult.textContent =
                "No complete open reading frame was found.";

            return;
        }


        orfResult.textContent =
            "Longest ORF: " +
            longestORF.codons +
            " codons, from position " +
            longestORF.start +
            " to " +
            longestORF.end +
            ".";
    }


    /* ---------- COPY REVERSE COMPLEMENT ---------- */

    if (copyButton) {

        copyButton.addEventListener("click", function () {

            if (
                !reverseComplement ||
                reverseComplement.textContent ===
                "Your result will appear here."
            ) {

                if (copyMessage) {
                    copyMessage.textContent =
                        "Analyze a sequence first.";
                }

                return;
            }


            const text =
                reverseComplement.textContent;


            navigator.clipboard.writeText(text)
                .then(function () {

                    if (copyMessage) {
                        copyMessage.textContent =
                            "Reverse complement copied successfully.";
                    }

                })
                .catch(function () {

                    if (copyMessage) {
                        copyMessage.textContent =
                            "Copy failed. Please copy manually.";
                    }

                });
        });
    }

});

const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {

    feedbackForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("feedbackName").value.trim();
        const rating = document.getElementById("rating").value;
        const feedback = document.getElementById("feedbackText").value.trim();

        const message = document.getElementById("feedbackMessage");

        if (name === "" || rating === "" || feedback === "") {
            message.textContent = "Please fill all fields.";
            return;
        }

        message.textContent =
            "Thank you " + name + "! Your feedback has been submitted successfully.";

        feedbackForm.reset();
    });
}

const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {
    // ...
}
