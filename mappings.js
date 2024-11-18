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
        text: "I feel horrible.",
        },
    2: {emoji: '😞',
        text: "I feel very bad.",
        },
    3: {emoji: '😔',
        text: "I feel bad.",
        },
    4: {emoji: '😒',
        text: "I feel somewhat okay.",
        },
    5: {emoji: '😐',
        text: "I feel neutral.",
        },
    6: {emoji: '🙂',
        text: "I feel satisfied.",
       },
    7: {emoji: '😀',
        text: "I feel content.",
        },
    8: {emoji: '😄',
        text: "I feel happy.",
        },
    9: {emoji: '😁',
        text: "I feel fantastic.",
       },
    10: {emoji: '🤩',
        text: "I feel absolutely amazing.",
        }
    }
    // Adding in a repetitive attribute
    Object.keys(moodMapping).forEach( (key) => {
        moodMapping[key]['colorHex'] = getMoodRatingColor(key);
    });
    return moodMapping;
};

export { getMoodRatingColor, getMoodValueMappings };