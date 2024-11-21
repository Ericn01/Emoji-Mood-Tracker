import { MoodAnalytics } from './MoodAnalytics.js';

export class MoodTrendsChart {
    constructor(chartCanvasElem){
        this.canvas = chartCanvasElem;
        this.ctx = this.canvas.getContext('2d');
        this.chart = null;
        this.currentPeriod = 'weekly'; // default view
    };

    initialize(entries){
        this.analytics = new MoodAnalytics(entries);
        this.setupChart();
        this.render();
    }

    setupChart() {
        if (this.chart){
            this.chart.destroy();
        }

        const trends = this.analytics.getAverageMoodTrends();
        const moodData = trends[this.currentPeriod];

        this.chart = new Chart(this.ctx, {
            type: 'line', 
            data: {
                labels: moodData.map(d => d.label),
                datasets: [{
                    label: 'Average Mood',
                    data: moodData.map(d => d.value),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: '#4CAF50',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${this.currentPeriod.charAt(0).toUpperCase()}${this.currentPeriod.slice(1,)} Mood Trends`, // Capitalize the current period string
                        align: 'center',
                        padding: 10,
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                    },
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                return `Average Mood: ${value.toFixed(1)}`;
                            },
                            afterLabel: (context) => {
                                const dataPoint = moodData[context.dataIndex];
                                return `Entries: ${dataPoint.count}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    updatePeriod(period){
        this.currentPeriod = period;
        this.render();
    }

    render(){
        this.setupChart();
    }

};