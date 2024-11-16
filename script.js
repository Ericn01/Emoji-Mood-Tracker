import MoodEntry from "./MoodEntry.js";

// Local storage retrieval of mood entries
let moodLogs = {}; // empty dictionary for now
if (localStorage.getItem('moodLogs')){ // Assuming that localStorage has been initialized
    moodLogs = JSON.parse(localStorage.getItem('moodLogs'));
} else{
    localStorage.setItem('moodLogs', moodLogs); // Empty case
};

// Retrieving the desired HTML elements
const moodValueSlider = document.querySelector('#mood-value')
const moodValueModal = document.querySelector('#mood-value-modal');
const moodNotes = document.querySelector('#mood-notes');
const moodEmojiSelections = document.querySelectorAll('.mood-select');
const warningMessage = document.querySelector('.warning-message');
const moodEntryLogs = doucment.querySelector('.mood-entry-logs');
const submitBtn = document.querySelector('#mood-submit-btn');

const selectedMoodValues = {
    emojiMood: '',
    moodScalar: parseFloat(moodValueSlider.value),
    moodNote: '',
};

const updateHTMLSelection = () => {

};

const updateMoodEmoji = (event) => {
    const emojiValue = event.target.id; // Name of the emoji
    const emojiText = event.target.textContent; // The actual emoji
    // Change the background color of the element to know it's selected
    moodEmojiSelections.forEach( (emojiSelection) => {
        if (emojiSelection.id !== emojiValue){
            emojiSelection.style.backgroundColor = '#FAF6E3';
        } else{
            event.target.style.backgroundColor = 'lightgreen';
        }
    })
    // Update the emoji mood
    selectedMoodValues['emojiMood'] = [emojiValue, emojiText];
};

// Add an event listener for clicks on mood emojis 
moodEmojiSelections.forEach( (moodEmoji) => {
    moodEmoji.addEventListener('click', updateMoodEmoji);
});


// Event listener for mood value
moodValueSlider.addEventListener('input', (event) => {
    // Update the mood scalar value
    const moodScalar = parseFloat(event.target.value);
    selectedMoodValues['moodScalar'] = moodScalar;
    // Display the current scale value as a modal
    moodValueModal.textContent = moodScalar;
});

// Event listener for 
moodNotes.addEventListener('input', (event) => {
    selectedMoodValues['moodNote'] = event.target.textContent;
});

submitBtn.addEventListener('click', () => {
    if (len(selectedMoodValues['emojiMood']) > 0 && selectedMoodValues['moodScalar']){
        setTimeout(() => {
            submitBtn.disabled = true;
            warningMessage.className = 'warning-message'; // Removes the hidden part
            warningMessage.textContent = 'Please make sure to select an emoji mood and a mood value!'
        }, 1500);
        warningMessage.className = 'warning-message hidden';
        submitBtn.disabled = false; // return the button to previous functionality
    } else{
        // Create a new mood entry
        const newMoodEntry = new MoodEntry(selectedMoodValues);
        newMoodEntry.saveToLocalStorage(); // Save the new entry to local storage
        // Resets the values.
        Object.values(selectedMoodValues).forEach( moodValue => {
            if (typeof moodValue !== 'number'){
                moodValue = '';
            } else {
                moodValue = 0;
            }
        }); 
    }
});


const renderMoodLogList = () => {
    moodEntryLogs.innerHTML = ''; // Remove the previous content
    localStorage.getItem('')
}