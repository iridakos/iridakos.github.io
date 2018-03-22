$(function() {
  var htmlDecode = function (input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

  var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  };

  var fetchResults = function(query) {
    if (window.searchData != undefined) {
      searchData(query);
    } else {
      $.getJSON('/feed.json', function(data) {
        window.searchData = data;
        searchData(query);
      });
    }
  };

  var searchData = function(query) {
    var terms = query.split(' ').join('|'),
        regex = new RegExp(terms, 'i'),
        $results = $('.search-results');

    $results.html('');

    $.each(window.searchData, function(a,b){
      var target = [b.title, b.description, b.search_tags, b.tags, b.categories, b.tutorials].join(' ');
      var match = target.match(regex);

      if (match != null) {
        createResult(b);
      }
    });
  };

  var createResult = function (searchResult) {
    var $results = $('.search-results');

    var $container = $('<div class="post-container"></div>'),
    $title = $('<div class="post-title"></div>'),
    $link = $('<a href="' + searchResult.url + '">' + searchResult.title + '</a>')
    $meta = $('<div class="post-metadata"><small>' + searchResult.date + ' | ' + searchResult.categories + '</small></div>'),
    $preview = $('<div class="post-preview">' + htmlDecode(searchResult.description) + '</div>');

    $results.append($container.append($meta).append($title.append($link)).append($preview));
  }

  var query = getUrlParameter('query'),
      $searchButton = $('#search_button'),
      $searchForm =$('#search_form');

  $searchForm.on('submit', function(evt) {
    evt.preventDefault();
    evt.stopImmediatePropagation();

    var $self = $(this),
    $searchField = $('#search_field');

    window.searchData = undefined;

    if ($searchField.val()) {
      fetchResults($searchField.val());
    }
  });

  if (query != undefined) {
    $('#search_field').val(query);

    fetchResults(query);
  };
});
