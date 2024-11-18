import { getMoodRatingColor } from "./mappings.js";

/** 
 * Represents a single mood entry
 * 
 * This class is responsible for the following:
 *   1. Handle the mood entry data structure and formatting
 *   2. Providing conversion methods (JSON is the only one right now).
 * */ 
export class MoodEntry{
    constructor(id, data){
        this.id = id;
        this.date = data.entryDate;
        this.emojiMood = data.entryMoodEmoji;
        this.moodValue = data.entryMoodValue;
        this.notes = data.entryMoodNotes;
    }
    // Handle the conversion of the mood object into a JSON object that can be stored in localStorage
    toJSON(){
        return{
            entryDate: this.date.toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            }),
            entryMoodEmoji: this.emojiMood,
            entryMoodValue: this.moodValue,
            entryMoodNotes: this.notes 
        };
    }
}

/**
 * This class handles the persistence of the mood logs
 * 
 * Responsible for the following:
 *   1. Retrieving entries from local storage
 *   2. saving entries to local storage
 *   3. Updating existing entries and saving them. 
 */
export class MoodStorage{
    constructor(){
        this.storageKey = 'moodLogs';
    };
    getEntries(){
        const logEntries = localStorage.getItem(this.storageKey);
        if (logEntries){
            return JSON.parse(logEntries);
        } 
        return {}; // else, return an empty object
    };
    saveEntries(entries){
        localStorage.setItem(this.storageKey, JSON.stringify(entries));
    }
    updateEntries(id, data){
        const entries = this.getEntries();
        entries[id] = data; // Appends or modifies an entry.
        this.saveEntries(entries);
    }
    deleteEntries(id){
        const entries = this.getEntries();
        delete entries[id];
        this.saveEntries(entries);
    }
};

// Filtering functionality for the mood entries
export class MoodFilter{
    constructor(){
        this.filters = { 
            dateRange: 'all', // Options: all, day, week, month, year
            moodRangeValue: {min: 1, max: 10},
            selectedEmojis: [], 
        };
    }
    setFilter(type, value){
        this.filters[type] = value;
    }

    applyFilters(entries){
        return entries.filter( (entry) => 
            this.dateFilter(entry) && 
            this.moodValueFilter(entry) && 
            this.emojiFilter(entry)
        );
    }
    // Logic to filter by date
    dateFilter(entry){
        const date = new Date(entry.date);
        const now = new Date();
        switch(this.filters.dateRange){
            case 'day':
                return date.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date(now.setDate(now.getDate() - 7));
                return date >= weekAgo; 
            case 'month':
                return (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear());
            case 'year':
                return date.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    }
    // Logic to filter by the mood value
    moodValueFilter(entry){
        const moodValue = entry.moodValue; 
        const { min, max } = this.filters.moodRangeValue; 
        return moodValue <= max && moodValue >= min; 
    }
    // Emoji filtering 
    emojiFilter(entry){
        const emojiSelection = entry.emojiMood[0]; 
        return this.filters.selectedEmojis.length === 0 || this.filters.selectedEmojis.includes(emojiSelection);
    }
}

// Renders a single entry. Also controls adding event listeners.
export class MoodEntryView {
    constructor(emojiSelections){
        this.emojiSelections = emojiSelections;
    }
    // Combines all the rendering methods together
    createEntry(entry, onEdit, onSave, onCancel, onDelete){
        const moodEntry = document.createElement('article');
        moodEntry.className = 'log-item';
        moodEntry.setAttribute('data-entry-id', entry.id);
        moodEntry.setAttribute('data-mood', entry.emojiMood[0])
        
        moodEntry.innerHTML = this.getTemplate(entry);
        this.colorLogMoodValue(moodEntry, entry);
        this.addControlsEventListeners(moodEntry, entry, onEdit, onSave, onCancel, onDelete)

        return moodEntry;
    }
    getTemplate(entry){
        return `
        <span class="log-date">${entry.date}</span>
        <span class="log-emoji">${entry.emojiMood[1]}</span>
        <span class="log-mood-value">${entry.moodValue.toFixed(1)}</span>
        <span class="log-note">${entry.notes || 'No note'}</span>
        ${this.getEditFormTemplate(entry)}
        ${this.getControlsTemplate()}
        `;
    }

    colorLogMoodValue(moodEntry, entry){
        const logMoodValue = moodEntry.querySelector('.log-mood-value');
        if (logMoodValue){
            logMoodValue.style.backgroundColor = getMoodRatingColor(entry.moodValue)
        } else {console.log('The specified element doesn\'t exit')}
    }

    getEditFormTemplate(entry){
        return `
        <form class="edit-form">
          <select class="edit-emoji" required>
            ${Array.from(this.emojiSelections).map(emoji => `
              <option value="${emoji.id},${emoji.textContent}" 
                ${entry.emojiMood[0] === emoji.id ? 'selected' : ''}>
                ${emoji.textContent}
              </option>
            `).join('')}
          </select>
          <input type="number" 
            class="edit-mood-value" 
            min="0" 
            max="10" 
            step="0.1" 
            value="${entry.moodValue}" 
            required
          >
          <input type="text" 
            class="edit-note" 
            value="${entry.notes || ''}" 
            placeholder="Add a note..."
          >
        </form>
      `;
    }
    getControlsTemplate(){
        return `
      <div class="edit-controls">
        <button class="edit-btn">Edit</button>
        <button class="save-btn" style="display: none;">Save</button>
        <button class="cancel-btn" style="display: none;">Cancel</button>
        <button class="delete-btn">Delete</button>
      </div>`
    };

    addControlsEventListeners(moodEntry, entry, onEdit, onSave, onCancel, onDelete) {
        const editBtn = moodEntry.querySelector('.edit-btn');
        const saveBtn = moodEntry.querySelector('.save-btn');
        const cancelBtn = moodEntry.querySelector('.cancel-btn');
        const deleteBtn = moodEntry.querySelector('.delete-btn');
    
        editBtn.addEventListener('click', () => onEdit(moodEntry));
        saveBtn.addEventListener('click', () => this.handleSave(moodEntry, entry.id, onSave));
        cancelBtn.addEventListener('click', () => onCancel(moodEntry));
        deleteBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if (confirm('Are you sure you want to delete this entry?')){
                this.handleDelete(moodEntry, entry.id, onDelete);
            }
        })
    }

    handleSave(moodEntry, entryId, onSave) {
        const form = moodEntry.querySelector('.edit-form');
        const [emojiId, emojiText] = form.querySelector('.edit-emoji').value.split(',');
        const moodValue = parseFloat(form.querySelector('.edit-mood-value').value);

        // Data validation first
        if (!emojiId || isNaN(moodValue)) {
            throw new Error('Invalid form data');
        }

        const updatedValues = {
          entryDate: new Date(),
          entryMoodEmoji: [emojiId, emojiText],
          entryMoodValue: parseFloat(form.querySelector('.edit-mood-value').value),
          entryMoodNotes: form.querySelector('.edit-note').value
        };
    
        onSave(entryId, updatedValues);
    }

    handleDelete(moodEntry, entryId, onDelete) {
        // Remove the entry from the DOM
        moodEntry.remove();
        // Call the controller's delete method
        onDelete(entryId);
    }
}
/**
 * Main controller class
 * 
 * Responsible for:
 *   1. Coordinating events between components
 *   2. Managing high level operations
 */
export class MoodLogController {
    constructor(container, emojiSelections) {
        this.container = container;
        this.storage = new MoodStorage();
        this.filter = new MoodFilter();
        this.entryView = new MoodEntryView(emojiSelections, (id) => this.handleDelete(id));
        // Load all the entries from local storage
        this.entries = this.loadEntries();
    }
    
    createNewEntry(moodData){
        // Generating a unique ID using the timestamp
        const id = Date.now().toString();
        // Creating the entry data structure
        const newEntry = new MoodEntry(id, {
            entryDate: new Date(),
            entryMoodEmoji: moodData.entryEmojiMood,
            entryMoodValue: moodData.entryMoodValue,
            entryMoodNotes: moodData.entryNotes || ''
        });

        // Storing the new entry 
        this.storage.updateEntries(id, newEntry.toJSON());
        // Reloading the entries and re-rendering
        this.entries = this.loadEntries();
        this.render();
    }

    loadEntries(){
        const data = this.storage.getEntries();
        return Object.entries(data).map(([id, entry]) => new MoodEntry(id, entry));
    }

    handleSetFilter(type, value){
        this.filter.setFilter(type, value);
        this.render();
    }

    handleEdit(moodEntry){
        moodEntry.classList.add('editing');

        const editBtn = moodEntry.querySelector('.edit-btn');
        const saveBtn = moodEntry.querySelector('.save-btn');
        const cancelBtn = moodEntry.querySelector('.cancel-btn');

        editBtn.style.display = 'none';
        saveBtn.style.display = 'block';
        cancelBtn.style.display = 'block';
    }
    handleSave(entryID, updatedValues){
        const entryData = {
            entryDate: updatedValues.entryDate || new Date(),
            entryMoodEmoji: updatedValues.entryMoodEmoji,
            entryMoodValue: updatedValues.entryMoodValue,
            entryMoodNotes: updatedValues.entryMoodNotes
        };

        const updatedEntry = new MoodEntry(entryID, entryData);

        this.storage.updateEntries(entryID, updatedEntry.toJSON());
        this.entries = this.loadEntries();
        this.render(); 
    }

    handleCancel(moodEntry){
        moodEntry.classList.remove('editing');
        const editBtn = moodEntry.querySelector('.edit-btn');
        const saveBtn = moodEntry.querySelector('.save-btn');
        const cancelBtn = moodEntry.querySelector('.cancel-btn');
    
        editBtn.style.display = 'block';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    }

    handleDelete(entryID){
        console.log(entryID); // Testing --> Get the ID
        this.storage.deleteEntries(entryID);
        this.entries = this.entries.filter( entry => entry.id !== entryID);
        this.render();
    }
    
    render(){
        this.container.innerHTML = '';
        
        const filteredEntries = this.filter.applyFilters(this.entries);
        if (filteredEntries.length === 0){
            this.container.innerHTML = `
            <div class="empty-state">
                No mood entries found matching your filters.
            </div>
            `;
            return;
        }

        filteredEntries
        .sort( (a, b) => a.date - b.date ) // Show most recent entries first
        .forEach( (entry) => {
                const moodEntry = this.entryView.createEntry(
                    entry, 
                    (entry) => this.handleEdit(entry), 
                    (id, values) => this.handleSave(id, values), 
                    (entry) => this.handleCancel(entry),
                    (id) => this.handleDelete(id)
                );
                this.container.appendChild(moodEntry);
            });
    }
}

