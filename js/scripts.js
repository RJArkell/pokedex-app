var pokemonRepository = (function () {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var $pokemonList = $('ul');
  var $modalContainer = $('#modal-container');

  function add(pokemon) {
    repository.push(pokemon);
  }

  function getAll() {
    return repository;
  }

  function addListItem(pokemon) {
    var $listItem = $('<li></li>');
    $pokemonList.append($listItem);
    var $pokeButton = $('<button class="btn btn-dark pokemon-list_item" data-toggle="modal" data-target="#PokeModal"></button>');
    $pokeButton.text(pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1));
    $pokeButton.addClass('button-style');
    $listItem.append($pokeButton);
    $pokeButton.on('click', function () {
      showDetails(pokemon);
    });
  }

  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      showModal(pokemon);
    });
  }

  function loadList() {
    return $.ajax(apiUrl, {dataType:'json'})
    .then(function(item) {
      $.each(item.results, function(index, item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function(error) {
      console.write(error);
    });
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
    .then(function(details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
      if (details.types.length == 2 ) {
        item.types = [details.types[0].type.name, details.types[1].type.name];
      } else {
			  item.types = [details.types[0].type.name];
		  }
    }).catch(function(error) {
      console.error(error);
    });
  }

  function showModal(item) {
    $("#name").text(item.name.charAt(0).toUpperCase() + item.name.slice(1));
    $("#img").attr('src',item.imageUrl);
    $("#height").text('Height: ' + item.height/10 + 'm');
    $("#weight").text('Weight: ' + item.weight/10 + 'kg');
    $("#type").text('Type: ' + item.types);
  }

  return {
    add: add,
    getAll: getAll,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
    addListItem: addListItem,
    showModal: showModal,
  };
})();

$(document).ready(function(){
    $('#pokemon-search').on('keyup', function(){
      var value = $(this).val().toLowerCase();
      $('.pokemon-list_item').filter(function(){
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
