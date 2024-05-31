<div align="center">
  <h1>Vue Mouse Zoom</h1>
</div>

<div align="center">

Vue3-based Vue scales and drags components according to mouse position.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/arco-design/arco-design/blob/main/LICENSE)
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/zhaoyuqiqi/mouse-zoom)

</div>

<div align="center">

English | [简体中文](./README.zh-CN.md)

</div>

# Demo

![demo](https://pic4.58cdn.com.cn/nowater/webim/big/n_v21530bf1669a945e193502b34065740bd.gif)

# Feature

## Zoomable

- Support to zoom according to the mouse position when the wheel is scrolling, which can zoom in on a certain point.
- Support for mac touchpad scaling.

## Draggable

- The components pan when the mouse wheel is scrolled, and the multi-directional translation effect can be carried out when mac uses the touchpad.
- The component can drag and drop when the left button is pressed.

## Support for Typescript

Components are written in TypeScript, so they are naturally type-friendly.

# Install

[npm package](https://www.npmjs.com/package/vue-mouse-zoom)

```bash
// npm
npm install vue-mouse-zoom

// yarn
yarn add vue-mouse-zoom

// pnpm
pnpm add vue-mouse-zoom
```

# Example

```typescript
<script setup lang="ts">
import { VueMouseZoom } from 'vue-mouse-zoom';
</script>

<template>
  <div style="width: 300px; height: 300px;">
    <VueMouseZoom>
      <img
        src="https://avatars.githubusercontent.com/u/68246760?v=4"
        style="width: 200px; height: 200px"
      />
    </VueMouseZoom>
  </div>
</template>

```

## Notice 📢

Nodes wrapped by the `VueMouseZoom` component must specify width and height, and may not use variable width and height such as `100% `!

# Props

| props        | Introduction                                                                                                                             | default                                     | required |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | -------- |
| zoom         | The magnification of the component zoom, which is limited by the values of `max- zoom` and `min- zoom` when rendering for the first time | 1                                           | false    |
| min-zoom     | Minimum magnification on first rendering                                                                                                 | 0.05                                        | false    |
| max-zoom     | The maximum scale of the first rendering                                                                                                 | 4                                           | false    |
| is-center    | Whether to center when rendering for the first time 中                                                                                   | true                                        | false    |
| is-draggable | Is dragging allowed?                                                                                                                     | true                                        | false    |
| zoom-handle  | The processing function when zooming, which returns a scale                                                                              | (e: WheelEvent, preScale: number) => number | false    |

# Slot

| name    | introduction                                                                           | params           | how to use                                                                                                                                                                            |
| ------- | -------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default | The default slot of the component, and the content will be placed inside the component | isWheel: boolean | When there is a performance problem in the process of scaling and dragging a component, you can use this parameter to remove the `dom` optimization performance within the component. |

# Event

| name           | introduction                                        | params       | how to use                                                    |
| -------------- | --------------------------------------------------- | ------------ | ------------------------------------------------------------- |
| on-zoom-update | This event is triggered when the zoom ratio changes | scale:number | The current magnification can be obtained based on this event |

# Browser compatibility

Consistent with `Vue3` support
