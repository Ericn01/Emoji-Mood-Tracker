class MoodEntry{
    constructor(moodValues){
        this.entryID =  0;
        // Setting up the default values for a mood entry object
        this.entryDate = new Date(Date.now()).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}); // Creates the date in format Month Day, Year
        this.entryMoodEmoji = moodValues['emojiMood'];
        this.entryMoodValue = moodValues['moodScalar'];
        this.entryMoodNotes = moodValues['moodNote'];
        this.saveToLocalStorage();
    }

    // Returns the mood entry data as an object
    getMoodEntryValues(){
        return { 
            entryDate: this.entryDate,
            entryMoodEmoji: this.entryMoodEmoji,
            entryMoodValue: this.entryMoodValue,
            entryMoodNotes: this.entryMoodNotes
        };
    }

    saveToLocalStorage(){
        // Retrieve the data in local storage
        const moodLogs = JSON.parse(localStorage.getItem('moodLogs'));
        // Generate new entry ID if there are already mood logs.
        if (moodLogs != null){
            const moodLogIDs = Object.keys(moodLogs);
            if (moodLogIDs.length > 0){
                this.entryID = Math.max(...moodLogIDs.map(Number)) + 1;
            } 
        }
        moodLogs[this.entryID] = this.getMoodEntryValues(); // Append the data.
        // Save the updated data in local storage
        localStorage.setItem('moodLogs', JSON.stringify(moodLogs)); 
    };

    editMoodEntry(updatedMoodValues){
        if (updatedMoodValues.entryMoodEmoji) {
            this.entryMoodEmoji = updatedMoodValues.entryMoodEmoji;
          }
        if (updatedMoodValues.entryMoodValue !== undefined) {
            this.entryMoodValue = updatedMoodValues.entryMoodValue;
        }
        if (updatedMoodValues.entryMoodNotes !== undefined) {
            this.entryMoodNotes = updatedMoodValues.entryMoodNotes;
        }
        const moodLogs = JSON.parse(localStorage.getItem('moodLogs'));
        moodLogs[this.entryID] = this.getMoodEntryValues();
        localStorage.setItem('moodLogs', JSON.stringify(moodLogs));
    }

}

export default MoodEntry;