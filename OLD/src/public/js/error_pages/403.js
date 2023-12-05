var times = parseInt(sessionStorage.getItem('_times403'));

function updateAndCheckTimes403() {
    if (isNaN(times)) {
        times = 0;
    }

    times++;
    times = String(times);

    sessionStorage.setItem('_times403', times);

    if (times >= 3) {
        var terminalDiv = document.getElementsByClassName('terminal');
        terminalDiv = terminalDiv[0];
        var outputNode = document.createElement('p');
        outputNode.classList = ['output'];
        outputNode.innerHTML =
            'Still seeing this error? Try to <a href="/signout">sign out</a>';
        terminalDiv.appendChild(outputNode);
    }

    return true;
}

function resetTimes403() {
    sessionStorage.removeItem('_times403');

    return true;
}
