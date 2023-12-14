<script lang="ts">
  import ChristmasCanvas from "./components/ChristmasCanvas.svelte";
  let mockImage;
</script>

<main class="page">
  <ChristmasCanvas {mockImage} />
  <img alt="hidden" src="tree.png" on:load={(e) => (mockImage = e.target)} class="hidden-image" />
</main>

<style>
  .hidden-image {
    display: none;
  }

  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
