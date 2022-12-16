<script lang="ts">
  //   import { useEffect, useMemo, useRef, useState } from "react";
  //   import ColorPicker from "./colorpicker/ColorPicker";
  import Socket from "socket.io-client";
  import { onMount } from "svelte";
  import ColorPicker from "svelte-awesome-color-picker";

  let hex = "#ff0000";
  export let mockImage;
  const [canvasx, canvasy] = [960, 960];
  let canvas;
  const socket = Socket("https://christmassocket.flatypus.me");

  const drawPixel = (x: number, y: number, color: string) => {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(10 * x, 10 * y, 10, 10);
  };
  onMount(() => {
    const ctx = canvas.getContext("2d");
    canvas.width = canvasx;
    canvas.height = canvasy;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    socket.on("currentgrid", (data) => {
      console.log(data);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(mockImage, 0, 40, canvasx, canvasy);
      for (const loc in data) {
        const { x, y } = JSON.parse(loc);
        drawPixel(x, y, data[loc]);
      }
    });
  });

  $: {
    if (canvas) {
      canvas.addEventListener("click", (e) => {
        const x = Math.floor(e.offsetX / 10);
        const y = Math.floor(e.offsetY / 10);
        drawPixel(x, y, hex);
        socket.emit("pixelsend", { x, y, color: hex });
      });
    }
  }
</script>

<div class="page">
  <canvas bind:this={canvas} id="canvas" />
  <div>
    <div class="color-preview-box">
      <p>Color:&nbsp;</p>
      <div style="background-color: {hex}; width: 20px; height: 20px;" />
    </div>
    <ColorPicker bind:hex isOpen={true} isPopup={false} isInput={false} />
  </div>
</div>

<style>
  .page {
    display: flex;
    flex-direction: row;
    gap: 40px;
  }

  .color-preview-box {
    color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .color-preview-box > div {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    border: 2px;
    border-color: #fff;
  }
</style>
