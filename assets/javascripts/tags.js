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

  var showMissingTag = function(query) {
    var $header = $('body').find('h1');

    $header.html('tags');

    if (query != undefined) {

    }
  }

  var fetchResults = function(query) {
    if (window.tagData != undefined) {
      tagData(query);
    } else {
      $.getJSON('/feed.json', function(data) {
        window.tagData = data;
        tagData(query);
      });
    }
  };

  var tagData = function(query) {
    var $results = $('.tag-results'),
        found = false;

    $results.html('');

    $.each(window.tagData, function(a,b){
      var match = b.tags.join(' ').match(query);

      if (match != null) {
        found = true;
        createResult(b);
      }
    });

    if (!found) {
      showMissingTag(query);
    }
  };

  var createResult = function (searchResult) {
    var $results = $('.tag-results');

    var $container = $('<div class="post"></div>'),
    $title = $('<div class="post-title"></div>'),
    $link = $('<a href="' + searchResult.url + '">' + searchResult.title + '</a>')
    $meta = $('<div class="post-metadata"><div class="post-date" title="published on">' + searchResult.date + '</div> @ <div class="post-category" title="at category">' + searchResult.categories + '</div></div>'),
    $preview = $('<div class="post-preview">' + htmlDecode(searchResult.description) + '</div>');

    if (searchResult.tags.length > 0) {
      var tagsContainer = $('<div class="post-tags"></div>');
      tagsContainer.append($('<span class="important">tags: </span>'));

      $.each(searchResult.tags, function(i, tag) {
        tagsContainer.append($('<a href="/tags/?tag='+ tag + '" class="ga-event-link" data-event-label="' + tag + '" data-event-action="click" data-event-category="tags">' + tag + '</a>'));
        if (i < searchResult.tags.length - 1) {
          tagsContainer.append("<span> - </span>");
        }
      });

      $preview.append(tagsContainer);
    }

    $container.append($meta).append($title.append($link)).append($preview);
    $results.append($container);
    $results.append($('<hr class="separator">'));
  }

  var updateHeader = function (tag_name) {
    var $header = $('body').find('h1');

    $header.html('tag: ' + tag_name);
    document.title = document.title + ' - ' + tag_name
  }

  var query = getUrlParameter('tag');

  if (query != undefined) {
    updateHeader(query);
    fetchResults(query);
  } else {
    showMissingTag(query);
  };
});
