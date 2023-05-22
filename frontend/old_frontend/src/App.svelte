<script>
  import Leaderboard from './lib/leaderboard.svelte'
  import Game from './lib/game.svelte'
  ///let promise = getLeaderBoard();
  const res = [
	{
		username: "test",
		score: 10000
	},
	{
		username: "test",
		score: 10000
	},
	{
		username: "test",
		score: 10000
	},
	{
		username: "test",
		score: 10000
	}
	];
  
  async function getLeaderBoard() {
    const resp = await fetch('/api/leaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const res = await resp.json();
    if (resp.ok) {
			return res;
		} else {
			throw new Error("failed to get data from server");
		}
    
  }
</script>

<main class="container-fluid">
  <img class="rounded mx-auto" alt="shout ai logo" src="./images/shout_ai_logo.png" />
  <h1 class="txt-center">Welcome to SHOUT AI</h1>
  <Game />
  <section>
    <Leaderboard data={res}></Leaderboard>
    <!-- {#await promise}
	    <h2>...waiting</h2>
    {:then result}
      <Leaderboard data={result} />
    {:catch error}
	    <p style="color: red">whoops! something went wrong</p>
    {/await}-->

    </section>
</main>