<script>
  import { onMount } from 'svelte';
  import { useNavigate } from 'svelte-navigator';
  import { call, Method } from '../http';
  import routes from '../routes';
  import FieldError from '../components/FieldError.svelte';

  const navigate = useNavigate();

  let validationState = {};

  let sports = [];
  let name = '';
  let sport = undefined;

  onMount(() => {
    call(`/sports`, Method.GET).then((response) => {
      sports = response;
    });
  });

  const submitForm = () => {
    let valid = true;

    let nameMessage;

    if (!name) {
      nameMessage = 'Please enter a name';
      valid = false;
    }

    let sportMessage;

    if (!sport) {
      sportMessage = 'Please choose a sport';
      valid = false;
    }

    if (valid) {
      const body = { title: name, sport_id: sport };

      call('/events', Method.POST, body).then(() => {
        navigate(routes.EVENTS);
      });
    } else {
      validationState = { name: nameMessage, sport: sportMessage };
    }
  };
</script>

<h1 class="text-center">Create event</h1>
<form class="w-75 mx-auto">
  <div class="form-group mb-3">
    <label for="name">Name</label>
    <input class="form-control" name="name" id="name" bind:value={name} />
    <FieldError message={validationState.name} />
  </div>
  <div class="form-group mb-3">
    <label for="sport">Sport</label>
    <select class="form-control" name="sport" id="sport" bind:value={sport}>
      {#each sports as { title, id }}
        <option value={id}>{title}</option>
      {/each}
    </select>
    <FieldError message={validationState.sport} />
  </div>
  <button class="btn btn-primary" on:click|preventDefault={submitForm}>Create</button>
</form>
