$(document).ready(function() {
  if (localStorage.getItem('bowlers_object') == null) {
    console.log('Creating local storage for the first time!')
    var bowlers_object = []
    localStorage.setItem('bowlers_object', JSON.stringify(bowlers_object))
    $("#help_modal").modal()
  } else {
    var retrieve_storage = JSON.parse(localStorage.getItem('bowlers_object'))
    console.log('Retrieved storage: ', retrieve_storage)

    var populate_list = ''
    for (var i=0; i<retrieve_storage.length; i++) {
      populate_list += '<div class="checkbox"><label><input type="checkbox" value="' + retrieve_storage[i] + '">' + retrieve_storage[i] + '</label></div>'
    }
    $(populate_list).appendTo('.bowlers_list').fadeIn('slow')
  }
})

$('.edit_modal_btn').on('click', function() {
  $('.edit_table_body').children().remove()
  var retrieve_storage = JSON.parse(localStorage.getItem('bowlers_object'))
  var table_data = ''
  for (var i=0; i<retrieve_storage.length; i++) {
    table_data += '<tr><td>' + retrieve_storage[i] + '</td><td><a type="button" class="btn btn-success btn-xs rename">Rename</button></td><td><a type="button" class="btn btn-danger btn-xs delete">Delete</button></td></tr>'
  }
  $(table_data).appendTo('.edit_table_body')
})

$('#edit_modal').on('click', '.rename', function(event) {
  $name_column = $(event.currentTarget).parent().prev()
  current_name = $name_column.text()
  var new_name = prompt('Please enter a new name!', current_name)
  if (new_name.trim() != '') {
    $name_column.text(new_name)
  }
})

$('#edit_modal').on('click', '.delete', function(event) {
  $(event.currentTarget).closest('tr').remove()
})

$('.modal_save').on('click', function() {
  var updated_list = []
$('.edit_table_body tr').each(function() {
    updated_list.push($(this).find('td:first').text())
  })
  localStorage.setItem('bowlers_object', JSON.stringify(updated_list))
  location.reload()
})

$('.select_all').on('click', function(event) {
  if ($(event.currentTarget).val() == 'false') {
    selected_status = false
    $('#randomise').prop('disabled', false)
    $('.select_all').text('Unselect All')
  } else {
    selected_status = true
    $('#randomise').prop('disabled', true)
    $('.select_all').text('Select All')
  }

  $('input[type="checkbox"]').each(function() {
    $(this).prop('checked', !selected_status)
  })
  $(event.currentTarget).val(!selected_status)
})

function randomise() {
  $('.allocation_table').children().remove()

  var list_of_bowlers = []
  $('input[type="checkbox"]:checked').each(function() {
    list_of_bowlers.push(this.value)
  })
  if (!list_of_bowlers.length) {
    alert('No Bowlers!')
    return
  }
  var number_of_bowlers = list_of_bowlers.length

  number_of_lanes = $('#select_no_of_lanes').val()
  if (number_of_bowlers < number_of_lanes) {
    alert('There are fewer bowlers than selected lanes!')
    return
  }
  var current_lane = 1
  var allocation = []
  for (var i=0; i<=number_of_lanes; i++) allocation.push([])
  while (list_of_bowlers.length > 0) {
    if (current_lane > number_of_lanes) {
      current_lane = (current_lane % 2 === 0) ? 1 : 2
    }
    var index = Math.floor(Math.random() * list_of_bowlers.length)
    allocation[current_lane].push(list_of_bowlers[index])
    list_of_bowlers.splice(index, 1)
    current_lane += 2
  }

  var table_data = '<p>Total number of selected bowlers: <strong>' + number_of_bowlers + '</strong></p>'
  for (var i=1; i<allocation.length; i++) {
    if (i % 2 != 0) { table_data += '<div class="well">' }
    table_data += '<table class="table table-bordered"><thead><tr><th>Lane ' + i + '</th></tr></thead><tbody">'
    for (var j=0; j<allocation[i].length; j++) {
      table_data += '<tr><td>' + allocation[i][j] + '</td></tr>'
    }
    table_data += '</tbody></table>'
    if (i % 2 == 0) { table_data += '</div>' }
  }

  $(table_data).appendTo('.allocation_table').fadeIn('slow')

  $('html, body').animate({
    scrollTop: $("#randomise").offset().top
  }, 500);
}

$('#add_bowler').on('submit', function(event) {
  event.preventDefault()
  new_bowler = $(event.currentTarget).find('input.form-control').val().trim()
  if (new_bowler == '') {
    alert('Please type a bowler name!')
    return;
  }
  var retrieve_storage = JSON.parse(localStorage.getItem('bowlers_object'))
  retrieve_storage.push(new_bowler)
  retrieve_storage.sort()
  localStorage.setItem('bowlers_object', JSON.stringify(retrieve_storage))
  new_bowler_data = '<div class="checkbox"><label><input type="checkbox" value="' + new_bowler + '">' + new_bowler + '</label></div>'
  $(new_bowler_data).appendTo('.bowlers_list')
  $(event.currentTarget).find('input.form-control').val('')


  $('html, body').animate({
    scrollTop: $("#add_bowler").offset().top
  }, 500);
})

$('.bowlers_list').on('change', function() {
  var list_of_checked = []
  $('input[type="checkbox"]:checked').each(function() {
    list_of_checked.push(this.value)
  })
  if (list_of_checked.length == 0) {
    $('#randomise').prop('disabled', true)
  } else {
    $('#randomise').prop('disabled', false)
  }
})