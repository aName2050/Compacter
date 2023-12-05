var dropdownButton = document.querySelector('.dropdown-toggle');
var dropdownMenu = document.querySelector('.dropdown-list');

document.addEventListener('click', function (event) {
    var isClickInsideDropdown =
        dropdownButton.contains(event.target) ||
        dropdownMenu.contains(event.target);
    if (!isClickInsideDropdown) {
        dropdownMenu.style.display = 'none';
    }
});
