<script>
  import { onMount } from 'svelte';
  import { Link } from 'svelte-navigator';
  import routes from '../routes';
  import { call, Method } from '../http';
  import { events, sports } from '../store';

  let fetchingFinished = false;

  onMount(() =>
    Promise.all([call('/events', Method.GET), call('/sports', Method.GET)]).then(([eventsResponse, sportsResponse]) => {
      $events = eventsResponse;
      $sports = sportsResponse;
      fetchingFinished = true;
    }),
  );

  const ALL_SPORTS_KEY = 'ALL';
  let sport = ALL_SPORTS_KEY;

  let filteredEvents;
  $: filteredEvents = sport === ALL_SPORTS_KEY ? $events : $events.filter((event) => event.sport_id === sport);
</script>

{#if fetchingFinished}
  {#if $events.length > 0}
    <h1 class="text-center">Current events</h1>
    <label for="sport">Sport</label>
    <select class="form-control" name="sport" id="sport" bind:value={sport}>
      <option value={ALL_SPORTS_KEY}>All</option>
      {#each $sports as { title, id }}
        <option value={id}>{title}</option>
      {/each}
    </select>
    <ul>
      {#each filteredEvents as { id, title }}
        <li>
          <Link to={`events/${id}`}>
            {title}
          </Link>
        </li>
      {/each}
    </ul>
  {:else}
    <h1 class="text-center">No events at the moment</h1>
  {/if}
  <Link to={routes.NEW_EVENT}>Create event</Link>
{/if}
