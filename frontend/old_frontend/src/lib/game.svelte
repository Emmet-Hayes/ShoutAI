<script>
import { onMount } from 'old_frontend/node_modules/svelte/types/runtime';

let canvas;
onMount(() => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 100, 100);

});

</script>

<canvas
bind:this={canvas} 
width="300" 
height="300">
  SHOUT AI
</canvas>

