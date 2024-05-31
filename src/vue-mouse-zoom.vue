<script lang="ts" setup>
import { watchEffect } from 'vue';
import { ref, nextTick } from 'vue';
interface Props {
  /**
   * @default 1
   */
  zoom?: number;
  /**
   * @default 0.05
   */
  minZoom?: number;
  /**
   * @default 4
   */
  maxZoom?: number;
  /**
   * @default true
   */
  isCenter?: boolean;
  /**
   * @default true
   */
  isDraggable?: boolean;
  zoomHandle?: (e: WheelEvent, preScale: number) => number;
}

const section = ref<null | HTMLDivElement>(null);
const container = ref<null | HTMLDivElement>(null);
const style = ref('');

const emit = defineEmits<{
  (name: 'onZoomUpdate', scale: number): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  isCenter: true,
  minZoom: 0.05,
  maxZoom: 4,
  zoom: 1,
  isDraggable: true,
  zoomHandle: ({ deltaY }, s) => Math.min(Math.max(0.05, deltaY > 0 ? s - 0.05 : s + 0.05), 4),
});

let scale = 1,
  preScale = 1,
  x = 0,
  y = 0;
const getOffset = (element: HTMLElement | null, type: 'offsetTop' | 'offsetLeft') => {
  let offset = 0;
  while (element) {
    offset += element[type];
    element = element.offsetParent as HTMLElement;
  }
  return offset;
};
/**
 * 处理在画布中间的情况
 */
const handleCenter = async (cur: number, pre: number) => {
  if (container.value) {
    let { width, height } = container.value!.getBoundingClientRect()!;
    let { x: x1, y: y1, width: w1, height: h1 } = section.value!.getBoundingClientRect()!;
    const center = {
      x: x1 + w1 / 2,
      y: y1 + h1 / 2,
    };
    const offsetLeft = getOffset(container.value, 'offsetLeft');
    const offsetTop = getOffset(container.value, 'offsetTop');
    // 通过点击缩放倍率缩放时先将元素放置到页面中间然后再缩放
    x -= center.x - (width / 2 + offsetLeft);
    y -= center.y - (height / 2 + offsetTop);
    updateDom(pre, x, y);
    preScale = scale = cur;
    await nextTick();
    zooming(cur, pre, width / 2 + offsetLeft, height / 2 + offsetTop);
  }
};
/**
 * 处理一般情况
 */
const handlePlain = (zoom: number) => {
  if (container.value) {
    // let { x: x1, y: y1, width: w1, height: h1 } = section.value!.getBoundingClientRect()!;
    let { x, y } = container.value!.getBoundingClientRect()!;
    zooming(zoom, scale, x, y);
    preScale = scale = zoom;
  }
};

watchEffect(async () => {
  if (props.zoom !== scale) {
    await nextTick();
    const zoom = Math.min(Math.max(props.minZoom, props.zoom), props.maxZoom);
    props.isCenter ? handleCenter(zoom, scale) : handlePlain(zoom);
  }
});
const updateDom = (scale: number, offsetX: number, offsetY: number) => {
  style.value = `transform: matrix(${scale}, 0, 0, ${scale}, ${offsetX}, ${offsetY})`;
};
/**
 *
 * @param scale 当前的缩放倍数
 * @param preScale 上次缩放倍数
 * @param clientX 当前缩放中心点x
 * @param clientY 当前缩放中心点y
 */
const zooming = (scale: number, preScale: number, clientX: number, clientY: number) => {
  // 缩放倍率
  const ratio = scale / preScale;
  let { x: x1, y: y1 } = section.value!.getBoundingClientRect()!;
  x += (clientX - x1) * (1 - ratio);
  y += (clientY - y1) * (1 - ratio);
  updateDom(scale, x, y);
};
const start = {
  x: 0,
  y: 0,
};
const end = {
  x,
  y,
};
const isWheel = ref(false);
let timer: number;
const onWheel = async (e: WheelEvent) => {
  const { clientX, clientY, ctrlKey, metaKey, deltaY, deltaX } = e;
  e.preventDefault();
  if (timer) {
    clearTimeout(timer);
  }
  isWheel.value = true;
  if (ctrlKey || metaKey) {
    scale = props.zoomHandle(e, scale);
    zooming(scale, preScale, clientX, clientY);
    preScale = scale;
    emit('onZoomUpdate', scale);
  } else if (props.isDraggable) {
    x -= deltaX;
    y -= deltaY;
    updateDom(scale, x, y);
  }
  timer = setTimeout(() => {
    isWheel.value = false;
  }, 500);
};

let isMouseDown = false;
let isMoved = false;
const onMouseDown = (e: MouseEvent) => {
  if (e.button === 0) {
    isMouseDown = true;
    start.x = e.clientX;
    start.y = e.clientY;
  }
};

const onMouseMove = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  if (isMouseDown && props.isDraggable) {
    isMoved = true;
    isWheel.value = true;
    updateDom(scale, x + clientX - start.x, y + clientY - start.y);
    end.x = x + clientX - start.x;
    end.y = y + clientY - start.y;
  }
};
const onMouseUpOrLeave = () => {
  if (isMouseDown) {
    isMouseDown = false;
    if (isMoved) {
      isMoved = false;
      isWheel.value = false;
      x = end.x;
      y = end.y;
    }
  }
};
</script>

<template>
  <div
    class="container"
    style="width: 100%; height: 100%; overflow: hidden; overscroll-behavior-x: none"
    @wheel.capture="onWheel"
    @mousedown="onMouseDown"
    @mouseup="onMouseUpOrLeave"
    @mousemove="onMouseMove"
    @mouseleave="onMouseUpOrLeave"
    @dragstart.capture.prevent.stop="() => {}"
    @dragover.capture.prevent.stop="() => {}"
    @drop.capture.prevent.stop="() => {}"
    @contextmenu.capture.prevent="() => {}"
    ref="container"
  >
    <section
      class="section"
      ref="section"
      style="
        width: max-content;
        transform-origin: 0 0 !important;
        -webkit-user-select: none; /* Chrome/Opera/Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE/Edge */
        user-select: none;
      "
      :style="style"
    >
      <slot :isWheel="isWheel" />
    </section>
  </div>
</template>

