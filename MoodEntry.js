class MoodEntry{
    constructor(moodEmoji, moodValue, moodNotes){
        // Setting up the default values for a mood entry object
        this.entryDate = new Date(Date.now()).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}); // Creates the date in format Month Day, Year
        this.moodEmoji = moodEmoji;
        this.moodValue = moodValue;
        this.moodNotes = moodNotes;
    }

    handleNewMoodEntry(){
        this.moodValuesHTML.forEach( (moodValue) => {

        })
    }



    editMoodEntry(updatedMoodValues){

    }
}

export default MoodEntry;