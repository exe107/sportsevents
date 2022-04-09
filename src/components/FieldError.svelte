<script>
  export let message;
</script>

{#if message}
  <div class="alert alert-danger">
    {message}
  </div>
{/if}
