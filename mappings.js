// Given an input of 
const getMoodRatingColor = (moodRating) =>{
    // 0.0 -> 2.0 (red / #ff0000) 
    // 2.0 -> 4.0 (orange / #ffa500)
    // 4.0 -> 6.0 (yellow / #ffff00)
    // 6.0 -> 8.0 (lime / #bfff00)
    // 8.0 -> 10.0 (green / #00ff00)
    /* Given this, how can I create an algorithm that returns a hex color code with the correct color*/
    if (moodRating <= 2.0){
        return '#ff0000';
    } else if (moodRating > 2.0 && moodRating <= 4.0){
        return '#ffa500';
    } else if (moodRating > 4.0 && moodRating <= 6.0){
        return '#ffff00';
    } else if (moodRating > 6.0 && moodRating <= 8.0){
        return '#bfff00';
    } else{
        return '#00ff00';
    }
}

const getMoodValueMappings = () => {
    const moodMapping = {
    1: {emoji: '😭',
        text: "Horrible",
        },
    2: {emoji: '😞',
        text: "Very bad",
        },
    3: {emoji: '😔',
        text: "Bad",
        },
    4: {emoji: '😒',
        text: "Somewhat Okay",
        },
    5: {emoji: '😐',
        text: "Neutral",
        },
    6: {emoji: '🙂',
        text: "Satisfied",
       },
    7: {emoji: '😀',
        text: "Content",
        },
    8: {emoji: '😄',
        text: "Happy",
        },
    9: {emoji: '😁',
        text: "Fantastic",
       },
    10: {emoji: '🤩',
        text: "Absolutely Amazing",
        }
    }
    // Adding in a repetitive attribute
    Object.keys(moodMapping).forEach( (key) => {
        moodMapping[key]['colorHex'] = getMoodRatingColor(key);
    });
    return moodMapping;
};

export { getMoodRatingColor, getMoodValueMappings };