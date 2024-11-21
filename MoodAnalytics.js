
import { generateTestMoodEntries } from './test/testingEntries.js'

// Analytics class to handle all chart-related data processing
class MoodAnalytics {
    constructor(entries) {
        this.entries = entries;
    }

    // Get average mood by time period (day, week, month)
    getAverageMoodTrends() {
        const trends = {};
        
        this.entries.forEach(entry => {
            const date = new Date(entry.date);
            const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            const weekKey = this.getWeekKey(date);
            const dayKey = date.toISOString().split('T')[0];

            // Initialize period objects if they don't exist
            if (!trends[monthKey]) trends[monthKey] = { sum: 0, count: 0, average: 0 };
            if (!trends[weekKey]) trends[weekKey] = { sum: 0, count: 0, average: 0 };
            if (!trends[dayKey]) trends[dayKey] = { sum: 0, count: 0, average: 0 };

            // Add values
            [monthKey, weekKey, dayKey].forEach(key => {
                trends[key].sum += entry.moodValue;
                trends[key].count += 1;
                trends[key].average = trends[key].sum / trends[key].count;
            });
        });

        return {
            monthly: this.formatTrendsData(trends, 'month'),
            weekly: this.formatTrendsData(trends, 'week'),
            daily: this.formatTrendsData(trends, 'day')
        };
    }

    // Get mood distribution data
    getMoodDistribution() {
        const distribution = {
            values: Array(9).fill(0), // For mood values 1-10
            emojis: {} // For emoji frequency
        };

        this.entries.forEach(entry => {
            // Count mood value frequencies
            distribution.values[Math.floor(entry.moodValue) - 1]++;
            
            // Count emoji frequencies
            const emoji = entry.emojiMood[1];
            distribution.emojis[emoji] = (distribution.emojis[emoji] || 0) + 1;
        });

        return distribution;
    }

    // Get mood patterns by time of day
    getTimeOfDayPatterns() {
        const timeSlots = {
            morning: { hours: [6, 7, 8, 9, 10, 11], values: [] },
            afternoon: { hours: [12, 13, 14, 15, 16, 17], values: [] },
            evening: { hours: [18, 19, 20, 21, 22, 23], values: [] },
            night: { hours: [0, 1, 2, 3, 4, 5], values: [] }
        };

        this.entries.forEach(entry => {
            const hour = new Date(entry.date).getHours();
            const timeSlot = Object.keys(timeSlots).find(slot => 
                timeSlots[slot].hours.includes(hour)
            );

            if (timeSlot) {
                timeSlots[timeSlot].values.push(entry.moodValue);
            }
        });

        // Calculate averages for each time slot
        return Object.entries(timeSlots).reduce((acc, [slot, data]) => {
            const average = data.values.length > 0 
                ? data.values.reduce((sum, val) => sum + val, 0) / data.values.length 
                : 0;
            acc[slot] = {
                average: Number(average.toFixed(2)),
                count: data.values.length
            };
            return acc;
        }, {});
    }

    // Get mood correlations with notes content
    getNotesAnalysis() {
        const commonWords = {};
        const moodWordCorrelations = {};

        this.entries.forEach(entry => {
            if (!entry.notes) return;

            const words = entry.notes.toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                .split(/\s+/);

            words.forEach(word => {
                if (word.length < 3) return; // Skip short words

                // Count word frequencies
                commonWords[word] = (commonWords[word] || 0) + 1;

                // Track mood correlations
                if (!moodWordCorrelations[word]) {
                    moodWordCorrelations[word] = {
                        sum: 0,
                        count: 0,
                        average: 0
                    };
                }
                moodWordCorrelations[word].sum += entry.moodValue;
                moodWordCorrelations[word].count += 1;
                moodWordCorrelations[word].average = 
                    moodWordCorrelations[word].sum / moodWordCorrelations[word].count;
            });
        });

        // Filter for words that appear more than once
        const significantCorrelations = Object.entries(moodWordCorrelations)
            .filter(([word, data]) => data.count > 1)
            .sort((a, b) => b[1].average - a[1].average)
            .reduce((acc, [word, data]) => {
                acc[word] = data;
                return acc;
            }, {});

        return {
            commonWords,
            moodCorrelations: significantCorrelations
        };
    }

    // Helper method to get week number
    getWeekKey(date) {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(
            ((date - startOfYear) / 86400000 + startOfYear.getDay()) / 7
        );
        return `Week ${weekNumber}, ${date.getFullYear()}`;
    }

    // Helper method to format trends data
    formatTrendsData(trends, periodType) {
        return Object.entries(trends)
            .filter(([key]) => {
                if (periodType === 'month') return key.includes(' ');
                if (periodType === 'week') return key.includes('Week');
                return key.includes('-');
            })
            .map(([label, data]) => ({
                label,
                value: Number(data.average.toFixed(2)),
                count: data.count
            }))
            .sort((a, b) => {
                if (periodType === 'month') {
                    return new Date(a.label) - new Date(b.label);
                }
                return a.label.localeCompare(b.label);
            });
    }

    // Get overall statistics
    getStatistics() {
        if (this.entries.length === 0) return null;

        const moodValues = this.entries.map(entry => entry.moodValue);
        const average = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
        
        return {
            average: Number(average.toFixed(2)),
            median: this.getMedian(moodValues),
            mode: this.getMode(moodValues),
            standardDeviation: this.getStandardDeviation(moodValues, average),
            totalEntries: this.entries.length,
            streakData: this.getStreakData()
        };
    }

    // Helper method to calculate median
    getMedian(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        }
        return sorted[middle];
    }

    // Helper method to calculate mode
    getMode(values) {
        const frequencies = values.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});

        let mode = null;
        let maxFrequency = 0;

        Object.entries(frequencies).forEach(([value, frequency]) => {
            if (frequency > maxFrequency) {
                mode = Number(value);
                maxFrequency = frequency;
            }
        });

        return mode;
    }

    // Helper method to calculate standard deviation
    getStandardDeviation(values, mean) {
        const squareDiffs = values.map(value => {
            const diff = value - mean;
            return diff * diff;
        });
        
        const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
        return Number(Math.sqrt(avgSquareDiff).toFixed(2));
    }

    // Helper method to calculate streak data
    getStreakData() {
        if (this.entries.length === 0) return { current: 0, longest: 0 };

        const dates = this.entries.map(entry => 
            new Date(entry.date).toISOString().split('T')[0]
        ).sort();

        let currentStreak = 1;
        let longestStreak = 1;
        let streakCount = 1;

        for (let i = 1; i < dates.length; i++) {
            const prevDate = new Date(dates[i - 1]);
            const currDate = new Date(dates[i]);
            const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);

            if (dayDiff === 1) {
                streakCount++;
                longestStreak = Math.max(longestStreak, streakCount);
            } else {
                streakCount = 1;
            }
        }

        // Calculate current streak
        const lastEntryDate = new Date(dates[dates.length - 1]);
        const today = new Date();
        const daysSinceLastEntry = Math.floor((today - lastEntryDate) / (1000 * 60 * 60 * 24));
        
        currentStreak = daysSinceLastEntry <= 1 ? streakCount : 0;

        return {
            current: currentStreak,
            longest: longestStreak
        };
    }
}


// Generate random mood entries
const moodEntries = generateTestMoodEntries();
// Usage example:
const analytics = new MoodAnalytics(moodEntries);

// Get various analytics
const trends = analytics.getAverageMoodTrends();
const distribution = analytics.getMoodDistribution();
const timePatterns = analytics.getTimeOfDayPatterns();
const notesAnalysis = analytics.getNotesAnalysis();
const statistics = analytics.getStatistics();

const analyticsData = [trends, distribution, timePatterns, notesAnalysis, statistics];

analyticsData.forEach( (dataObj) => console.log(dataObj));
