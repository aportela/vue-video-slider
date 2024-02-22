<script setup lang="ts">

import { ref, defineProps, withDefaults, defineEmits, watch } from 'vue'
import type { Ref } from 'vue'

interface Props {
  poster?: string,
  streamSource: string,
  streamMimeType: string,
  streamFps: number,
  showNativeVideoControls?: boolean,
  hideSlider?: boolean,
  seekOnMouseMove?: boolean,
  showDebugData?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showNativeVideoControls: false,
  hideSlider: false,
  seekOnMouseMove: false,
  showDebugData: false
})

const emit = defineEmits<{
  (e: 'loaded', value: boolean): void
  (e: 'seeking', value: boolean): void
  (e: 'seeked', value: boolean): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const loadComplete: Ref<boolean> = ref(false)
const duration: Ref<number> = ref(0)
const totalFrames: Ref<number> = ref(0)
const currentTime: Ref<number> = ref(0)
const currentFrameIndex: Ref<number> = ref(0)
const seeking: Ref<boolean> = ref(false)
const defaultFPS = 25

watch(currentFrameIndex, (newValue: number) => {
  if (!seeking.value) {
    currentTime.value = Number((
      newValue / (props.streamFps || defaultFPS)
    ).toPrecision(3))
    if (videoRef && videoRef.value) {
      videoRef.value.currentTime = currentTime.value
    }
  }
})

function onVideoLoaded(e: any) {
  duration.value = e.target.duration;
  totalFrames.value = Math.ceil(
    duration.value * (props.streamFps || defaultFPS)
  );
  loadComplete.value = true
  emit('loaded', true)
}

function onVideoSeeking() {
  seeking.value = true
  emit('seeking', true)
}

function onVideoSeeked() {
  seeking.value = false
  emit('seeked', true)
}

function onMouseMoveOverVideo(e: any) {
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
      <slot name="debug" :currentFrameIndex="currentFrameIndex" :totalFrames="totalFrames" :fps="streamFps || defaultFPS"
        :seeking="seeking" :currentTime="currentTime" :duration="duration">
        <p>Frame {{ currentFrameIndex }}/{{ totalFrames }} frames (video fps: {{ streamFps || defaultFPS }}) <span
            class="has-text-white has-background-black" v-show="seeking">[ =&gt; SEEKING &lt;= ]</span> </p>
        <p>Current time / Duration: [{{ currentTime }} / {{ duration }}] seconds</p>
      </slot>
    </div>
  </div>
</template>

<style scoped></style>
