"use strict";

/* =========================
   Defaults and settings
   ========================= */
const DEFAULT_SHORTCUTS = {
    playPause: "Space",
    previous: "ArrowLeft",
    next: "ArrowRight",
    shuffle: "s",
    repeat: "r",
};

const DEFAULT_SETTINGS = {
    theme: "midnight",
    showShuffle: true,
    showRepeat: true,
    shortcuts: { ...DEFAULT_SHORTCUTS },
};

const STORAGE_KEY = "spotify-widget-settings";
const validThemes = ["midnight", "purple", "ocean", "rose"];

const actionLabels = {
    playPause: "Play / pause",
    previous: "Previous track",
    next: "Next track",
    shuffle: "Toggle shuffle",
    repeat: "Toggle repeat",
};

function loadSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!saved || typeof saved !== "object") {
            return structuredClone(DEFAULT_SETTINGS);
        }

        const loaded = {
            ...DEFAULT_SETTINGS,
            ...saved,
            shortcuts: {
                ...DEFAULT_SHORTCUTS,
                ...(saved.shortcuts || {}),
            },
        };

        if (!validThemes.includes(loaded.theme)) {
            loaded.theme = DEFAULT_SETTINGS.theme;
        }

        loaded.showShuffle = loaded.showShuffle !== false;
        loaded.showRepeat = loaded.showRepeat !== false;

        for (const action of Object.keys(DEFAULT_SHORTCUTS)) {
            const key = loaded.shortcuts[action];
            if (
                typeof key !== "string" ||
                !key ||
                key.length > 30 ||
                key.startsWith("Control+") ||
                key.startsWith("Alt+") ||
                key.startsWith("Shift+") ||
                key.startsWith("Meta+")
            ) {
                loaded.shortcuts[action] = DEFAULT_SHORTCUTS[action];
            }
        }

        return loaded;
    } catch (error) {
        console.warn("Could not load settings:", error);
        return structuredClone(DEFAULT_SETTINGS);
    }
}

let settings = loadSettings();

function saveSettings() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
        console.warn("Could not save settings:", error);
    }
}

/* =========================
   Theme
   ========================= */
const themeSelect = document.getElementById("theme-select");
const settingsThemeSelect = document.getElementById("settings-theme-select");

function applyTheme(theme) {
    if (!validThemes.includes(theme)) {
        theme = DEFAULT_SETTINGS.theme;
    }

    settings.theme = theme;
    document.documentElement.dataset.theme = theme;
    themeSelect.value = theme;
    settingsThemeSelect.value = theme;
    saveSettings();
}

themeSelect.addEventListener("change", () => applyTheme(themeSelect.value));
settingsThemeSelect.addEventListener("change", () => applyTheme(settingsThemeSelect.value));

/* =========================
   Settings panel
   ========================= */
const settingsPanel = document.getElementById("settings-panel");

document.getElementById("settings-button").addEventListener("click", () => {
    settingsPanel.hidden = !settingsPanel.hidden;
});

document.getElementById("close-settings-button").addEventListener("click", () => {
    settingsPanel.hidden = true;
});

/* =========================
   Show / hide playback buttons
   ========================= */
const shuffleButton = document.getElementById("shuffle-button");
const repeatButton = document.getElementById("repeat-button");
const showShuffleCheckbox = document.getElementById("show-shuffle");
const showRepeatCheckbox = document.getElementById("show-repeat");

function applyVisibilitySettings() {
    shuffleButton.hidden = !settings.showShuffle;
    repeatButton.hidden = !settings.showRepeat;
    showShuffleCheckbox.checked = settings.showShuffle;
    showRepeatCheckbox.checked = settings.showRepeat;
}

showShuffleCheckbox.addEventListener("change", () => {
    settings.showShuffle = showShuffleCheckbox.checked;
    applyVisibilitySettings();
    saveSettings();
});

showRepeatCheckbox.addEventListener("change", () => {
    settings.showRepeat = showRepeatCheckbox.checked;
    applyVisibilitySettings();
    saveSettings();
});

/* =========================
   Keyboard shortcut settings
   ========================= */
const shortcutButtons = document.querySelectorAll(".shortcut-key");
const shortcutStatus = document.getElementById("shortcut-status");
let listeningForShortcut = null;

function displayKey(key) {
    const names = {
        Space: "Space",
        ArrowLeft: "←",
        ArrowRight: "→",
        ArrowUp: "↑",
        ArrowDown: "↓",
        Escape: "Esc",
        Enter: "Enter",
        Backspace: "Backspace",
        Delete: "Delete",
        Tab: "Tab",
    };

    if (names[key]) return names[key];
    return key.length === 1 ? key.toUpperCase() : key;
}

function updateShortcutLabels() {
    shortcutButtons.forEach((button) => {
        const action = button.dataset.action;
        button.textContent = displayKey(settings.shortcuts[action]);
        button.classList.remove("listening");
    });
}

function stopListening(message) {
    listeningForShortcut = null;
    updateShortcutLabels();
    shortcutStatus.textContent = message;
}

shortcutButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (listeningForShortcut) {
            stopListening("Shortcut assignment cancelled.");
        }

        listeningForShortcut = button.dataset.action;
        button.classList.add("listening");
        button.textContent = "Press key...";
        shortcutStatus.textContent =
            `Press a key for ${actionLabels[listeningForShortcut]}. Press Escape to cancel.`;
    });
});

function findShortcutConflict(key, currentAction) {
    return Object.keys(settings.shortcuts).find((action) => {
        return action !== currentAction &&
            settings.shortcuts[action].toLowerCase() === key.toLowerCase();
    });
}

function normalizeKey(event) {
    if (event.code === "Space") return "Space";
    if (/^Key[A-Z]$/.test(event.code)) return event.key.toLowerCase();
    if (/^Digit[0-9]$/.test(event.code)) return event.key;
    return event.key;
}

document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isEditing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target.isContentEditable;

    if (listeningForShortcut) {
        event.preventDefault();
        event.stopPropagation();

        if (event.key === "Escape") {
            stopListening("Shortcut assignment cancelled.");
            return;
        }

        if (
            event.ctrlKey || event.altKey || event.metaKey ||
            event.key === "Shift" || event.key === "Control" || event.key === "Alt"
        ) {
            shortcutStatus.textContent = "Choose a single key without Ctrl, Alt, or Shift.";
            return;
        }

        if (isEditing) return;

        const key = normalizeKey(event);
        const action = listeningForShortcut;
        const conflict = findShortcutConflict(key, action);

        if (conflict) {
            shortcutStatus.textContent =
                `${displayKey(key)} is already assigned to ${actionLabels[conflict]}. Choose another key.`;
            return;
        }

        settings.shortcuts[action] = key;
        saveSettings();
        stopListening(`${actionLabels[action]} assigned to ${displayKey(key)}.`);
        return;
    }

    // Do not trigger shortcuts while typing, using controls, or holding modifiers.
    if (isEditing || event.repeat || event.ctrlKey || event.altKey || event.metaKey) {
        return;
    }

    const key = normalizeKey(event);
    const action = Object.keys(settings.shortcuts).find((name) => {
        return settings.shortcuts[name].toLowerCase() === key.toLowerCase();
    });

    if (!action) return;

    event.preventDefault();
    performAction(action);
});

document.getElementById("reset-shortcuts-button").addEventListener("click", () => {
    settings.shortcuts = { ...DEFAULT_SHORTCUTS };
    saveSettings();
    stopListening("Keyboard shortcuts reset to defaults.");
});

/* =========================
   Demo playback controls
   Replace these functions with API calls later.
   ========================= */
const playPauseButton = document.getElementById("play-pause-button");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");

let isPlaying = false;
let isShuffleEnabled = false;
let repeatMode = 0; // 0 = off, 1 = repeat all, 2 = repeat one

function togglePlayPause() {
    isPlaying = !isPlaying;
    playPauseButton.textContent = isPlaying ? "Ⅱ" : "▶";
    playPauseButton.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
    playPauseButton.title = isPlaying ? "Pause" : "Play";
}

function toggleShuffle() {
    isShuffleEnabled = !isShuffleEnabled;
    shuffleButton.classList.toggle("active", isShuffleEnabled);
    shuffleButton.setAttribute("aria-pressed", String(isShuffleEnabled));
}

function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    repeatButton.classList.toggle("active", repeatMode !== 0);
    repeatButton.textContent = repeatMode === 2 ? "↻¹" : "↻";

    const labels = ["Repeat off", "Repeat all", "Repeat one"];
    repeatButton.title = labels[repeatMode];
    repeatButton.setAttribute("aria-label", labels[repeatMode]);
    repeatButton.setAttribute("aria-pressed", String(repeatMode !== 0));
}

function previousTrack() {
    console.log("Previous track requested (demo mode)");
}

function nextTrack() {
    console.log("Next track requested (demo mode)");
}

function performAction(action) {
    switch (action) {
        case "playPause": togglePlayPause(); break;
        case "previous": previousTrack(); break;
        case "next": nextTrack(); break;
        case "shuffle": toggleShuffle(); break;
        case "repeat": toggleRepeat(); break;
    }
}

playPauseButton.addEventListener("click", () => performAction("playPause"));
previousButton.addEventListener("click", () => performAction("previous"));
nextButton.addEventListener("click", () => performAction("next"));
shuffleButton.addEventListener("click", () => performAction("shuffle"));
repeatButton.addEventListener("click", () => performAction("repeat"));

/* =========================
   Queue / lyrics tabs
   ========================= */
const tabButtons = document.querySelectorAll(".tab-button");
const panels = document.querySelectorAll(".content-panel");

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const targetPanel = button.dataset.panel;

        panels.forEach((panel) => {
            panel.hidden = panel.id !== targetPanel;
        });

        tabButtons.forEach((tab) => {
            const selected = tab === button;
            tab.classList.toggle("active", selected);
            tab.setAttribute("aria-selected", String(selected));
        });
    });
});

/* =========================
   Demo progress bar and time labels
   ========================= */
const progressBar = document.getElementById("progress-bar");
const currentTimeLabel = document.getElementById("current-time");
const durationLabel = document.getElementById("duration");

const demoDurationSeconds = 222; // 3:42

function formatTime(totalSeconds) {
    const safeSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function updateDemoProgress() {
    const currentSeconds = demoDurationSeconds * (Number(progressBar.value) / 100);
    currentTimeLabel.textContent = formatTime(currentSeconds);
    durationLabel.textContent = formatTime(demoDurationSeconds);
}

progressBar.addEventListener("input", updateDemoProgress);

/* =========================
   Initialize
   ========================= */
applyTheme(settings.theme);
applyVisibilitySettings();
updateShortcutLabels();
updateDemoProgress();




// EX BUTTON

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