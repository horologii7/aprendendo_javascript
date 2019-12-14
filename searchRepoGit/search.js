var buttonElement = document.querySelector('button');
var inputElement = document.querySelector('input');
var listElement = document.querySelector('ul');
var nameElement = document.querySelector('h3');
var loadingElement = document.querySelector('h2');
var repositories = JSON.parse(localStorage.getItem('list_repositories')) || [];
var nameGithub = localStorage.getItem('name_github') || '';

function renderList() {
  loadingElement.innerHTML = '';
  listElement.innerHTML = '';
  nameElement.innerHTML = '';
  
  if (nameGithub !== '') {
   var nameText = document.createTextNode('Usuário: ' + nameGithub);
   nameElement.appendChild(nameText);
  }

  for (repository of repositories) {
    var repositoryElement = document.createElement('li');
    var respositoryText = document.createTextNode(repository);
    repositoryElement.appendChild(respositoryText);
    listElement.appendChild(repositoryElement);
  }
}

renderList();

buttonElement.onclick = function(){
  listElement.innerHTML = '';
  nameElement.innerHTML = '';
  loadingElement.innerHTML = 'Carregando...';
  axios.get('https://api.github.com/users/'+inputElement.value+'/repos')
  .then(function(response) {
    nameGithub = inputElement.value;
    repositories = [];

    for (res of response.data) {
      repositories.push(res.name);
      renderList();
    }

    saveInStorage();
  })
  .catch(function(error) {
    nameGithub = '';
    repositories = [];
    renderError();
    removeStorage();
  });
}

function renderError() {
  loadingElement.innerHTML = '';
  listElement.innerHTML = '';
  nameElement.innerHTML = 'Aconteceu um erro na requisição!';
}

function removeStorage() {
  localStorage.setItem('list_repositories', JSON.stringify([]));
  localStorage.setItem('name_github', '');
  inputElement.value = '';
}

function saveInStorage() {
  localStorage.setItem('list_repositories', JSON.stringify(repositories));
  localStorage.setItem('name_github', inputElement.value);
  inputElement.value = '';
}