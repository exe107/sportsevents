<script>
  import { onDestroy } from 'svelte';
  import { useParams, useNavigate } from 'svelte-navigator';
  import XLg from 'svelte-bootstrap-icons/lib/XLg';
  import { events, sports } from '../store';
  import { call, Method } from '../http';
  import routes from '../routes';
  import { SPORT_ICON } from '../util';
  import FieldError from '../components/FieldError.svelte';
  import Teams from '../pages/Teams.svelte';

  const navigate = useNavigate();
  const params = useParams();
  const eventId = parseInt($params.id);

  let event;
  const unsubscribe = events.subscribe((store) => {
    event = store.find((event) => event.id === eventId);
  });

  onDestroy(unsubscribe);

  const { participants_number } = $sports.find((sport) => sport.id === event.sport_id);

  let newPlayers = [];

  let playerAdditionDisabled, showCreateTeamsButton;

  $: {
    playerAdditionDisabled = event.players.length + newPlayers.length === participants_number;
    showCreateTeamsButton = event.players.length === participants_number;
  }

  let validationState = {
    players: [],
  };

  const addPlayer = () => {
    newPlayers = [...newPlayers, ''];
  };

  const removeNewPlayer = (playerIndex) => () => {
    newPlayers = newPlayers.filter((player, index) => playerIndex !== index);
    validationState.players = validationState.players.filter((player, index) => playerIndex !== index);
  };

  const removeExistingPlayer = (playerId) => () => {
    call(`/events/${eventId}/players/${playerId}`, Method.DELETE).then((response) => {
      $events = $events.map((event) => (event.id === eventId ? response : event));
    });
  };

  const saveEvent = () => {
    let valid = true;

    let nameMessage;

    if (!event.title) {
      nameMessage = 'Please enter a name for the event';
      valid = false;
    }

    let playersMessages = newPlayers.map((player) => (player ? undefined : 'Please enter a name'));

    if (playersMessages.some((player) => player)) {
      valid = false;
    }

    if (valid) {
      const body = { title: event.title, players: newPlayers.map((player) => ({ name: player })) };
      call(`/events/${eventId}`, Method.PATCH, body).then(() => {
        navigate(routes.EVENTS);
      });
    } else {
      validationState = { name: nameMessage, players: playersMessages };
    }
  };

  const createTeams = () => {
    call(`/events/${eventId}/shuffle`, Method.GET).then((response) => {
      $events = $events.map((event) => (event.id === eventId ? response : event));
    });
  };
</script>

<div class="d-flex justify-content-center align-items-center">
  <img class="me-2" src={SPORT_ICON[event.sport_id]} height="30" />
  <h1>{event.title}</h1>
</div>
<div class="w-75 mx-auto">
  <label for="name">Name</label>
  <input class="form-control mb-3 disabled" id="name" bind:value={event.title} disabled={showCreateTeamsButton} />
  <FieldError message={validationState.name} />
  {#if event.teams_created}
    <Teams eventId={event.id} players={event.players} />
  {:else}
    {#if event.players.length || newPlayers.length}
      <h6>Players:</h6>
    {/if}
    <ul>
      {#each event.players as { id, name }}
        <li>
          <div class="d-flex">
            <h2>
              {name}
            </h2>
            <button class="btn btn-outline-danger border-0 p-0 ms-3" on:click={removeExistingPlayer(id)}>
              <XLg width={30} height={30} />
            </button>
          </div>
        </li>
      {/each}
    </ul>
    {#each newPlayers as player, index}
      <div class="d-flex align-items-baseline">
        <input class="form-control mb-3 me-3" placeholder="Player name" bind:value={player} />
        <button class="btn btn-danger text-white" on:click={removeNewPlayer(index)}>Remove</button>
      </div>
      <FieldError message={validationState.players[index]} />
    {/each}
  {/if}
  {#if showCreateTeamsButton}
    <button class="btn btn-primary" on:click={createTeams}>Create teams</button>
  {:else}
    <button class={`btn btn-primary ${playerAdditionDisabled ? 'disabled' : ''}`} on:click={addPlayer}
      >Add player</button
    >
    <button class="btn btn-success" on:click={saveEvent}>Save</button>
  {/if}
</div>
