import { defineCustomElement } from 'vue'

import vueVideoSlider from './components/VueVideoSlider.vue'

const vueVideoSliderComponent = defineCustomElement(vueVideoSlider);

customElements.define('vue-video-slider', vueVideoSliderComponent)
