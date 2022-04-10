<script>
  import ArrowLeftRight from 'svelte-bootstrap-icons/lib/ArrowLeftRight';
  import { call, Method } from '../http';
  import { events } from '../store';

  export let eventId;
  export let players;

  let selectedPlayerId;
  let team1Players, team2Players;
  let selectPlayer, onSameTeam;

  let playerEditState = {};

  $: {
    const filterTeamPlayers = (team) => players.filter((player) => player.team_nr === team);
    team1Players = filterTeamPlayers(1);
    team2Players = filterTeamPlayers(2);

    selectPlayer = (id) => () => {
      if (selectedPlayerId) {
        call(`/events/${eventId}/swap`, Method.POST, { player_one_id: selectedPlayerId, player_two_id: id }).then(
          (response) => {
            selectedPlayerId = null;
            $events = $events.map((event) => (event.id === eventId ? response : event));
          },
        );
      } else {
        selectedPlayerId = id;
      }
    };

    onSameTeam = (id1, id2) => {
      const player1 = players.find((player) => player.id === id1);
      const player2 = players.find((player) => player.id === id2);

      return player1.team_nr === player2.team_nr;
    };
  }

  const editPlayer = (id, name) => () => {
    playerEditState = { ...playerEditState, [id]: name };
  };

  const handleKeyPress =
    (id) =>
    ({ key }) => {
      if (key === 'Escape') {
        playerEditState = { ...playerEditState, [id]: undefined };
      } else if (key === 'Enter') {
        call(`/events/${eventId}/players/${id}`, Method.PATCH, { name: playerEditState[id] }).then((response) => {
          $events = $events.map((event) => (event.id === eventId ? response : event));
          playerEditState = { ...playerEditState, [id]: undefined };
        });
      }
    };
</script>

<div class="d-flex">
  <div class="w-50">
    <h1>Team 1</h1>
    {#each team1Players as { id, name }}
      <div class="d-flex justify-content-between">
        {#if typeof playerEditState[id] === 'string'}
          <input class="form-control" bind:value={playerEditState[id]} on:keyup={handleKeyPress(id)} />
        {:else}
          <h2 on:click={editPlayer(id, name)}>
            {name}
          </h2>
        {/if}
        <h2>
          <button
            class="btn btn-outline-secondary border-0 p-0"
            disabled={(!!selectedPlayerId && onSameTeam(selectedPlayerId, id)) ||
              typeof playerEditState[id] === 'string'}
          >
            <ArrowLeftRight width={30} height={30} on:click={selectPlayer(id)} />
          </button>
        </h2>
      </div>
    {/each}
  </div>
  <div class="vl mx-5" />
  <div class="w-50">
    <h1>Team 2</h1>
    {#each team2Players as { id, name }}
      <div class="d-flex justify-content-between">
        {#if typeof playerEditState[id] === 'string'}
          <input class="form-control" bind:value={playerEditState[id]} on:keyup={handleKeyPress(id)} />
        {:else}
          <h2 on:click={editPlayer(id, name)}>
            {name}
          </h2>
        {/if}
        <h2>
          <button
            class="btn btn-outline-secondary border-0 p-0"
            disabled={(!!selectedPlayerId && onSameTeam(selectedPlayerId, id)) ||
              typeof playerEditState[id] === 'string'}
          >
            <ArrowLeftRight width={30} height={30} on:click={selectPlayer(id)} />
          </button>
        </h2>
      </div>
    {/each}
  </div>
</div>

<style>
  .vl {
    border-left: 3px solid black;
    height: 350px;
  }
</style>
