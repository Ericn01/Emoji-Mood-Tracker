import MoodEntry from "./MoodEntry";

// Local storage retrieval of mood entries


const selectedMoodValues = {
    emojiMood: [],
    moodScalar: 0,
    moodNote: '',
};

const updateMoodEmoji = (event) => {
    const emojiValue = event.target.id; // Name of the emoji
    const emojiText = event.target.textContent; // The actual emoji
    // Update the emoji mood
    selectedMoodValues['emojiMood'] = [emojiValue, emojiText];
};

// Add an event listener for clicks on mood emojis 
document.querySelectorAll('.mood-select').forEach( (moodEmoji) => {
    moodEmoji.addEventListener('click', updateMoodEmoji);
});

// Event listener for mood value
document.querySelector('#mood-value').addEventListener('input', (event) => {
    selectedMoodValues['moodScalar'] = parseInt(event.target.value);
});

// Event listener for 
document.querySelector('#mood-notes').addEventListener('input', (event) => {
    selectedMoodValues['moodNote'] = event.target.textContent;
});

document.querySelector('#mood-submit-btn').addEventListener('click', () => {

})
