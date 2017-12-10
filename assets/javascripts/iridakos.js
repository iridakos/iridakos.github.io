$(function() {
  $('img').on('click', function() {
    $('#image-modal .image').attr('src', $(this).attr('src'));
    $('#image-modal .modal-title').html($(this).attr('alt'));
    $('#image-modal').modal('show');
  });
});
