import { defineCustomElement } from 'vue'

import wcVueVideoSlider from './VueVideoSlider.ce.vue'

const wcVueVideoSliderComponent = defineCustomElement(wcVueVideoSlider);

customElements.define('wc-vue-video-slider', wcVueVideoSliderComponent)
