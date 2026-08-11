.analyzer-box {
    max-width: 850px;
    margin: 40px auto;
    padding: 30px;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.analyzer-box h2 {
    margin-top: 0;
    color: #145da0;
    font-size: 28px;
}

.analyzer-box p {
    color: #4b5563;
    font-size: 14px;
}

#dnaInput {
    width: 100%;
    min-height: 150px;
    padding: 15px;
    border: 1px solid #7aa7c7;
    border-radius: 10px;
    outline: none;
    resize: vertical;
    font-family: monospace;
    font-size: 14px;
}

#dnaInput:focus {
    border-color: #1464a5;
    box-shadow: 0 0 0 3px rgba(20, 100, 165, 0.15);
}

.button-group {
    display: flex;
    gap: 12px;
    margin-top: 18px;
}

.button-group button {
    flex: 1;
    padding: 13px;
    border: none;
    border-radius: 8px;
    color: white;
    background: #1769aa;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s ease;
}

.button-group button:hover {
    background: #0d4f86;
    transform: translateY(-2px);
}

#result {
    margin-top: 22px;
    padding: 18px;
    border-left: 4px solid #1769aa;
    border-radius: 8px;
    background: #f4f9fd;
}

.error-message {
    color: #d62828 !important;
    font-weight: bold;
}

.result-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 18px 0;
}

.result-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px;
    border-radius: 10px;
    background: white;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
}

.base-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: white;
    font-weight: bold;
}

.adenine {
    background: #2a9d8f;
}

.thymine {
    background: #457b9d;
}

.guanine {
    background: #e9c46a;
}

.cytosine {
    background: #e76f51;
}

.result-item span:last-child {
    margin-left: auto;
    color: #4b5563;
    font-size: 13px;
}

.summary-result {
    margin-top: 18px;
    padding: 12px 18px;
    border-radius: 10px;
    background: #eaf4fb;
}

.summary-result p {
    margin: 8px 0;
}

@media (max-width: 600px) {
    .analyzer-box {
        margin: 20px 12px;
        padding: 20px;
    }

    .result-grid {
        grid-template-columns: 1fr;
    }

    .button-group {
        flex-direction: column;
    }
}
