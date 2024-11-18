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
      // 2. Set up events
      this.setupEventListeners();
      this.handleSliderTickDisplay();
    }
  
    // 3. Methods other code will use
    handleSliderEmoji(moodValue){
        const percentage = ((moodValue - this.minValue) / (moodValue - this.maxValue) * 100);
        const matchingMoodEmoji = this.moodMappings[moodValue]['emoji'];
        this.sliderRange.setAttribute('mood-emoji', matchingMoodEmoji);
        this.sliderRange.style.setProperty('--thumb-position', `${percentage}%`);
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
        this.sliderRange.style.setProperty('background-color', matchingColor);
    }
  
    // 5. Event handling in one place
    setupEventListeners() {
      this.sliderRange.addEventListener('input', (event) => {
        const moodValue = parseInt(event.target.value);
        this.moodValue = moodValue; // update the mood value
        this.handleSliderEmoji(moodValue);
        this.handleSliderBackgroundColor(moodValue);
        this.handleTickStyling(moodValue);
      });
    }
  }