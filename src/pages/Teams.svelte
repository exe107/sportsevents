<script>
  import ArrowLeftRight from 'svelte-bootstrap-icons/lib/ArrowLeftRight';
  export let event;

  // const filterTeamPlayers = (team) => players.filter((player) => player.team_nr === team);
  let team1Players;
  $: team1Players = event.players.filter((player) => player.team_nr === 1);

  let team2Players;
  $: team2Players = event.players.filter((player) => player.team_nr === 2);
</script>

<div class="d-flex">
  <div>
    <h1>Team 1</h1>
    {#each team1Players as { name }}
      <div>
        <h2>{name} <ArrowLeftRight width={35} height={35} /></h2>
      </div>
    {/each}
  </div>
  <div class="vl mx-5" />
  <div>
    <h1>Team 2</h1>
    {#each team2Players as { name }}
      <div>
        <h2>{name} <ArrowLeftRight width={35} height={35} /></h2>
      </div>
    {/each}
  </div>
</div>

<style>
  .vl {
    border-left: 3px solid black;
    height: 325px;
  }
</style>
