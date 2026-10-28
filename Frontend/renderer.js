async function testPythonConnection() {
    try {
        const response = await fetch("http://127.0.0.1:8000/test");
        const data = await response.json();

        console.log(data.message);
    } catch (error) {
        console.error("Python connection failed:", error);
    }
}

testPythonConnection();



let shuffleEnabled = false;

async function setShuffle(enabled) {
    console.log("Sending to Python:", enabled);

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/player/shuffle",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ enabled })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        console.log("Python response:", await response.json());
    } catch (error) {
        console.error("Failed to set shuffle:", error);
    }
}

document.getElementById("shuffle-button").addEventListener("click", () => {
    shuffleEnabled = !shuffleEnabled;
    console.log("New shuffle state:", shuffleEnabled);
    setShuffle(shuffleEnabled);
});


// Handles the click event for the shuffle button 
