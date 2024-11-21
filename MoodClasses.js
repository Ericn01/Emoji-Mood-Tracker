import { getMoodRatingColor } from "./mappings.js";
import { ModalManager } from "./ModalManager.js";

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
    /**
     * Updates the value of a filter type
     * @param {*} type the filter key --> one of (date, value, emoji)
     * @param {*} value the updated value for the selected filter attribute
     */
    setFilter(type, value){
        this.filters[type] = value;
    }
    /**
     * 
     * @param {*} entries 
     * @returns 
     */
    applyFilters(entries){
        return entries.filter( (entry) => 
            this.dateFilter(entry) && 
            this.moodValueFilter(entry) && 
            this.emojiFilter(entry)
        );
    }
    /**
     * Filters the mood entries by their date
     * @param {*} entry an instance of MoodEntry
     * @returns the new date range for entries
     */
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
    /**
     * Applies the emoji filtering to log entries
     * @param {*} entry an instance of MoodEntry
     * @returns the new emoji filter selection
     */
    emojiFilter(entry){
        const emojiSelection = entry.emojiMood[0]; 
        return this.filters.selectedEmojis.length === 0 || this.filters.selectedEmojis.includes(emojiSelection);
    }
}

// Renders a single entry. Also controls adding event listeners.
export class MoodEntryView {
    constructor(emojiSelections) {
        this.emojiSelections = emojiSelections;
        this.modalManager = new ModalManager();
    }
    /**
     * Creates a new mood entry.
     * @param {*} entry An instance of the MoodEntry class
     * @param {*} onEdit the method that handles the editing of the values in a mood entry
     * @param {*} onDelete the method that handles the deletion of a mood entry 
     * @returns The HTML (presentation) of a MoodEntry
     */
    createEntry(entry, onEdit, onDelete){
        const moodEntryHTML = document.createElement('article');
        moodEntryHTML.className = 'log-item';
        moodEntryHTML.setAttribute('data-entry-id', entry.id);
        moodEntryHTML.setAttribute('data-mood', entry.emojiMood[0])
        
        moodEntryHTML.innerHTML = this.getTemplate(entry);
        this.colorLogMoodValue(moodEntryHTML, entry);
        this.addControlsEventListeners(moodEntryHTML, entry, onEdit, onDelete)

        return moodEntryHTML;
    }
    /**
     * 
     * @param {*} entry An instance of the MoodEntry class
     * @returns 
     */
    getTemplate(entry){
        const noteOverflow = entry.notes.length >= 55;
        const entryNotesSubstring = noteOverflow ? `${entry.notes.substring(0, 55)}...` : entry.notes;
        return `
        <section class="log-top-section">
            <span class="log-date">${entry.date}</span>
            <span class="log-emoji">${entry.emojiMood[1]}</span>
            <span class="log-mood-value">${entry.moodValue.toFixed(1)}</span>
            <div class="edit-controls">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        </section>
        <section class="log-bottom-section">
            <span class="log-note">${entryNotesSubstring || 'No note'}</span> 
        </section>
        `;
    }
    /**
     * Adds a background color to the mood rating value.
     * @param {*} moodEntry The HTML element that presents the mood data
     * @param {*} entry An instance of the MoodEntry class
     */
    colorLogMoodValue(moodEntry, entry){
        const logMoodValue = moodEntry.querySelector('.log-mood-value');
        if (logMoodValue){
            logMoodValue.style.backgroundColor = getMoodRatingColor(entry.moodValue)
        } else {console.log('The specified element doesn\'t exit')}
    }

    /**
     * 
     * @param {*} moodEntry the HTML element that presents the mood data
     * @param {*} entry An instance of the MoodEntry class
     * @param {*} onEdit editing function handler
     * @param {*} onDelete delete function handler
     */
    addControlsEventListeners(moodEntry, entry, onEdit, onDelete) {
        const editBtn = moodEntry.querySelector('.edit-btn');
        const deleteBtn = moodEntry.querySelector('.delete-btn');
    
        editBtn.addEventListener('click', () => this.showEditModal(entry, onEdit));
        deleteBtn.addEventListener('click', () => this.showDeleteModal(entry, onDelete));
    }
    /**
     * Method that defines and returns the template for the modal screens when a user edits a mood entry.
     * @param {*} entry An instance of the MoodEntry class.
     * @returns HTML template for the editing modal screen
     */
    getEditModalTemplate(entry){
        return `
        <div class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Mood Entry</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form class="edit-form">
                    <div class="form-group">
                        <label>Mood</label>
                        <select class="edit-emoji" required>
                            ${Array.from(this.emojiSelections).map(emoji => `
                                <option value="${emoji.id},${emoji.textContent}" 
                                    ${entry.emojiMood[0] === emoji.id ? 'selected' : ''}>
                                    ${emoji.textContent}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Rating</label>
                        <input type="number" 
                            class="edit-mood-value" 
                            min="0" 
                            max="10" 
                            step="1.0" 
                            value="${entry.moodValue}" 
                            required
                        >
                    </div>
                    <div class="form-group">
                        <label>Notes</label>
                        <textarea class="edit-note" 
                            placeholder="Add a note..."
                            rows="4"
                        >${entry.notes || ''}</textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn">Cancel</button>
                <button class="save-btn">Save Changes</button>
            </div>
        </div>
        </div>`
    }
    /**
     * Defines and returns the HTML for the entry deletion confirmation modal.
     * @param {*} entry An instance of the MoodEntry class.
     * @returns HTML template for the deletion completion modal screen.
     */
    getDeleteConfirmationTemplate(entry) {
        return `
        <div class="modal-overlay delete-confirm">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Delete Entry</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this entry?</p>
                    <div class="entry-preview">
                        <span class="preview-emoji">${entry.emojiMood[1]}</span>
                        <span class="preview-date">${entry.date}</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn">Cancel</button>
                    <button class="confirm-delete-btn">Delete Entry</button>
                </div>
            </div>
        </div>`;
    }

    /**
     * Logic for presenting a modal screen.
     * @param {*} entry An instance of the MoodEntry class
     * @param {*} onSave 
     */
    showEditModal(entry, onSave) {
        const modalHTML = this.getEditModalTemplate(entry);
        const modal = this.modalManager.showModal(modalHTML, () => {
            const form = modal.querySelector('.edit-form');
            if (!form) return;

            const [emojiId, emojiText] = form.querySelector('.edit-emoji').value.split(',');
            const moodValue = parseFloat(form.querySelector('.edit-mood-value').value);
            const notes = form.querySelector('.edit-note').value;

            // Data validation
            if (!emojiId || isNaN(moodValue)) {
                throw new Error('Invalid form data');
            }

            const updatedValues = {
                entryDate: new Date(),
                entryMoodEmoji: [emojiId, emojiText],
                entryMoodValue: moodValue,
                entryMoodNotes: notes
            };

            onSave(entry.id, updatedValues);
        });
    }
    /**
     * Logic for presenting the entry deletion confirmation modal screen.
     * @param {*} entry An instance of the MoodEntry class.
     * @param {*} onDelete The logic for deleting an instance of the class.
     */
    showDeleteModal(entry, onDelete) {
        const modalHTML = this.getDeleteConfirmationTemplate(entry);
        this.modalManager.showModal(modalHTML, () => onDelete(entry.id));
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
        this.entryView = new MoodEntryView(emojiSelections);
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
    /**
     * Loads the mood entries data and creates instances of the MoodEntry class.  
     * @returns An array of instances of the MoodEntry class.
     */
    loadEntries(){
        const data = this.storage.getEntries();
        return Object.entries(data).map(([id, entry]) => new MoodEntry(id, entry));
    }
    
    // ========== PURELY A TESTING FUNCTION =============
    loadUserDefinedEntries(userDefinedEntries){
        return Object.values(userDefinedEntries).map( (entry) => new MoodEntry(Date.now(), entry));
    }

    /**
     * Adds new filter parameters and re-renders the mood list.
     * @param {*} type the current filtering type 
     * @param {*} value 
     */
    handleSetFilter(type, value){
        this.filter.setFilter(type, value);
        this.render();
    }
    /**
     * 
     * @param {*} entryId 
     * @param {*} updatedValues 
     */
    handleEdit(entryId, updatedValues) {
        const entryData = {
            entryDate: updatedValues.entryDate,
            entryMoodEmoji: updatedValues.entryMoodEmoji,
            entryMoodValue: updatedValues.entryMoodValue,
            entryMoodNotes: updatedValues.entryMoodNotes
        };

        this.storage.updateEntries(entryId, entryData);
        this.entries = this.loadEntries();
        this.render();
    }

    /**
     * Removes entries from localStorage and re-renders the mood list. 
     * @param {*} entryId the ID of the entry to be removed.
     */
    handleDelete(entryId) {
        this.storage.deleteEntries(entryId); // Using the existing method name
        this.entries = this.loadEntries();
        this.render();
    }
    
    /**
     * Renders the list of filtered entries by most recent date and appends them as HTML elements. If none exist, then a different HTML element is rendered (empty state) to notify the user that
     * @returns An HTML element containing the filtered and sorted mood entries.
     */
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

        filteredEntries.sort( (a, b) => a.date - b.date ) // Show most recent entries first
        .forEach( (entry) => {
                const moodEntry = this.entryView.createEntry(
                    entry, 
                    (id, values) => this.handleEdit(id, values), 
                    (id) => this.handleDelete(id)
                );
                this.container.appendChild(moodEntry);
            });
    }
}
