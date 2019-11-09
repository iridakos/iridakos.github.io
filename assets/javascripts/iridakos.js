/*
 *  jquery.docout - v1.0.0
 *  jQuery plugin for producing document outline
 *  https://github.com/iridakos/jquery.docout#readme
 *
 *  Made by Lazarus Lazaridis
 *  Under MIT License
 */

;$(function() {
  $('[data-role="outline"]').docout();

  $('.ga-event-link').on('click', function() {
    var data = $(this).data();
    ga('send', 'event', data.eventCategory, data.eventAction, data.eventLabel);
  });

  $('.page-content img, .maximize').not('.no-maximize').on('click', function() {
    $('#image-modal .image').attr('src', $(this).attr('src'));
    $('#image-modal .modal-title').html($(this).attr('alt'));
    $('#image-modal').modal('show');
  });
});
