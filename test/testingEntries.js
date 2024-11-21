// Utility function to generate a random date within a range
const randomDate = (start, end) => {
    const startDate = start.getTime();
    const endDate = end.getTime();
    const randomTime = startDate + Math.random() * (endDate - startDate);
    return new Date(randomTime);
};

// Generate realistic mood notes
const moodNotes = {
    high: [
        "Had a great workout today! Feeling energized",
        "Finished a big project at work, very satisfied",
        "Wonderful dinner with friends, feeling connected",
        "Beautiful sunny day, went for a long walk",
        "Got praised by my boss for recent work",
        "Family gathering was perfect, feeling loved",
        "Meditation session really helped clear my mind",
        "Accomplished all my tasks for the day",
    ],
    medium: [
        "Regular day at work, nothing special",
        "Bit tired but managing okay",
        "Weather is cloudy but peaceful",
        "Grocery shopping done, feeling productive",
        "Had an okay lunch, working through afternoon",
        "Netflix and chill kind of evening",
        "Doing some house chores, staying busy",
        "Just another normal day",
    ],
    low: [
        "Didn't sleep well last night, feeling exhausted",
        "Stressful meeting at work today",
        "Missing my family, feeling a bit down",
        "Rainy day, feeling unmotivated",
        "Had an argument with a friend",
        "Too much work, feeling overwhelmed",
        "Not feeling my best today",
        "Worried about upcoming deadlines",
    ]
};

// Generate test mood entries
export const generateTestMoodEntries = (numberOfDays = 60) => {
    const entries = [];
    const endDate = new Date(); // Today
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numberOfDays);

    // Create entries with some realistic patterns
    for (let i = 0; i < numberOfDays; i++) {
        // Some days might have multiple entries
        const entriesPerDay = Math.random() < 0.2 ? 2 : 1; // 20% chance of multiple entries

        for (let j = 0; j < entriesPerDay; j++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            // Add random hours but weight towards certain times of day
            const hour = Math.floor(Math.random() * 24);
            currentDate.setHours(hour, Math.floor(Math.random() * 60));

            // Generate mood value with some realistic patterns
            let baseMoodValue;
            if (hour >= 6 && hour < 12) { // Morning: slightly better moods
                baseMoodValue = 6 + (Math.random() * 4);
            } else if (hour >= 12 && hour < 17) { // Afternoon: more varied
                baseMoodValue = 5 + (Math.random() * 5);
            } else if (hour >= 17 && hour < 22) { // Evening: slightly lower
                baseMoodValue = 4 + (Math.random() * 5);
            } else { // Night: more volatile
                baseMoodValue = 3 + (Math.random() * 7);
            }

            // Adjust for weekends (slightly better moods)
            if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                baseMoodValue = Math.min(10, baseMoodValue + 1);
            }

            const moodValue = Math.min(10, Math.max(1, Math.round(baseMoodValue * 2) / 2));

            // Select emoji based on mood value
            let emojiMood;
            if (moodValue >= 8) {
                emojiMood = ["confident", "😎"];
            } else if (moodValue >= 6) {
                emojiMood = ["happy", "😊"];
            } else if (moodValue >= 4) {
                emojiMood = ["sleepy", "😴"];
            } else if (moodValue >= 3) {
                emojiMood = ["sad", "😢"];
            } else {
                emojiMood = ["angry", "😡"];
            }

            // Select appropriate notes based on mood value
            let notesList;
            if (moodValue >= 7) {
                notesList = moodNotes.high;
            } else if (moodValue >= 4) {
                notesList = moodNotes.medium;
            } else {
                notesList = moodNotes.low;
            }

            const notes = notesList[Math.floor(Math.random() * notesList.length)];

            entries.push({
                id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                date: currentDate.toISOString(),
                emojiMood: emojiMood,
                moodValue: moodValue,
                notes: Math.random() < 0.8 ? notes : '', // 80% chance of having notes
            });
        }
    }

    // Sort entries by date
    return entries.sort((a, b) => new Date(a.date) - new Date(b.date));
};