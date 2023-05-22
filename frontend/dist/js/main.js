const tbody = document.querySelector('tbody');
const divlb = document.querySelector('#homeLB');
const lbheading = document.querySelector('#lbheading');
const error = document.createElement('h2');
//const loading = document.createElement('span')
//<span class="spinner-border spinner-border-sm"></span>
//loading.className= "spinner-border" ;
//load.className = "spinner-border-sm";


let data = null;
fetch('/api/leaderboard', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(function (response) {
          return response.json();
      })
    .then(function (data) {
        setUpSite(data);
     }).catch(function (error) {
        setUpSite([]);
     })

async function setData(){
      let resp = await fetch('/api/leaderboard', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
      if(resp.statusCode != 200){
        return ;
      }
      data = resp.json();
}

function setUpSite(apiData){
if(!apiData){
  error.innerText = "an error occured while getting data!"
  return;
}
data = apiData;
updateTable();
}

function updateTable(){
  /*lbheading.appendChild(loading)
  setTimeout(() => {
    lbheading.removeChild(loading);
  }, 4000);*/
let child = tbody.lastElementChild; 
while (child) {
  tbody.removeChild(child);
  child = tbody.lastElementChild;
}
for(let i = 0; i < data.length; i++) {
  let rank = i+1;
  let tr = document.createElement("tr");
  tbody.appendChild(tr)
  let tdRank = document.createElement("td");
  let tdUname = document.createElement("td");
  let tdScore = document.createElement("td");
  tdRank.innerText = rank ;
  tdUname.innerText = data[i].username ;
  tdScore.innerText = data[i].score ;
  tr.appendChild(tdRank);
  tr.appendChild(tdUname);
  tr.appendChild(tdScore);
  }
}

setInterval(setData, 15000);