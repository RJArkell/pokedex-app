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
    var $pokeButton = $('<button>');
    $pokeButton.text(pokemon.name);
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
    $modalContainer.html('');
    var $modal = $('<div class="modal"></div>');
    var $closeButtonElement = $('<button class="modal-close">Close</button');
    $closeButtonElement.on('click', function() {
      hideModal();
    })
    var $nameElement = $('<h1>');
    $nameElement.html(item.name);
    var $imageElement = $('<img src="' + item.imageUrl + '">');
    $imageElement.addClass('modal-img');
    var $heightElement = $('<p>' + item.height + 'm</p>');
    var $typesElement = $('<p>' + item.types+ '</p>');
    $modal.append($closeButtonElement);
    $modal.append($nameElement);
    $modal.append($imageElement);
    $modal.append($heightElement);
    $modal.append($typesElement);
    $modalContainer.append($modal);
    $modalContainer.addClass('is-visible');
  }

  function hideModal() {
    $modalContainer.removeClass('is-visible');
  }

  $(document).on('keydown', function(event)  {
    if (event.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
      hideModal();
    }
  });

  $modalContainer.on('click', function(event) {
    var target = event.target;
    if (event.target === this) {
      hideModal();
    }
  });

  return {
    add: add,
    getAll: getAll,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
    addListItem: addListItem,
    showModal: showModal,
    hideModal: hideModal
  };
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
