<script>
  
  //import { onMount } from 'svelte';
  export let data ;

    /*onMount(async() => {
    	console.log(data)
  	});*/
  async function saveScore(){
    fetch("/api/saveScore", {
    method: "POST",
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    },   
    body: JSON.stringify({
        username: "<script>alert(/'not good/')<//script>",
        score: 99999,
        isPlayer: true,
        rank: 12
    }) 
}).catch(err => {
    console.log(err);
})

}




</script>
<!-- <h2>Leader Board</h2>
<ol id="leaderboard">
   {#each data as player, idx}
		<li id={""+idx}> {player.username}: {player.score}</li>
	 {/each}

</ol>-->

<div class="wrapper">
	<div class="lboard_section">
		<div class="lboard_tabs">
			<div class="tabs">
				<ul>
					<li class="active" data-li="today">Leader Board</li>
				</ul>
			</div>
		</div>

		<div class="lboard_wrap">
			<div class="lboard_item today" style="display: none;">
        {#each data as player, idx}
            <div class="lboard_mem">
              <div class="name_bar">
                <p><span>{idx+1}.</span> {player.username}</p>
                <div class="bar_wrap">
                  <div class="inner_bar" style="width: 95%"></div>
                </div>
              </div>
              <div class="points">
                {player.score} points
              </div>
            </div>
          {/each}
			</div>
		</div>
	</div>
</div>	




<style>
ul {
	list-style-type: none;

}
.wrapper{
	width: 100%;
	height: 100%;
}

.lboard_section{
	width: 500px;
	height: 400px;
	margin: 100px auto 0;
	background: #f94f62;
	padding: 25px 40px;
	position: relative;
	border-radius: 5px;
}

.lboard_section .lboard_tabs ul{
	display: flex;
}

.lboard_section .lboard_tabs ul li{
	margin-right: 50px;
	font-size: 18px;
	font-weight: 600;
	color: #3a3d51;
	cursor: pointer;
}

.lboard_section .lboard_tabs ul li:hover,
.lboard_section .lboard_tabs ul li.active{
	color: #fff;
}

.lboard_wrap{
	position: absolute;
	top: 70px;
	left: 40px;
	background: #ffd300;
	width: 100%;
	height: 100%;
	border-radius: 5px;
}

.lboard_wrap .lboard_item{
	padding: 25px;
}

.lboard_wrap .lboard_mem{
	display: flex;
	align-items: center;
	padding: 15px 0;
	border-bottom: 1px solid #ffe773;
}

.lboard_wrap .lboard_mem:first-child{
	padding-top: 0;
}

.lboard_wrap .lboard_mem:last-child{
	padding-bottom: 0;
	border-bottom: 0;
}

.lboard_wrap .lboard_mem .img{
	width: 50px;
}

.lboard_wrap .lboard_mem img{
	display: block;
	width: 100%;
}

.lboard_wrap .lboard_mem .name_bar{
	margin: 0 20px;
	width: calc(100% - 150px);
}

.lboard_wrap .lboard_mem .name_bar p{
	color: #3a3d51;
}

.lboard_wrap .lboard_mem .name_bar p span{
	margin-right: 5px;
}

.lboard_wrap .lboard_mem .points{
	width: 100px;
	color: #3a3d51;
}

.lboard_wrap .lboard_mem .name_bar .bar_wrap{
	width: 100%;
	height: 5px;
	background: #0b0268;
	margin-top: 5px;
	border-radius: 5px;
	position: relative;
	overflow: hidden;
}
 
.lboard_wrap .lboard_mem .name_bar .bar_wrap .inner_bar {
	position: absolute;
	top: 0;
	left: 0;
	height: 5px;
	background: #fff;
	border-radius: 5px;
	border-top-right-radius: 0px;
	border-bottom-right-radius: 0px;
}
</style>
