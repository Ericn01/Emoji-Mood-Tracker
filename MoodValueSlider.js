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
    }
  
    // 3. Methods other code will use
    handleSliderEmoji(moodValue){
        const percentage = ((moodValue - this.minValue) / (moodValue - this.maxValue) * 100);
        const matchingMoodEmoji = this.moodMappings[moodValue]['emoji'];
        this.sliderRange.setAttribute('mood-emoji', matchingMoodEmoji);
        this.sliderRange.style.setProperty('--thumb-position', `${percentage}%`);
    }

    handleSliderTextDisplay(){
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
    
  
    // 4. DOM handling in one place
    render() {
      this.container.innerHTML = '';
      this.todos.forEach((todo, index) => {
        const div = document.createElement('div');
        div.textContent = todo.text;
        if (todo.done) div.style.textDecoration = 'line-through';
        this.container.appendChild(div);
      });
    }
  
    // 5. Event handling in one place
    setupEventListeners() {
      this.sliderRange.addEventListener('input', (event) => {
        const moodValue = event.target.value;
        this.moodValue = moodValue; // update the mood value
        this.handleSliderEmoji(moodValue);
        this.handleSliderTextDisplay();
      });
    }
  }