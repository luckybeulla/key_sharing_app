let g, p, a, b, A, B, aliceSecret, bobSecret;
let aliceReady = false, bobReady = false;

function sendToBob() {
    g = parseInt(document.getElementById('g').value);
    p = parseInt(document.getElementById('p').value);
    if (isNaN(g) || isNaN(p)) {
        alert("Please enter valid integers for g and p.");
        return;
    }
    
    const gpMessage = `<p class="gp-message">From Alice: Hey Bob, let's use g = ${g} and p = ${p}.</p>`;
    const existingGP = document.querySelector('#bob-inbox .gp-message');
    if (existingGP) {
        existingGP.outerHTML = gpMessage;
    } else {
        document.getElementById('bob-inbox').innerHTML += gpMessage;
        document.getElementById('bob-content').innerHTML += `
            <button onclick="acceptGP()">Accept</button>
        `;
    }

    const eveGPMessage = `<p class="eve-gp">Alice sends Bob g = ${g}, p = ${p}</p>`;
    const existingEveGP = document.querySelector('#eve-observations .eve-gp');
    if (existingEveGP) {
        existingEveGP.outerHTML = eveGPMessage;
    } else {
        document.getElementById('eve-observations').innerHTML += eveGPMessage;
    }
}

function acceptGP() {
    const acceptMessage = `<p class="accept-message">Bob has accepted g = ${g} and p = ${p}.</p>`;
    const existingAccept = document.querySelector('#alice-inbox .accept-message');
    if (existingAccept) {
        existingAccept.outerHTML = acceptMessage;
    } else {
        document.getElementById('alice-inbox').innerHTML += acceptMessage;
        document.getElementById('alice-content').innerHTML += `
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
}


function calculateA() {
    a = parseInt(document.getElementById('a').value);
    if (isNaN(a)) {
        alert("Please enter a valid integer for Alice's exponent.");
        return;
    }
    A = Math.pow(g, a) % p;
    
    const choiceMessage = `<p class="alice-choice">You chose exponent a = ${a}.</p>`;
    const existingChoice = document.querySelector('#alice-content .alice-choice');
    if (existingChoice) {
        existingChoice.outerHTML = choiceMessage;
    } else {
        document.getElementById('alice-content').innerHTML += choiceMessage;
    }

    if (!document.querySelector('#alice-content .send-a-button')) {
        document.getElementById('alice-content').innerHTML += `
            <button class="send-a-button" onclick="sendAToBob()">Send A to Bob</button>
        `;
    }
}

function calculateB() {
    b = parseInt(document.getElementById('b').value);
    if (isNaN(b)) {
        alert("Please enter a valid integer for Bob's exponent.");
        return;
    }
    B = Math.pow(g, b) % p;

    const choiceMessage = `<p class="bob-choice">You chose exponent b = ${b}.</p>`;
    const existingChoice = document.querySelector('#bob-content .bob-choice');
    if (existingChoice) {
        existingChoice.outerHTML = choiceMessage;
    } else {
        document.getElementById('bob-content').innerHTML += choiceMessage;
    }

    if (!document.querySelector('#bob-content .send-b-button')) {
        document.getElementById('bob-content').innerHTML += `
            <button class="send-b-button" onclick="sendBToAlice()">Send B to Alice</button>
        `;
    }
}

function sendAToBob() {
    const aMessage = `<p class="a-message">From Alice: Here is my A = ${A}.</p>`;
    const existingA = document.querySelector('#bob-inbox .a-message');
    if (existingA) {
        existingA.outerHTML = aMessage;
    } else {
        document.getElementById('bob-inbox').innerHTML += aMessage;
    }

    const eveAMessage = `<p class="eve-a">Alice sends A = ${A}</p>`;
    const existingEveA = document.querySelector('#eve-observations .eve-a');
    if (existingEveA) {
        existingEveA.outerHTML = eveAMessage;
    } else {
        document.getElementById('eve-observations').innerHTML += eveAMessage;
    }

    if (!document.getElementById('bob-calculate-key')) {
        document.getElementById('bob-content').innerHTML += `
            <button id="bob-calculate-key" onclick="calculateBobSecret()">Calculate shared secret key</button>
            <p id="bob-secret"></p>
        `;
    }
}

function sendBToAlice() {
    const bMessage = `<p class="b-message">From Bob: Here is my B = ${B}.</p>`;
    const existingB = document.querySelector('#alice-inbox .b-message');
    if (existingB) {
        existingB.outerHTML = bMessage;
    } else {
        document.getElementById('alice-inbox').innerHTML += bMessage;
    }

    const eveBMessage = `<p class="eve-b">Bob sends B = ${B}</p>`;
    const existingEveB = document.querySelector('#eve-observations .eve-b');
    if (existingEveB) {
        existingEveB.outerHTML = eveBMessage;
    } else {
        document.getElementById('eve-observations').innerHTML += eveBMessage;
    }

    if (!document.getElementById('alice-calculate-key')) {
        document.getElementById('alice-content').innerHTML += `
            <button id="alice-calculate-key" onclick="calculateAliceSecret()">Calculate shared secret key</button>
            <p id="alice-secret"></p>
        `;
    }
}

function calculateAliceSecret() {
    aliceSecret = Math.pow(B, a) % p;
    aliceReady = true;
    document.getElementById('alice-secret').innerText = "Waiting for Bob to calculate...";
    checkKeysMatch();
}

function calculateBobSecret() {
    bobSecret = Math.pow(A, b) % p;
    bobReady = true;
    document.getElementById('bob-secret').innerText = "Waiting for Alice to calculate...";
    checkKeysMatch();
}

function checkKeysMatch() {
    if (aliceReady && bobReady) {
        const matchMessage = (aliceSecret === bobSecret)
            ? "Shared keys match! Secure communication established."
            : "Keys do not match! Something went wrong.";
        
        openModal(matchMessage);
        console.log(`Alice's Secret Key: ${aliceSecret}`);
        console.log(`Bob's Secret Key: ${bobSecret}`);
    }
}



function openModal(message) {
    document.getElementById('modal-message').innerText = message;
    document.getElementById('resultModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
    document.getElementById('modal-body').innerHTML = `
        <p id="modal-message"></p>
        <button id="recapButton" onclick="showRecap()">Recap</button>
    `;
}

function showRecap() {
    document.getElementById('modal-body').innerHTML = `
        <div class="diffie-hellman-explanation">
            <h3>Diffie-Hellman Key Exchange Recap</h3>  
            <p>Diffie-Hellman (DH) is a way for two parties (we called them Alice and Bob) to create a shared secret key over an insecure network.</p>
            
            <ul>
                <li>Both Alice and Bob agree on two public large integers: a <em>prime number</em> p and a <em>base</em> g.</li>
                
                <li>Each party generates a <strong>private key</strong>. Alice's private key is a, and Bob's private key is b.</li>
                
                <li>Using their private keys, each party generates a <strong>public key</strong>:
                    <ul>
                        <li>Alice computes her public key as A = g<sup>a</sup> mod p</li>
                        <li>Bob computes his public key as B = g<sup>b</sup> mod p</li>
                    </ul>
                </li>
                
                <li>They exchange their public keys A and B</li>
                
                <li>Each party then uses their own private key and the other party's public key to calculate the same <strong>shared secret</strong>:
                    <ul>
                        <li>Alice computes s = B<sup>a</sup> mod p</li>
                        <li>Bob computes s = A<sup>b</sup> mod p</li>
                    </ul>
                </li>
            </ul>
            
            <p>This shared secret <strong>s</strong> will be the same for both Alice and Bob, thanks to mathematical properties of modular exponentiation.</p>
        </div>
    `;
}
