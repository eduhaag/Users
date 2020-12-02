let allUsers = [];
let filteredUsers =[];

let valueToSearch='';

let inputUser = null;
let searchButton = null;
let usersFiltred = null
let statisticContent = null

window.addEventListener('load', ()=> {
  inputUser = document.querySelector('#input-critery');
  searchButton = document.querySelector('#button-search');
  usersFiltred = document.querySelector('#users');
  statisticContent = document.querySelector('#statistic');
  spans = Array.from(document.querySelectorAll('span'));

  searchButton.addEventListener('click', search);

  preventFormSubmit();
  handleInputEvent();
  fetchUsers();
  search();
});

function preventFormSubmit(){
  const form = document.querySelector('form');
  form.addEventListener('submit', (event)=>{
    event.preventDefault();
  })
};

function handleInputEvent(){
  inputUser.addEventListener('keyup', (event)=>{
    const hasText =!!event.target.value && event.target.value.trim()!=='';

    if(!hasText){
      event.target.value='';
      valueToSearch=null
      searchButton.setAttribute('disabled', 'disabled');
      search();
      return;
    };

    if(hasText){
      searchButton.removeAttribute('disabled');
      valueToSearch=event.target.value;
    };

    if (event.key==="Enter"){
      search();
    };
  })
};

async function fetchUsers(){
  const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const jsonUsers = await res.json();
  
  allUsers= jsonUsers.results.map(user=>{
    const {name, picture, dob, gender} = user;
    return {
      name: `${name.first} ${name.last}`,
      picture: picture.thumbnail,
      age: dob.age,
      gender,
    };
  });

  console.log(allUsers);

};

function search(){
    filteredUsers = allUsers.filter((user)=>{
    return user.name.toLowerCase().indexOf(valueToSearch.toLowerCase()) > -1;
  });

  if (filteredUsers.length===0){
    statistic();
    return;
  }

  let listHTML = `
    <h4>${filteredUsers.length} usuário(s) encontrado(s)</h4>
    <ul>
  `;

  filteredUsers.forEach(user=>{
    const {name, age, picture} = user;

    const userHTML = `
      <li>
        <img src="${picture}" />
        ${name}, ${age} anos
      </li>
    `;

    listHTML += userHTML;
  })

  listHTML += '</ul>';

  usersFiltred.innerHTML = listHTML;
  statistic();
}

function statistic(){
  if (filteredUsers.length===0){
    usersFiltred.innerHTML=`
      <span>Nenhum usuário filtrado</span>
    `;
    statisticContent.innerHTML=`
      <span>Nada a ser exibido</span>
    `
    return;
  }

  const stats =  filteredUsers.reduce(({male, female, ages}, user)=>{
    if(user.gender==='male'){
      male = male+1;
    }
    else{
      female = female+1;
    }
    ages += user.age;

    return {male, female, ages};
  },
  {
    male:0, 
    female: 0, 
    ages: 0
  });

  const statsHTML = `
    <h4>Estatísticas</h4>
    <ul>
      <li>Sexo masculino: ${stats.male}</li>
      <li>Sexo feminino: ${stats.female}</li>
      <li>Soma das idades: ${stats.ages}</li>
      <li>Média das idades: ${stats.ages/filteredUsers.length}</li>
    </ul>
  `;

  statisticContent.innerHTML = statsHTML;
}

