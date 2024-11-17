import { MoodLogController } from "./MoodClasses.js";

// Initialize elements
const moodEmojiSelections = document.querySelectorAll('.mood-select');
const moodEntryLogs = document.querySelector('.mood-entry-logs');
const moodLogController = new MoodLogController(moodEntryLogs, moodEmojiSelections); // Controller for mood log stuff

// Set up filter controls
const setupMoodLogFilterControls = () => {
    const dateFilter = document.querySelector('#date-filter');
    dateFilter.addEventListener('change', (event) => {
        moodLogController.handleSetFilter('dateRange', event.target.value);
    });

    const moodRangeFilter = document.querySelector('#mood-range-filter');
    moodRangeFilter.addEventListener('input', (event) => {
    const [min, max] = event.target.value.split(',');
        moodLogController.handleSetFilter('moodValueRange', { 
            min: parseFloat(min), 
            max: parseFloat(max) 
        });
    });

    const emojiFilter = document.querySelector('#emoji-filter');
    emojiFilter.addEventListener('change', (event) => {
        const selectedEmojis = Array.from(event.target.selectedOptions)
            .map(option => option.value);
    moodLogController.handleSetFilter('selectedEmojis', selectedEmojis);
    });
}

// Retrieving the desired HTML elements
const warningMessage = document.querySelector('.warning-message');
const submitBtn = document.querySelector('#mood-submit-btn');
const moodEmojiList = document.querySelectorAll('.mood-select');
const moodValueSlider = document.querySelector('#mood-value')
// Adding an event listener to the new mood entry button 
submitBtn.addEventListener('click', () => {
    const moodSliderValue = parseFloat(moodValueSlider.value);
    const selectedEmoji  = Array.from(moodEmojiList).find(emoji => emoji.classList.contains('selected'));
    const notesInput = document.querySelector('#mood-notes'); 

    if (!selectedEmoji && moodSliderValue){
        submitBtn.disabled = true;
        warningMessage.className = 'warning-message error'; // Removes the hidden part
        warningMessage.textContent = 'Please make sure to select an emoji mood and a mood value!'
        setTimeout(() => {
            warningMessage.className = 'warning-message hidden';
            submitBtn.disabled = false; // return the button to previous functionality
        }, 1500);
    } else{
        // Add a new mood entry
        const newMoodEntryData = {
            entryEmojiMood: [selectedEmoji.id, selectedEmoji.textContent],
            entryMoodValue: moodSliderValue,
            entryNotes: notesInput ? notesInput.value : '', 
        };

        console.log(newMoodEntryData)
        moodLogController.createNewEntry(newMoodEntryData);

        // Reset the form
        resetFormValues(selectedEmoji, notesInput);
    }
});

const resetFormValues = (selectedEmoji, notesInput) => {
    selectedEmoji.classList.remove('selected');
    moodValueSlider.value = 5; // Resetting the value to the middle
    if (notesInput){
        notesInput.value = '';
    }

    warningMessage.className = 'warning-message success';
        warningMessage.textContent = 'Mood entry added successfully!';
        setTimeout(() => {
            warningMessage.className = 'warning-message hidden';
        }, 1500);
}

// Logic for the selection of a mood emoji
const selectMoodEmoji = () => {
    moodEmojiList.forEach( (elem) => {
        elem.addEventListener('click', (event) => {
            const moodID = event.target.id;
            event.target.classList.add('selected')
            for (const moodEmoji of moodEmojiList){
                if (moodEmoji.id !== moodID){
                    moodEmoji.classList.remove('selected'); 
                }
            }
        });
    });
}


selectMoodEmoji();
// Initial render
setupMoodLogFilterControls()
moodLogController.render();