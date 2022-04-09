<script>
  import { useParams, useNavigate } from 'svelte-navigator';
  import { events, sports } from '../store';
  import { call, Method } from '../http';
  import routes from '../routes';
  import FieldError from '../components/FieldError.svelte';
  import Teams from '../pages/Teams.svelte';

  const navigate = useNavigate();
  const params = useParams();
  const eventId = parseInt($params.id);

  const event = $events.find((event) => event.id === eventId);

  const { title: sportTitle, participants_number } = $sports.find((sport) => sport.id === event.sport_id);

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

  const removePlayer = (playerIndex) => () => {
    newPlayers = newPlayers.filter((player, index) => playerIndex !== index);
    validationState.players = validationState.players.filter((player, index) => playerIndex !== index);
  };

  const saveEvent = () => {
    let valid = true;

    let nameMessage;

    if (!event.eventTitle) {
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

<h1 class="text-center">{event.title}</h1>
<h6>Sport: {sportTitle}</h6>
<label for="name">Name</label>
<input class={`form-control mb-3 ${event.teams_created ? 'disabled' : ''}`} id="name" bind:value={event.title} />
<FieldError message={validationState.name} />
{#if event.teams_created}
  <Teams {event} />
{:else}
  {#if event.players.length || newPlayers.length}
    <h6>Players:</h6>
  {/if}
  <ul>
    {#each event.players as { name }}
      <li>{name}</li>
    {/each}
  </ul>
  {#each newPlayers as player, index}
    <div class="d-flex align-items-baseline">
      <input class="form-control mb-3 me-3" placeholder="Player name" bind:value={player} />
      <button class="btn btn-danger text-white" on:click={removePlayer(index)}>Remove</button>
    </div>
    <FieldError message={validationState.players[index]} />
  {/each}
{/if}
{#if showCreateTeamsButton}
  <button class="btn btn-primary" on:click={createTeams}>Create teams</button>
{:else}
  <button class={`btn btn-primary ${playerAdditionDisabled ? 'disabled' : ''}`} on:click={addPlayer}>Add player</button>
  <button class="btn btn-success" on:click={saveEvent}>Save</button>
{/if}
