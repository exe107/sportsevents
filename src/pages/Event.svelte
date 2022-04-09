<script>
  import { useParams, useNavigate } from 'svelte-navigator';
  import { events, sports } from '../store';
  import { call, Method } from '../http';
  import FieldError from '../components/FieldError.svelte';
  import routes from '../routes';

  const navigate = useNavigate();
  const params = useParams();
  const eventId = parseInt($params.id);

  const event = $events.find((event) => event.id === eventId);
  let { title: eventTitle, players } = event;

  const { title: sportTitle } = $sports.find((sport) => sport.id === event.sport_id);

  let newPlayers = [];

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

    if (!eventTitle) {
      nameMessage = 'Please enter a name for the event';
      valid = false;
    }

    let playersMessages = newPlayers.map((player) => (player ? undefined : 'Please enter a name'));

    if (playersMessages.some((player) => player)) {
      valid = false;
    }

    if (valid) {
      const body = { title: eventTitle, players: newPlayers.map((player) => ({ name: player })) };
      call(`/events/${eventId}`, Method.PATCH, body).then(() => {
        navigate(routes.EVENTS);
      });
    } else {
      validationState = { name: nameMessage, players: playersMessages };
    }
  };
</script>

<h1 class="text-center">{eventTitle}</h1>
<h6>Sport: {sportTitle}</h6>
<label for="name">Name</label>
<input class="form-control mb-3" id="name" bind:value={eventTitle} />
<FieldError message={validationState.name} />
{#if players.length || newPlayers.length}
  <h6>Players:</h6>
{/if}
<ul>
  {#each players as { name }}
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
<button class="btn btn-success" on:click={saveEvent}>Save</button>
<button class="btn btn-primary" on:click={addPlayer}>Add player</button>
