async function getChannels() {
    const channelReq = fetch('');
    console.log;
}

function populateDropdown(items) {
    var dropdownMenu = document.querySelector('.dropdown-list');
    dropdownMenu.innerHTML = '';

    // Add search bar
    var searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('form-control', 'mb-2');
    searchInput.placeholder = 'Search';
    dropdownMenu.appendChild(searchInput);

    // Add dropdown items
    items.forEach(function (item) {
        var option = document.createElement('p');
        option.classList.add('dropdown-item');
        option.dataset.value = item.value;
        option.innerText = item.label;
        dropdownMenu.appendChild(option);
    });

    var searchInput = document.querySelector('.dropdown-list input');

    searchInput.addEventListener('input', function () {
        var filter = searchInput.value.toUpperCase();
        var dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(function (item) {
            if (item.textContent.toUpperCase().indexOf(filter) > -1) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

var dropdownButton = document.querySelector('.dropdown-toggle');
dropdownButton.addEventListener('click', function () {
    var dropdownMenu = document.querySelector('.dropdown-list');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
});
