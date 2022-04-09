<script>
  import { Router, Route } from 'svelte-navigator';
  import routes from './routes';
  import { spinner } from './store';
  import Events from './pages/Events.svelte';
  import Event from './pages/Event.svelte';
  import CreateEvent from './pages/CreateEvent.svelte';
</script>

{#if $spinner > 0}
  <div class="spinner-container">
    <div class="spinner spinner-border" />
  </div>
{/if}
<Router basepath="/">
  <Route path={routes.EVENTS} component={Events} />
  <Route path={routes.EVENT} component={Event} />
  <Route path={routes.NEW_EVENT} component={CreateEvent} />
  <Route path="*" component={Events} />
</Router>

<style>
  .spinner-container {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 7;
  }

  .spinner {
    height: 50px;
    width: 50px;
    position: absolute;
    top: 50%;
    left: 50%;
  }
</style>
