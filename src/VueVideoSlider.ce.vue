<template>
  <div v-if="streamSource && streamMimeType" poster="poster" :style="containerStyle">
    <video ref="videoRef" :width="width" :height="height" autobuffer preload="auto" :controls="showNativeVideoControls"
      @canplaythrough.once="onVideoLoaded" @seeking="onVideoSeeking" @seeked="onVideoSeeked"
      @mousemove="onMouseMoveOverVideo">
      <source :src="streamSource" :type="streamMimeType">
    </video>
    <input style="width: 100%" type="range" :min="range.fromFrame" :max="range.toFrame" step="1"
      v-model="currentFrameIndex" v-if="!hideSlider" :disable="!loadComplete">
    <div v-if="showDebugData">
      <slot name="debug" :currentFrameIndex="currentFrameIndex" :currentTime="currentTime" :videoData="videoData"
        :range="range" :seeking="seeking">
        <p>Resolution: {{ width }}x{{ height }} <span v-if="width != videoData.width || height != videoData.height">(video
            scaled from: {{ videoData.width }}x{{
              videoData.height }})</span> ({{ videoData.fps }} fps)</p>
        <p>Frame: {{ currentFrameIndex - range.fromFrame }} / {{ range.toFrame - range.fromFrame }}
          <span v-if="range.custom">(video real frame: {{ currentFrameIndex }} / {{ videoData.totalFrames }})</span>
          <span class="has-text-white has-background-black" v-show="seeking">(SEEKING)</span>
        </p>
        <p>Timeline second: {{ (currentTime - range.fromSecond).toPrecision(3) }} / {{ (range.toSecond -
          range.fromSecond).toPrecision(3) }}
          <span v-if="range.custom">(video real timeline second: {{ currentTime }} / {{ videoData.duration.toPrecision(3)
          }})</span>
        </p>
      </slot>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">

import { ref, withDefaults, watch } from 'vue'
import type { Ref } from 'vue'

interface Props {
  width: number,
  height: number,
  poster?: string,
  streamSource: string,
  streamMimeType: string,
  streamFps: number,
  streamRangeFrom?: number,
  streamRangeTo?: number,
  showNativeVideoControls?: boolean,
  hideSlider?: boolean,
  seekOnMouseMove?: boolean,
  showDebugData?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  streamRangeFrom: -1,
  streamRangeTo: -1,
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

interface VideoInfo {
  width: number,
  height: number,
  fps: number,
  duration: number,
  totalFrames: number
}

interface VideoFrameRange {
  custom: boolean,
  fromSecond: number,
  toSecond: number,
  totalSeconds: number,
  fromFrame: number,
  toFrame: number,
  totalFrames: number
}

const videoData: Ref<VideoInfo> = ref({ width: 0, height: 0, fps: 0, duration: 0, totalFrames: 0 })
const videoRef = ref<HTMLVideoElement | null>(null)

const loadComplete: Ref<boolean> = ref(false)
const seeking: Ref<boolean> = ref(false)

const currentTime: Ref<number> = ref(0)
const currentFrameIndex: Ref<number> = ref(0)

const range: Ref<VideoFrameRange> = ref({ custom: false, fromSecond: 0, toSecond: 0, totalSeconds: 0, fromFrame: 0, toFrame: 0, totalFrames: 0 })

const defaultFPS = 25

const containerStyle = "width: " + props.width + "px;"

watch(currentFrameIndex, (newValue: number) => {
  if (!seeking.value) {
    currentTime.value = Number((
      newValue / videoData.value.fps
    ).toPrecision(3))
    if (videoRef && videoRef.value) {
      videoRef.value.currentTime = currentTime.value
    }
  }
})

function onVideoLoaded(e: any) {
  if (videoRef && videoRef.value) {
    videoData.value = {
      width: videoRef.value.videoWidth,
      height: videoRef.value.videoHeight,
      fps: props.streamFps || defaultFPS,
      duration: e.target.duration,
      totalFrames: Math.ceil(e.target.duration * (props.streamFps || defaultFPS))
    }
  }
  if (props.streamRangeFrom <= 0 && props.streamRangeTo <= 0) {
    range.value = { custom: false, fromSecond: 0, toSecond: videoData.value.duration, totalSeconds: videoData.value.duration, fromFrame: 0, toFrame: videoData.value.totalFrames, totalFrames: videoData.value.totalFrames }
  } else {
    if (props.streamRangeFrom > 0 && props.streamRangeFrom < videoData.value.duration) {
      range.value.fromSecond = props.streamRangeFrom
      range.value.fromFrame = Math.ceil(range.value.fromSecond * (props.streamFps || defaultFPS))
      range.value.custom = true
    } else {
      range.value.fromSecond = 0
      range.value.fromFrame = 0
    }
    if (props.streamRangeTo > 0 && props.streamRangeTo <= videoData.value.duration) {
      range.value.toSecond = props.streamRangeTo
      range.value.toFrame = Math.ceil(range.value.toSecond * (props.streamFps || defaultFPS))
      range.value.custom = true
    } else {
      range.value.toSecond = videoData.value.duration
      range.value.toFrame = videoData.value.totalFrames
    }
    range.value.totalSeconds = range.value.toSecond - range.value.fromSecond
    range.value.totalFrames = range.value.toFrame - range.value.fromFrame
  }
  if (range.value.fromSecond > 0 && videoRef && videoRef.value) {
    currentFrameIndex.value = range.value.fromFrame
  }
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
      (x * range.value.totalFrames) / bounds.width
    ) + range.value.fromFrame
  }
}

</script>
