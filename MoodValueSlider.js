// Handles the rendering and logic behind the mood / contentment slider.
import { getMoodValueMappings } from "./mappings.js";

export class MoodValueSlider {
    constructor(sliderContainer, sliderRange) {
      // 1. What data do we need?
      this.sliderContainer = sliderContainer;
      this.sliderRange = sliderRange;
      this.minValue = parseInt(sliderRange.min);
      this.maxValue = parseInt(sliderRange.max);
      this.moodValue = parseInt(sliderRange.value); // default value
      this.moodMappings = getMoodValueMappings();
      // This variable represents the ratio between the range's current value and the max as a position.
      this.positionPercentage = ((this.moodValue - this.minValue) / (this.maxValue - this.minValue)) * 100;  
      // 2. Set up events
      this.setupEventListeners();
      this.handleSliderTickDisplay();
      this.initializeSlider();
    }
    // Sets up the default value and the rendering of elements on page load
    initializeSlider(){
        this.handleSliderEmoji(this.moodValue);
        this.handleTickStyling(this.moodValue);
        this.handleSliderTextDisplay(this.moodValue);
        this.handleSliderBackgroundColor(this.moodValue);
    }
    // 3. Methods other code will use
    handleSliderEmoji(moodValue){
        const matchingMoodEmoji = this.moodMappings[moodValue]['emoji'];
        this.sliderContainer.setAttribute('data-emoji', matchingMoodEmoji);
        this.sliderContainer.style.setProperty('--thumb-position', `${this.positionPercentage}%`);
    }

    handleSliderTickDisplay(){
        const ticksContainer = document.querySelector('.slider-ticks-group');
        // Slider tick mark dynamic generation
        for (let i = this.minValue; i <= this.maxValue; i++){
            const tick = document.createElement('div');
            tick.classList.add('slider-tick');

            // Adding labels to the ticks
            const tickLabel = document.createElement('span');
            tickLabel.classList.add('slider-tick-label')
            tickLabel.textContent = i;

            tick.appendChild(tickLabel);

            ticksContainer.appendChild(tick);
        }
    }

    // Modifies the styling of ticks that are overlapped by the slider
    handleTickStyling(moodValue){
        const tickLabels = document.querySelectorAll('.slider-tick-label');
        for (const label of tickLabels){
            const tickNumber = parseInt(label.textContent);
            // Special tick styling if the current value is equal to that of the tick.
            if (moodValue === tickNumber){
                label.style.setProperty('font-weight', 'bold');
                label.style.setProperty('color', 'navy');
            } else{
                label.style.setProperty('font-weight', 'normal');
                label.style.setProperty('color', '#333');
            }
        }
    }

    handleSliderBackgroundColor(moodValue){
        const matchingColor = this.moodMappings[moodValue]['colorHex'];
        this.sliderRange.style.setProperty('--slider-color', matchingColor);
        this.sliderRange.style.setProperty('--slider-percentage', `${this.positionPercentage}%`);
    }

    handleSliderTextDisplay(moodValue){
        const textBox = document.querySelector('.mood-text');
        const text = this.moodMappings[moodValue]['text'];
        textBox.textContent = text;

        textBox.style.setProperty('--text-position', `${this.positionPercentage}%`);
    }
  
    // 5. Event handling in one place
    setupEventListeners() {
      this.sliderRange.addEventListener('input', (event) => {
        const moodValue = parseInt(event.target.value);
        this.positionPercentage = ((moodValue - this.minValue) / (this.maxValue - this.minValue)) * 100; // update the position
        this.moodValue = moodValue; // update the mood value
        this.handleSliderEmoji(moodValue);
        this.handleSliderBackgroundColor(moodValue);
        this.handleTickStyling(moodValue);
        this.handleSliderTextDisplay(moodValue);
      });
    }
  }