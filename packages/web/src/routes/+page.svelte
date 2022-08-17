<script>
	async function handleFetch() {
		const url = `https://nyt-games-prd.appspot.com/svc/crosswords/v2/puzzle/daily-2021-11-11.json'`;

		const res = await fetch(url, {
			credentials: 'include'
			// headers: {
			// 	cookie: cookie
			// }
		});
		console.log(res);
	}
</script>

<button on:click={handleFetch}>fetch</button>
