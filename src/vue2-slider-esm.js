const template = function () {
  return `
    <div v-if="stream && stream.source && stream.mimeType" poster="poster">
        <video ref="video" autobuffer preload="auto" :controls="showNativeVideoControls" @canplaythrough.once="onVideoLoaded" @seeking="onVideoSeeking" @seeked="onVideoSeeked" @mousemove="onMouseMoveOverVideo">
            <source :src="stream.source" :type="stream.mimeType">
        </video>
        <input style="width: 100%;" type="range" min="0" :max="totalFrames" step="1" v-model="currentFrameIndex" v-if="! hideSlider">
        <div v-if="showDebugData">
            <slot name="debug" v-bind:currentFrameIndex="currentFrameIndex" v-bind:totalFrames="totalFrames" v-bind:fps="fps || defaultFPS" v-bind:seeking="seeking" v-bind:currentTime="currentTime" v-bind:duration="duration">
                <p>Frame {{ currentFrameIndex }}/{{ totalFrames }} frames (video fps: {{ this.fps || defaultFPS }}) <span class="has-text-white has-background-black" v-show="seeking">[ => SEEKING <= ]</span></p>
                <p>Current time / Duration: [{{ currentTime }} / {{ duration }}] seconds</p>
            </slot>
        </div>
    </div>
    `;
};

export default {
  name: "video-slider",
  template: template(),
  data: function () {
    return {
      loadComplete: false,
      duration: 0,
      totalFrames: 0,
      currentTime: 0,
      currentFrameIndex: 0,
      seeking: false,
      defaultFPS: 25,
    };
  },
  props: [
    "width",
    "height",
    "fps",
    "poster",
    "stream",
    "showNativeVideoControls",
    "autoPlay",
    "hideSlider",
    "seekOnMouseMove",
    "showDebugData",
  ],
  watch: {},
  methods: {
    onVideoLoaded: function (e) {},
    onVideoSeeking: function (e) {},
    onVideoSeeked: function (e) {},
    onMouseMoveOverVideo: function (e) {},
  },
};
