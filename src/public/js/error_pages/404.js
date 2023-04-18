var times = parseInt(sessionStorage.getItem('_times404'));

function updateAndCheckTimes404() {
    if (isNaN(times)) {
        times = 0;
    }

    times++;
    times = String(times);

    sessionStorage.setItem('_times404', times);

    if (times >= 3) {
        var terminalDiv = document.getElementsByClassName('terminal');
        terminalDiv = terminalDiv[0];
        var outputNode = document.createElement('p');
        outputNode.classList = ['output'];
        outputNode.innerHTML =
            'Having problems? Try to <a href="/feedback">report a problem</a>';
        terminalDiv.appendChild(outputNode);
    }

    return true;
}

function resetTimes404() {
    sessionStorage.removeItem('_times404');

    return true;
}
