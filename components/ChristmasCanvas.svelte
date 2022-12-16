<script lang="ts">
  //   import { useEffect, useMemo, useRef, useState } from "react";
  //   import ColorPicker from "./colorpicker/ColorPicker";
  import Socket from "socket.io-client";
  import { onMount } from "svelte";

  export let mockImage;
  const [canvasx, canvasy] = [960, 960];
  let canvas;
  let inputColor = "#FF0000";
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
        drawPixel(x, y, inputColor);
        socket.emit("pixelsend", { x, y, color: inputColor });
      });
    }
  }
</script>

<div class="page">
  <canvas bind:this={canvas} id="canvas" />
  <!-- <ColorPicker color={"#FF0000"} {inputColor} {setInputColor} /> -->
</div>

<style>
  .page {
    display: flex;
    flex-direction: row;
    gap: 40px;
  }
</style>
