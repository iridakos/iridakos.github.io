$(function() {
  var tagsConfiguration = $('[data-role="tags-configuration"]');

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
    if (window.tagData != undefined) {
      tagData(query);
    } else {
      var feed_url = tagsConfiguration.data('feed-url');
      $.getJSON(feed_url, function(data) {
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
      var str = b.tags.join('@')
      str = '@' + str + '@';
      var match = str.match('@' + query + '@');

      if (match != null) {
        found = true;
        createResult(b);
      }
    });
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
        tagsContainer.append($('<a href="/tags/?tag='+ tag + '" class="" >' + tag + '</a>'));
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

    if (tag_name != undefined) {
      $header.append(' - ' + tag_name);
    }
    document.title = document.title + ' - ' + tag_name
  }

  var query = getUrlParameter('tag');

  if (query != undefined) {
    updateHeader(query);
    fetchResults(query);
  };
});
