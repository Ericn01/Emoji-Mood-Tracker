import { MoodLogController } from "./MoodClasses.js";
import { MoodValueSlider } from "./MoodValueSlider.js";
import { MoodTrendsChart } from "./MoodCharts.js";
import { generateTestMoodEntries } from "./test/testingEntries.js";
import { renderCalendarMonth, getMonthCalendarData } from "./Calendar.js";

// Initialize elements
const moodEmojiSelections = document.querySelectorAll('.mood-select');
const moodEntryLogs = document.querySelector('.mood-entry-logs');
const warningMessage = document.querySelector('.warning-message');
const submitBtn = document.querySelector('#mood-submit-btn');
const moodEmojiList = document.querySelectorAll('.mood-select');
const moodValueSlider = document.querySelector('#mood-value');
// Month Calendar HTML element
const monthContainer = document.querySelector('.calendar-container');
// Retrieving the chart canvas
const trendsChartCanvas = document.querySelector("#mood-value-trend-chart");

// Controllers
const moodLogController = new MoodLogController(moodEntryLogs, moodEmojiSelections); // Controller for mood log + filtering section.
new MoodValueSlider(document.querySelector('#slider-container'), moodValueSlider); // Controller for the mood value slider.

// Generating the trends chart.
const testEntries = moodLogController.loadUserDefinedEntries(generateTestMoodEntries(75)); // Generating 75 random entries 
const trendsChart = new MoodTrendsChart(trendsChartCanvas);

// Initialize the charts
trendsChart.initialize(testEntries)
trendsChart.render(); // render the trends chart

// Create the calendar
const currentDate = new Date();
const monthCalendarData = getMonthCalendarData(currentDate, testEntries);
monthContainer.appendChild(renderCalendarMonth(monthCalendarData, currentDate));

// Adding event listener to the period change buttons
const periodButtons = document.querySelectorAll('.period-btn');
periodButtons.forEach( (periodBtn) => {
    periodBtn.addEventListener('click', (event) => {
        // Update active button state
        periodButtons.forEach(btn => btn.classList.remove('active')); // Remove the active state from all buttons.
        event.target.classList.add('active'); // Add the active class to the button that was clicked.

        const newPeriod = event.target.dataset.period; // making use of the 'data' HTML attribute
        trendsChart.updatePeriod(newPeriod);
    });
});

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

selectMoodEmoji(); // Changes the mood emoji selection
// Initial render
setupMoodLogFilterControls()
moodLogController.render();