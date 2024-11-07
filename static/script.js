let g, p, a, b, A, B, aliceSecret, bobSecret;
let aliceReady = false, bobReady = false;

// Send g and p from Alice to Bob
function sendToBob() {
    g = parseInt(document.getElementById('g').value);
    p = parseInt(document.getElementById('p').value);
    if (isNaN(g) || isNaN(p)) {
        alert("Please enter valid integers for g and p.");
        return;
    }
    document.getElementById('bob-content').innerHTML = `
        <p>Hi Bob, let's use g = ${g} and p = ${p}.</p>
        <button onclick="acceptGP()">Accept</button>
    `;
    document.getElementById('eve-observations').innerHTML += `<p>Alice sends Bob - g = ${g}, p = ${p}</p>`;
}

// Bob accepts g and p
function acceptGP() {
    document.getElementById('bob-content').innerHTML = `<p>Bob has accepted the values g = ${g} and p = ${p}.</p>`;
    document.getElementById('alice-content').innerHTML = `
        <p>Choose an exponent a:</p>
        <input type="number" id="a" placeholder="Alice's exponent a">
        <button onclick="calculateA()">Calculate A</button>
    `;
    document.getElementById('bob-content').innerHTML += `
        <p>Choose an exponent b:</p>
        <input type="number" id="b" placeholder="Bob's exponent b">
        <button onclick="calculateB()">Calculate B</button>
    `;
}

// Calculate A for Alice
function calculateA() {
    a = parseInt(document.getElementById('a').value);
    if (isNaN(a)) {
        alert("Please enter a valid integer for Alice's exponent.");
        return;
    }
    A = Math.pow(g, a) % p;
    document.getElementById('alice-content').innerHTML = `
        <p>Alice calculates A = ${A}</p>
        <button onclick="sendAToBob()">Send A to Bob</button>
    `;
    document.getElementById('eve-observations').innerHTML += `<p>Alice sends A = ${A}</p>`;
}

// Calculate B for Bob
function calculateB() {
    b = parseInt(document.getElementById('b').value);
    if (isNaN(b)) {
        alert("Please enter a valid integer for Bob's exponent.");
        return;
    }
    B = Math.pow(g, b) % p;
    document.getElementById('bob-content').innerHTML = `
        <p>Bob calculates B = ${B}</p>
        <button onclick="sendBToAlice()">Send B to Alice</button>
    `;
    document.getElementById('eve-observations').innerHTML += `<p>Bob sends B = ${B}</p>`;
}

// Send A to Bob and B to Alice
function sendAToBob() {
    document.getElementById('bob-content').innerHTML += `<p>Bob receives A = ${A}</p>`;
    checkForKeyCalculation();
}

function sendBToAlice() {
    document.getElementById('alice-content').innerHTML += `<p>Alice receives B = ${B}</p>`;
    checkForKeyCalculation();
}

// Show button to calculate shared secret key 
function checkForKeyCalculation() {
    if (A && B) {
        if (!document.getElementById('alice-calculate-key')) {
            document.getElementById('alice-content').innerHTML += `
                <button id="alice-calculate-key" onclick="calculateAliceSecret()">Calculate Alice's Secret Key</button>
                <p id="alice-secret"></p>
            `;
        }
        if (!document.getElementById('bob-calculate-key')) {
            document.getElementById('bob-content').innerHTML += `
                <button id="bob-calculate-key" onclick="calculateBobSecret()">Calculate Bob's Secret Key</button>
                <p id="bob-secret"></p>
            `;
        }
    }
}

// Calculate shared secret key for Alice
function calculateAliceSecret() {
    aliceSecret = Math.pow(B, a) % p;
    aliceReady = true;
    document.getElementById('alice-secret').innerText = "Waiting for Bob...";
    checkKeysMatch();
}

// Calculate shared secret key for Bob
function calculateBobSecret() {
    bobSecret = Math.pow(A, b) % p;
    bobReady = true;
    document.getElementById('bob-secret').innerText = "Waiting for Alice...";
    checkKeysMatch();
}

// Check if Alice and Bob's keys match
function checkKeysMatch() {
    if (aliceReady && bobReady) {
        const matchMessage = (aliceSecret === bobSecret)
            ? "Shared keys match! Secure communication established."
            : "Keys do not match! Something went wrong.";
        document.getElementById('match-result').innerHTML = `<p>${matchMessage}</p>`;
        document.getElementById('alice-secret').innerText = `Shared key: ${aliceSecret}`;
        document.getElementById('bob-secret').innerText = `Shared key: ${bobSecret}`;
    }
}
