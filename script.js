import MoodEntry from "./MoodEntry.js";
import { getMoodRatingColor } from "./colorMapping.js";

// Local storage retrieval of mood entries
let moodLogs = {}; // empty dictionary for now
if (localStorage.getItem('moodLogs')){ // Assuming that localStorage has been initialized
    moodLogs = JSON.parse(localStorage.getItem('moodLogs'));
} else{
    localStorage.setItem('moodLogs', JSON.stringify(moodLogs)); // Empty case
};

// Retrieving the desired HTML elements
const moodValueSlider = document.querySelector('#mood-value')
const moodValueModal = document.querySelector('#mood-value-modal');
const moodNotes = document.querySelector('#mood-notes');
const moodEmojiSelections = document.querySelectorAll('.mood-select');
const warningMessage = document.querySelector('.warning-message');
const moodEntryLogs = document.querySelector('.mood-entry-logs');
const submitBtn = document.querySelector('#mood-submit-btn');

const selectedMoodValues = {
    emojiMood: '',
    moodScalar: parseFloat(moodValueSlider.value),
    moodNote: moodNotes.value,
};

const updateHTMLSelection = () => {

};

const updateMoodEmoji = (event) => {
    const emojiValue = event.target.id; // Name of the emoji
    const emojiText = event.target.textContent; // The actual emoji
    // Change the background color of the element to know it's selected
    moodEmojiSelections.forEach( (emojiSelection) => {
        emojiSelection.classList.remove('selected');
    });
    // Adding the selected class to the clicked emoji
    event.target.classList.add('selected');
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
    selectedMoodValues['moodNote'] = event.target.value;
});

submitBtn.addEventListener('click', () => {
    if (selectedMoodValues['emojiMood'].length === 0 && selectedMoodValues['moodScalar']){
            submitBtn.disabled = true;
            warningMessage.className = 'warning-message'; // Removes the hidden part
            warningMessage.textContent = 'Please make sure to select an emoji mood and a mood value!'
        setTimeout(() => {
            warningMessage.className = 'warning-message hidden';
            submitBtn.disabled = false; // return the button to previous functionality
        }, 1500);
    } else{
        // Create a new mood entry
        new MoodEntry(selectedMoodValues);
        moodLogs = JSON.parse(localStorage.getItem('moodLogs')); // Update the value of moodLogs 
        renderMoodLogList(); // Render the list of items
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
    const moodEntryLogs = document.querySelector('.mood-entry-logs');
    moodEntryLogs.innerHTML = '';
    
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs'));
    
    if (Object.keys(moodLogs).length === 0) {
      moodEntryLogs.innerHTML = `
        <div class="empty-state">
          No mood entries yet. Start tracking your mood!
        </div>
      `;
      return;
    }
  
    const sortedEntries = Object.entries(moodLogs).sort((a, b) => {
      return new Date(b[1].entryDate) - new Date(a[1].entryDate);
    });
  
    sortedEntries.forEach(([id, entry]) => {      
      const logItem = document.createElement('div');
      logItem.className = 'log-item';
      logItem.setAttribute('data-entry-id', id);
      logItem.setAttribute('data-mood', entry.entryMoodEmoji[0])
      
      logItem.innerHTML = `
        <span class="log-date">${entry.entryDate}</span>
        <span class="log-emoji">${entry.entryMoodEmoji[1]}</span>
        <span class="log-mood-value">${entry.entryMoodValue.toFixed(1)}</span>
        <span class="log-note">${entry.entryMoodNotes || 'No note'}</span>
        
        <form class="edit-form">
          <select class="edit-emoji" required>
            ${Array.from(moodEmojiSelections).map(emoji => `
              <option value="${emoji.id},${emoji.textContent}" 
                ${entry.entryMoodEmoji[0] === emoji.id ? 'selected' : ''}>
                ${emoji.textContent}
              </option>
            `).join('')}
          </select>
          <input type="number" 
            class="edit-mood-value" 
            min="0" 
            max="10" 
            step="0.1" 
            value="${entry.entryMoodValue}" 
            required
          >
          <input type="text" 
            class="edit-note" 
            value="${entry.entryMoodNotes || ''}" 
            placeholder="Add a note..."
          >
        </form>
  
        <div class="edit-controls">
          <button class="edit-btn">Edit</button>
          <button class="save-btn" style="display: none;">Save</button>
          <button class="cancel-btn" style="display: none;">Cancel</button>
        </div>
      `;
      
      moodEntryLogs.appendChild(logItem);
                
      // Change the background color of the entry mood value 
      const logMoodValue = document.querySelector('.log-mood-value');
      logMoodValue.style.backgroundColor = getMoodRatingColor(entry.entryMoodValue);

      // Add event listeners for edit controls
      const editBtn = logItem.querySelector('.edit-btn');
      const saveBtn = logItem.querySelector('.save-btn');
      const cancelBtn = logItem.querySelector('.cancel-btn');
      const editForm = logItem.querySelector('.edit-form');
  
      editBtn.addEventListener('click', () => {
        logItem.classList.add('editing');
        editBtn.style.display = 'none';
        saveBtn.style.display = 'block';
        cancelBtn.style.display = 'block';
      });
  
      saveBtn.addEventListener('click', async () => {
        const emojiSelect = editForm.querySelector('.edit-emoji');
        const moodValue = editForm.querySelector('.edit-mood-value');
        const noteInput = editForm.querySelector('.edit-note');
  
        const [emojiId, emojiText] = emojiSelect.value.split(',');
        
        // Update with the correct property names
        const updatedValues = {
          entryMoodEmoji: [emojiId, emojiText],
          entryMoodValue: parseFloat(moodValue.value),
          entryMoodNotes: noteInput.value
        };
  
        // Get the MoodEntry instance and update it
        const moodLogs = JSON.parse(localStorage.getItem('moodLogs'));
        const entry = moodLogs[id];
        
        if (entry) {
          // Update the entry with new values while preserving the date
          moodLogs[id] = {
            ...entry,
            entryMoodEmoji: updatedValues.entryMoodEmoji,
            entryMoodValue: updatedValues.entryMoodValue,
            entryMoodNotes: updatedValues.entryMoodNotes
          };
          
          localStorage.setItem('moodLogs', JSON.stringify(moodLogs));
          renderMoodLogList(); // Refresh the list
        }
      });
  
      cancelBtn.addEventListener('click', () => {
        logItem.classList.remove('editing');
        editBtn.style.display = 'block';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
      });
    });
  };


renderMoodLogList();