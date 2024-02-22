import { defineCustomElement } from 'vue'

import vueVideoSlider from './VueVideoSlider.vue'

const vueVideoSliderComponent = defineCustomElement(vueVideoSlider);

customElements.define('vue-video-slider', vueVideoSliderComponent)
