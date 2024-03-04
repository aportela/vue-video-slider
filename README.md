# wc-vue-video-slider

vue web component for animating videos with a slider (can be used to simulate a 3d animation)

## showcase

![blender-cube-diorama](https://github.com/aportela/wc-vue-video-slider/assets/705838/71d3814c-55e4-4ddf-ad77-9ad8a502f760)

![Node.js](https://github.com/aportela/wc-vue-video-slider/actions/workflows/node.js.yml/badge.svg)

## TLDR (Use on your own HTML)

Download / unzip last build release and update your HTML:

- Include main script file

```
<script type="module" crossorigin src="/wc-vue-video-slider.min.js"></script>
```

- Include / customize main web component

```
<div style="width: 480px; margin: 64px auto;">
    <wc-vue-video-slider
    width="480"
    height="480"
    stream-source="blender-demo-cube-diorama.mp4"
    stream-mime-type="video/mp4"
    stream-fps="25"
    seek-on-mouse-move
    ></wc-vue-video-slider>
</div>
```

## Development

### Install

```
$ git clone https://github.com/aportela/wc-vue-video-slider.git

$ cd wc-vue-video-slider.git

$ npm install
```

### Build

```
$ npm run build
```

## Props

**width**: Number

    Description: Video native (pixels) width

**height**: Number

    Description: Video native (pixels) height

**poster**: String (optional)

    Description: Image to be shown while the video is downloading

**streamSource**: String

    Description: Video path

**streamMimeType**: String

    Description: Video mime type

**streamFps**: Number

    Description: Video fps (frames per second)

**streamRangeFrom**: Number (optional)

    Description: Video custom start range (second)

**streamRangeTo**: Number (optional)

    Description: Video custom end range (second)

**hideSlider**: Boolean (optional)

    Description: Hide slider control (default = false)

**seekOnMouseMove**: Boolean (optional)

    Description: Allow control video seeking on mouse over event (default = true)

**showDebugData**: Boolean (optional)

    Description: Show extra debug data (default = false)
