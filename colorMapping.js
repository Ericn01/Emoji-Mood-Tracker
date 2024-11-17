// Given an input of 
function getMoodRatingColor(moodRating){
    // 0.0 -> 2.0 (red / #ff0000) 
    // 2.0 -> 4.0 (orange / #ffa500)
    // 4.0 -> 6.0 (yellow / #ffff00)
    // 6.0 -> 8.0 (lime / #bfff00)
    // 8.0 -> 10.0 (green / #00ff00)
    /* Given this, how can I create an algorithm that returns a hex color code with the correct color*/

    let colorHex = '#000000';
    if (moodRating <= 2.0){
        colorHex = '#ff00000';
    } else if (moodRating > 2.0 && moodRating <= 4.0){
        colorHex = '#ffa500';
    } else if (moodRating > 4.0 && moodRating <= 6.0){
        colorHex = '#ffff00';
    } else if (moodRating > 6.0 && moodRating <= 8.0){
        colorHex = '#bfff00';
    } else{
        colorHex = '00ff00';
    }
    return colorHex;
}

export { getMoodRatingColor };