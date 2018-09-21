var clockwork = clockwork || {
    init: function () {
        clockwork.getAllQueriedTimes();
    },
    addCurrentTime: function () {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log("Current time successfully added.");
            } else {
                alert("There was an error");
            }
        };
        xhttp.open("POST", "http://127.0.0.1:5000/api/currenttime", true);
        xhttp.send();
    },
    getAllQueriedTimes: function () {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(xhttp.responseText);
            }
        };
        xhttp.open("GET", "http://127.0.0.1:5000/api/currenttime", true);
        xhttp.send();
    }
};

clockwork.init();