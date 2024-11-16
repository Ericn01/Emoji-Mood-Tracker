class MoodEntry{
    constructor(moodValues){
        this.moodEntryID = Math.floor(Math.random() * 10000) // Creates a random 5 digit integer
        // Setting up the default values for a mood entry object
        this.entryDate = new Date(Date.now()).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}); // Creates the date in format Month Day, Year
        this.moodEmoji = moodValues['moodEmoji'];
        this.moodValue = moodValues['moodScalar'];
        this.moodNotes = moodValues['moodNotes'];
    }

    // Returns the mood entry data as an object
    getMoodEntryData(){
        return { 
            moodEntryID: 
            {
                entryDate: this.entryDate,
                entryMoodEmoji: this.moodEmoji,
                entryMoodValue: this.moodValue,
                entryMoodNotes: this.moodNotes
            }
        };
    }

    saveToLocalStorage(){
        // Retrieve the data in local storage
        const moodLogs = JSON.parse(localStorage.getItem('moodLogs'));
        moodLogs.push(this.getMoodEntryData());
        // Save the updated data in local storage
        localStorage.setItem(JSON.stringify(moodLogs)); 
    }

    editMoodEntry(updatedMoodValues){
        for (const entry of Object.entries(updatedMoodValues)){

        }
    }

    renderMoodEntryLog(){
        const moodEntryContainer = document.querySelector('.mood-entry-logs');
        const entryValuesHTML = document.querySelectorAll('.log');

        entryValuesHTML.forEach( (item) => {
            
        })
    }

}

export default MoodEntry;