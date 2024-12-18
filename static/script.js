// script.js
let g, p, a, b, A, B, aliceSecret, bobSecret;
let aliceReady = false, bobReady = false;
let sharedSecret = null;

function removeAllPulseClasses(containerId) {
    const container = document.getElementById(containerId);
    const pulseElements = container.querySelectorAll('.pulse, .eve-pulse');
    pulseElements.forEach(element => {
        element.classList.remove('pulse', 'eve-pulse');
    });
}

function sendToBob() {
    g = parseInt(document.getElementById('g').value);
    p = parseInt(document.getElementById('p').value);
    if (isNaN(g) || isNaN(p) || g <= 0 || p <= 0) {
        alert("g and p must be positive integers");
        return;
    }
    removeAllPulseClasses('bob-inbox');
    removeAllPulseClasses('eve-observations');

    if (!isPrime(p)) {
        alert("p must be a prime number!");
        return;
    }

    const gpMessage = `<p class="gp-message pulse">From Alice: Hey Bob, let's use g = ${g} and p = ${p}.</p>`;
    const existingGP = document.querySelector('#bob-inbox .gp-message');
    if (existingGP) {
        existingGP.outerHTML = gpMessage;
    } else {
        document.getElementById('bob-inbox').innerHTML += gpMessage;
        document.getElementById('bob-content').innerHTML += `
            <button onclick="acceptGP()">Accept</button>
        `;
    }

    const eveGPMessage = `<p class="eve-gp eve-pulse">Alice sends Bob g = ${g}, p = ${p}</p>`;
    const existingEveGP = document.querySelector('#eve-observations .eve-gp');
    if (existingEveGP) {
        existingEveGP.outerHTML = eveGPMessage;
    } else {
        document.getElementById('eve-observations').innerHTML += eveGPMessage;
    }
    loadSavedInput();
}

function acceptGP() {
    removeAllPulseClasses('alice-inbox');
    removeAllPulseClasses('eve-observations');

    const acceptMessage = `<p class="accept-message pulse">Bob has accepted g = ${g} and p = ${p}.</p>`;
    const existingAccept = document.querySelector('#alice-inbox .accept-message');
    const existingEveGPAccept = document.querySelector('#eve-observations .eve-gp-accept');
    const eveGPAcceptMessage = `<p class="eve-gp-accept eve-pulse">Bob has accepted g = ${g}, p = ${p}</p>`;
    
    if (existingAccept) {
        existingAccept.outerHTML = acceptMessage;
        existingEveGPAccept.outerHTML = eveGPAcceptMessage;
    } else {
        document.getElementById('alice-inbox').innerHTML += acceptMessage;
        document.getElementById('alice-content').innerHTML += `
            <p>Choose an exponent a:</p>
            <div class="form_group">
                <label for="g">a&nbsp=</label>
                <input type="number" id="a" placeholder="Alice's exponent a">
            </div>
            <button onclick="calculateA()">Calculate A</button>
        `;        
        document.getElementById('eve-observations').innerHTML += eveGPAcceptMessage;
        document.getElementById('bob-content').innerHTML += `
            <p>Choose an exponent b:</p>
            <div class="form_group">
                <label for="b">b&nbsp=</label>
                <input type="number" id="b" placeholder="Bob's exponent b">
            </div>
            <button onclick="calculateB()">Calculate B</button>
        `;
    }
    loadSavedInput();
}

function calculateA() {
    a = parseInt(document.getElementById('a').value);
    if (isNaN(a) || a >= p) {
        alert("Please enter a valid integer for Alice's exponent.\nRemember, a must be less than p.");
        return;
    }
    A = (BigInt(g)**BigInt(a)) % BigInt(p);
    const choiceMessage = `
        <p class="alice-choice">
            You chose exponent a = ${a}.<br>
            A = g<sup>a</sup> % p, therefore<br>
            A = ${g}<sup>${a}</sup> % ${p} = ${A}
        </p>`;
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
    loadSavedInput();
}

function calculateB() {
    b = parseInt(document.getElementById('b').value);
    if (isNaN(b) || b >= p) {
        alert("Please enter a valid integer for Bob's exponent.\nRemember, b must be less than p.");
        return;
    }

    B = (BigInt(g)**BigInt(b)) % BigInt(p);

    const choiceMessage = `
        <p class="bob-choice">
            You chose exponent b = ${b}.<br>
            B = g<sup>b</sup> % p, therefore<br>
            B = ${g}<sup>${b}</sup> % ${p} = ${B}
        </p>`;
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
    loadSavedInput();
}

function sendAToBob() {
    removeAllPulseClasses('bob-inbox');
    removeAllPulseClasses('eve-observations');

    const aMessage = `<p class="a-message pulse">From Alice: Here is my A = ${A}.</p>`;
    const existingA = document.querySelector('#bob-inbox .a-message');
    if (existingA) {
        existingA.outerHTML = aMessage;
    } else {
        document.getElementById('bob-inbox').innerHTML += aMessage;
    }

    const eveAMessage = `<p class="eve-a eve-pulse">Alice sends A = ${A}</p>`;
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
    loadSavedInput();
}

function sendBToAlice() {
    removeAllPulseClasses('alice-inbox');
    removeAllPulseClasses('eve-observations');

    const bMessage = `<p class="b-message pulse">From Bob: Here is my B = ${B}.</p>`;
    const existingB = document.querySelector('#alice-inbox .b-message');
    if (existingB) {
        existingB.outerHTML = bMessage;
    } else {
        document.getElementById('alice-inbox').innerHTML += bMessage;
    }

    const eveBMessage = `<p class="eve-b eve-pulse">Bob sends B = ${B}</p>`;
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
    loadSavedInput();
}

function calculateAliceSecret() {
    aliceSecret = (BigInt(B)**BigInt(a)) % BigInt(p);
    aliceReady = true;
    document.getElementById('alice-secret').innerText = "Waiting for Bob to calculate...";
    checkKeysMatch();
}

function calculateBobSecret() {
    bobSecret = (BigInt(A)**BigInt(b)) % BigInt(p);
    bobReady = true;
    document.getElementById('bob-secret').innerText = "Waiting for Alice to calculate...";
    checkKeysMatch();
}

function checkKeysMatch() {
    if (aliceReady && bobReady) {
        const keysMatch = aliceSecret === bobSecret;
        sharedSecret = Number(aliceSecret); 
        
        const matchMessage = keysMatch
            ? "Shared secret keys match!"
            : "Keys do not match! Something went wrong.";
        
        openModal(matchMessage, keysMatch);
    }
}

function openModal(message, keysMatch = false) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <p id="modal-message">${message}</p>
        ${keysMatch ? `
        <div class="modal-buttons">
            <button class="transform-button" onclick="transformSharedKey()">Generate AES key</button>
        </div>
        ` : ''}
    `;

    document.getElementById('resultModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
    document.getElementById('modal-body').innerHTML = `
        <p id="modal-message"></p>
    `;
}

function showRecap() {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="diffie-hellman-explanation">
            <h3>Diffie-Hellman Key Exchange Recap</h3>  
            <p>Diffie-Hellman (DH) is a way for two parties (we called them Alice and Bob) to create a shared secret key over an insecure network.</p>
            
            <ul>
                <li>Both Alice and Bob agree on two public large integers: a <em>prime number</em> p and a <em>base</em> g.</li>
                
                <li>Each party generates a <strong>secret number</strong>. Alice's secret number is "a", and Bob's number is "b".</li>
                
                <li>Using their secret numbers, each party generates a <strong>public number</strong>:
                    <ul>
                        <li>Alice computes her public number as A = g<sup>a</sup> mod p</li>
                        <li>Bob computes his public number as B = g<sup>b</sup> mod p</li>
                    </ul>
                </li>
                
                <li>They exchange their public numbers A and B</li>
                
                <li>Each party then uses their own secret number and the other party's public number to calculate the same <strong>shared secret</strong>:
                    <ul>
                        <li>Alice computes s = B<sup>a</sup> mod p</li>
                        <li>Bob computes s = A<sup>b</sup> mod p</li>
                    </ul>
                </li>
            </ul>
            
            <p>This shared secret <strong>s</strong> will be the same for both Alice and Bob, thanks to mathematical properties of modular exponentiation.</p>
            <p class="note">Even if eavesdropper, Eve, observes the communication and sees the values of the public numbers <em>A = g<sup>a</sup> mod p</em> and <em>B = g<sup>b</sup> mod p</em>, she still cannot calculate the shared secret <em>s</em> without knowing the private numbers <em>a</em> and <em>b</em>. This is because of the difficulty of the <strong>discrete logarithm problem</strong>.</p>
            <p class="note">In the Diffie-Hellman key exchange, while it is easy to compute <em>A</em> and <em>B</em> from <em>a</em> and <em>b</em> using modular exponentiation, it is extremely hard (for sufficiently large values of <em>p</em>) to reverse this process — that is, to calculate <em>a</em> from <em>A = g<sup>a</sup> mod p</em> or <em>b</em> from <em>B = g<sup>b</sup> mod p</em>. 
            Without access to either <em>a</em> or <em>b</em>, Eve has no way of obtaining the shared secret <em>s = g<sup>ab</sup> mod p</em>.</p>
        </div>
    `;
    
    document.getElementById('resultModal').style.display = 'block';
}

function restoreModalContent() {
    const keysMatch = aliceSecret === bobSecret;
    const matchMessage = keysMatch
        ? "Shared secret keys match!"
        : "Keys do not match! Something went wrong.";
    openModal(matchMessage, keysMatch);
}

async function transformSharedKey() {
    if (!sharedSecret) {
        console.error("No shared secret available");
        return;
    }

    try {
        const response = await fetch('/transform_to_aes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ shared_secret: sharedSecret })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.aes_key) {
            throw new Error("No AES key in response");
        }

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="aes-key-explanation">
                <h3>AES key generation</h3>
                <div class="key-display">
                    <strong>Original shared secret:</strong> ${sharedSecret}
                </div>
                <div class="key-display">
                    <strong>Generated AES key:</strong> ${result.aes_key}
                </div>
                <p>Once Alice and Bob calculated their shared secret, it was transformed into an AES-compatible key:</p>
                <ul>
                    <li><strong>Step 1:</strong> Use the shared secret key from Diffie-Hellman (s = ${sharedSecret})</li>
                    <li><strong>Step 2:</strong> Hash the shared key using SHA-256 to create a 256-bit key for AES</li>
                    <li><strong>Step 3:</strong> Convert the hashed value to hexadecimal format for display</li>
                </ul>
                <p>This AES-256 key can now be used for secure symmetric encryption between Alice and Bob.</p>
                <p class="note">The shared secret s generated from Diffie-Hellman is just a number. AES, however, requires a specific bit length for its key (like 128, 192, or 256 bits).</p>
                <p class="note">To turn s into a usable AES key, it is typically hashed to create a fixed-length key. Hashing takes an input of any size and transforms it into a fixed-size output.</p>
                <p class="note">For demonstration, we sent back the AES key in hexadecimal form</p>
            </div>
            <button class="back-button" onclick="restoreModalContent()">Back</button>
        `;
    } catch (error) {
        console.error("Error:", error);
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="error-message">
                <h3>Error Generating AES Key</h3>
                <p>There was an error generating the AES key: ${error.message}</p>
                <p>Please try again later.</p>
            </div>
            <button class="back-button" onclick="restoreModalContent()">Back</button>
        `;
    }
}

function loadSavedInput() {
    document.getElementById("g").value = g;
    document.getElementById("p").value = p;
    document.getElementById("a").value = a;
    document.getElementById("b").value = b;
}

function isPrime(num) {
    if (num < 2) return false;
  
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i == 0) {
        return false;
      }
    }
    return true;
  }
