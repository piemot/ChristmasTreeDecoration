<script lang="ts">
  import { onMount } from "svelte";
  import ColorPicker from "svelte-awesome-color-picker";
  import Socket from "socket.io-client";

  let hex = "#ff0000";
  export let mockImage;
  const [canvasx, canvasy] = [960, 960];
  let canvas;

  type Pixel = { canvas: number; x: number; y: number; color: number };

  const socket = Socket((import.meta as any).env.VITE_BACKEND_URL);

  const drawPixel = (x: number, y: number, color: number) => {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.fillRect(10 * x, 10 * y, 10, 10);
  };
  onMount(() => {
    const ctx = canvas.getContext("2d");
    canvas.width = canvasx;
    canvas.height = canvasy;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    socket.on("currentgrid", (data: Pixel[]) => {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(mockImage, 0, 40, canvasx, canvasy);
      data.forEach((pixel) => {
        const { x, y, color } = pixel;
        drawPixel(x, y, color);
      });
    });
    socket.on("pixelupdate", (data: Pixel) => {
      const { x, y, color } = data;
      drawPixel(x, y, color);
    });
  });

  $: {
    if (canvas) {
      canvas.addEventListener("click", (e: PointerEvent) => {
        const x = Math.floor(e.offsetX / 10);
        const y = Math.floor(e.offsetY / 10);
        const color = parseInt(hex.slice(1), 16);

        drawPixel(x, y, color);
        socket.emit("pixelsend", { x, y, color });
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
