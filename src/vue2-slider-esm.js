const template = function () {
  return `
    <div v-if="stream && stream.source && stream.mimeType" poster="poster">
        <video ref="video" autobuffer preload="auto" :autoplay="autoPlay" :controls="showNativeVideoControls" @canplaythrough.once="onVideoLoaded" @seeking="onVideoSeeking" @seeked="onVideoSeeked" @mousemove="onMouseMoveOverVideo">
            <source :src="stream.source" :type="stream.mimeType">
        </video>
        <input style="width: 100%;" type="range" min="0" :max="totalFrames" step="1" v-model="currentFrameIndex" v-if="! hideSlider" :disable="! loadComplete">
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
  watch: {
    currentFrameIndex: function (newValue, oldValue) {
      if (!this.seeking) {
        this.currentTime = (
          newValue / (this.fps || this.defaultFPS)
        ).toPrecision(3);
        this.$refs.video.currentTime = this.currentTime;
      }
    },
  },
  methods: {
    onVideoLoaded: function (e) {
      this.duration = e.target.duration;
      this.totalFrames = Math.ceil(
        this.duration * (this.fps || this.defaultFPS)
      );
      this.loadComplete = true;
      this.$emit("loaded", e);
    },
    onVideoSeeking: function (e) {
      this.seeking = true;
      this.$emit("seeking", e);
    },
    onVideoSeeked: function (e) {
      this.seeking = false;
      this.$emit("seeked", e);
    },
    onMouseMoveOverVideo: function (e) {
      if (this.seekOnMouseMove) {
        const bounds = e.target.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        this.currentFrameIndex = Math.round(
          (x * this.totalFrames) / bounds.width
        );
      }
    },
  },
};
