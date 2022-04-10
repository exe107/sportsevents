<script>
  import ArrowLeftRight from 'svelte-bootstrap-icons/lib/ArrowLeftRight';
  import { call, Method } from '../http';
  import { events } from '../store';

  export let eventId;
  export let players;

  let playerId;
  let team1Players, team2Players;
  let selectPlayer, onSameTeam;

  $: {
    const filterTeamPlayers = (team) => players.filter((player) => player.team_nr === team);
    team1Players = filterTeamPlayers(1);
    team2Players = filterTeamPlayers(2);

    selectPlayer = (id) => () => {
      if (playerId) {
        call(`/events/${eventId}/swap`, Method.POST, { player_one_id: playerId, player_two_id: id }).then(
          (response) => {
            playerId = null;
            $events = $events.map((event) => (event.id === eventId ? response : event));
          },
        );
      } else {
        playerId = id;
      }
    };

    onSameTeam = (id1, id2) => {
      const player1 = players.find((player) => player.id === id1);
      const player2 = players.find((player) => player.id === id2);

      return player1.team_nr === player2.team_nr;
    };
  }
</script>

<div class="d-flex">
  <div class="w-50">
    <h1>Team 1</h1>
    {#each team1Players as { id, name }}
      <div class="d-flex justify-content-between">
        <h2>
          {name}
        </h2>
        <h2>
          <button class="btn btn-outline-secondary border-0 p-0" disabled={!!playerId && onSameTeam(playerId, id)}>
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
        <h2>
          {name}
        </h2>
        <h2>
          <button class="btn btn-outline-secondary border-0 p-0" disabled={!!playerId && onSameTeam(playerId, id)}>
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
