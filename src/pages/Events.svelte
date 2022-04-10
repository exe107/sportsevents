<script>
  import { onMount } from 'svelte';
  import { Link } from 'svelte-navigator';
  import routes from '../routes';
  import { call, Method } from '../http';
  import { events, sports } from '../store';
  import { SPORT_ICON } from '../util';

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

  const getSportParticipants = (id) => {
    const matchedSport = $sports.find((sport) => sport.id === id);

    return matchedSport.participants_number;
  };
</script>

{#if fetchingFinished}
  <div class="w-75 mx-auto">
    {#if $events.length > 0}
      <h1 class="text-center">Current events</h1>
      <label for="sport">Sport</label>
      <select class="form-control mb-3" name="sport" id="sport" bind:value={sport}>
        <option value={ALL_SPORTS_KEY}>All</option>
        {#each $sports as { title, id }}
          <option value={id}>{title}</option>
        {/each}
      </select>
      {#each filteredEvents as { id, title, players, sport_id }}
        <div class="mb-3">
          <img src={SPORT_ICON[sport_id]} height="30" />
          <Link to={`events/${id}`}>
            {title}
          </Link>
          <div>Slots: ({players.length} / {getSportParticipants(sport_id)})</div>
        </div>
      {/each}
    {:else}
      <h1 class="text-center">No events at the moment</h1>
    {/if}
    <Link to={routes.NEW_EVENT}>Create event</Link>
  </div>
{/if}
