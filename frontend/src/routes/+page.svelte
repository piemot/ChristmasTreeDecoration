<script lang="ts">
  import ChristmasCanvas from "$lib/components/ChristmasCanvas.svelte";
  import tree from '$lib/assets/tree.png?url';

  async function loadMockImage() {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = function() {
        resolve(img);
      };
      img.src = tree;
    })
  }
</script>

<main class="page">
  {#await loadMockImage() then mockImage}
    <ChristmasCanvas {mockImage} />
  {/await}
</main>

<style>
  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
