<script lang="ts">
  import ChristmasCanvas from "../components/ChristmasCanvas.svelte";
  let mockImage;
</script>

<main>
  <ChristmasCanvas {mockImage} />
  <img
    alt="hidden"
    src="https://png2.cleanpng.com/dy/09f0df8216efaefa738e6f3f487cc95b/L0KzQYq3VME2N6Z5f5H0aYP2gLBuTgBweqVmet5uLX7ohMj2kvsub6NmiNpyY4Oweb7ohBUua5l3geV9bXH2PcX5hfUueJp9RadsYkS8SbK9hsA5OmQ7RqYAOEWzQ4qAUcU2PWQ4UagDNkm7RYK1kP5o/kisspng-portable-network-graphics-image-christmas-tree-pix-5cb499a6f08236.4585039715553396869851.png"
    on:load={(e) => (mockImage = e.target)}
    class="hidden-image"
  />
</main>

<style>
  .hidden-image {
    display: none;
  }
</style>
