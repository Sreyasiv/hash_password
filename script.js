const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// Store data in local storage
const store = (key, value) => localStorage.setItem(key, value);

// Retrieve data from local storage
const retrieve = (key) => localStorage.getItem(key);

// Generate a random 3-digit number
const getRandomNumber = () => Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

// Generate SHA256 hash of a given string
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

// Get or generate the SHA256 hash
async function getSHA256Hash() {
    let cached = retrieve('sha256');
    if (!cached) {
        const randomNum = getRandomNumber().toString();
        cached = await sha256(randomNum);
        store('sha256', cached);
    }
    return cached;
}

// Display the hash on page load
async function main() {
    sha256HashView.textContent = "Generating...";
    const hash = await getSHA256Hash();
    sha256HashView.textContent = hash;
}

// Check if user input matches the hash
async function test() {
    const pin = pinInput.value.trim();

    if (pin.length !== 3 || isNaN(pin)) {
        resultView.textContent = "💡 Enter a valid 3-digit number!";
        resultView.className = "fail";
        resultView.style.display = "block";
        return;
    }

    const hashedPin = await sha256(pin);
    const storedHash = sha256HashView.textContent;

    if (hashedPin === storedHash) {
        resultView.textContent = "🎉 Success! You found the number!";
        resultView.className = "success";
    } else {
        resultView.textContent = "❌ Incorrect! Try again.";
        resultView.className = "fail";
    }
    resultView.style.display = "block";
}

// Allow only numeric input
pinInput.addEventListener('input', (e) => {
    pinInput.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Attach test function to button click
document.getElementById('check').addEventListener('click', test);

main();
