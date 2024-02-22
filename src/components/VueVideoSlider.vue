<script setup lang="ts">

import { ref, defineProps, withDefaults, defineEmits, watch } from 'vue'
import type { Ref } from 'vue'

interface Props {
  width: number,
  height: number,
  fps: number,
  poster?: string,
  streamSource: string,
  streamMimeType: string,
  showNativeVideoControls?: boolean,
  hideSlider?: boolean,
  seekOnMouseMove?: boolean,
  showDebugData?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showNativeVideoControls: false,
  hideSlider: false,
  seekOnMouseMove: true,
  showDebugData: true
})

const emit = defineEmits<{
  (e: 'loaded', value: boolean): void
  (e: 'seeking', value: boolean): void
  (e: 'seeked', value: boolean): void
}>()

const videoRef = ref(null)
const loadComplete: Ref<boolean> = ref(false)
const duration: Ref<number> = ref(0)
const totalFrames: Ref<number> = ref(0)
const currentTime: Ref<number> = ref(0)
const currentFrameIndex: Ref<number> = ref(0)
const seeking: Ref<boolean> = ref(false)
const defaultFPS = 25

watch(currentFrameIndex, (newValue: number) => {
  if (!seeking.value) {
    currentTime.value = (
      newValue / (props.fps || defaultFPS)
    ).toPrecision(3)
    videoRef.value.currentTime = currentTime.value
  }
})

function onVideoLoaded(e: { target: { duration: any } }) {
  duration.value = e.target.duration;
  totalFrames.value = Math.ceil(
    duration.value * (props.fps || defaultFPS)
  );
  loadComplete.value = true
  emit('loaded', true)
}

function onVideoSeeking(e: any) {
  seeking.value = true
  emit('seeking', true)
}

function onVideoSeeked(e: any) {
  seeking.value = false
  emit('seeked', true)
}

function onMouseMoveOverVideo(e: { target: { getBoundingClientRect: () => any }; clientX: number }) {
  if (props.seekOnMouseMove) {
    const bounds = e.target.getBoundingClientRect()
    const x = e.clientX - bounds.left
    currentFrameIndex.value = Math.round(
      (x * totalFrames.value) / bounds.width
    )
  }
}

</script>

<template>
  <div v-if="streamSource && streamMimeType" poster="poster">
    <video style="style" ref="videoRef" autobuffer preload="auto" :controls="showNativeVideoControls"
      @canplaythrough.once="onVideoLoaded" @seeking="onVideoSeeking" @seeked="onVideoSeeked"
      @mousemove="onMouseMoveOverVideo">
      <source :src="streamSource" :type="streamMimeType">
    </video>
    <input style="width: 100%;" type="range" min="0" :max="totalFrames" step="1" v-model="currentFrameIndex"
      v-if="!hideSlider" :disable="!loadComplete">
    <div v-if="showDebugData">
      <slot name="debug" v-bind:currentFrameIndex="currentFrameIndex" v-bind:totalFrames="totalFrames"
        v-bind:fps="fps || defaultFPS" v-bind:seeking="seeking" v-bind:currentTime="currentTime"
        v-bind:duration="duration">
        <p>Frame {{ currentFrameIndex }}/{{ totalFrames }} frames (video fps: {{ fps || defaultFPS }}) <span
            class="has-text-white has-background-black" v-show="seeking">[ => SEEKING <= ]</span>
        </p>
        <p>Current time / Duration: [{{ currentTime }} / {{ duration }}] seconds</p>
      </slot>
    </div>
  </div>
</template>

<style scoped></style>
