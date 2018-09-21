var clockwork = clockwork || {
    init: function () {
        clockwork.getAllQueriedTimes();
        document.getElementById("get-time").onclick = clockwork.addCurrentTime;
    },
    addCurrentTime: function () {
        var xhttp = new XMLHttpRequest(),
            selectedTimeZone = document.getElementById("timezone-id").value;
        xhttp.onload = function () {
            if (this.readyState === 4 && this.status === 200) {
                clockwork.getAllQueriedTimes();
            } else {
                alert("There was an error");
            }
        };
        xhttp.open("POST", "http://127.0.0.1:5000/api/currenttime", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(selectedTimeZone));
    },
    getAllQueriedTimes: function () {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //remove all time displays
                var myNode = document.getElementById("queried-times");
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.firstChild);
                }

                var response = JSON.parse(xhttp.responseText);
                for (var i = 0; i < response.length; i++) {
                    clockwork.appendTimeDisplay(response[i]);
                }
            }
        };
        xhttp.open("GET", "http://127.0.0.1:5000/api/currenttime", true);
        xhttp.send();
    },
    appendTimeDisplay: function (queriedTime) {
        var div = document.createElement("div");
        div.className = "col-sm-12 col-md-6 col-lg-4 time-display";

        var para = document.createElement("p");
        var node = document.createTextNode("Id: " + queriedTime.currentTimeQueryId);
        para.appendChild(node);
        div.appendChild(para);

        para = document.createElement("p");
        node = document.createTextNode("Request IP: " + queriedTime.clientIp);
        para.appendChild(node);
        div.appendChild(para);

        para = document.createElement("strong");
        node = document.createTextNode(queriedTime.timeZoneId);
        para.appendChild(node);
        div.appendChild(para);

        para = document.createElement("p");
        node = document.createTextNode((new Date(queriedTime.time)).toLocaleString());
        para.appendChild(node);
        div.appendChild(para);

        para = document.createElement("strong");
        node = document.createTextNode("Greenwich Mean Time");
        para.appendChild(node);
        div.appendChild(para);

        para = document.createElement("p");
        node = document.createTextNode((new Date(queriedTime.utcTime)).toLocaleString());
        para.appendChild(node);
        div.appendChild(para);

        var element = document.getElementById("queried-times");
        element.appendChild(div);
    }
};

clockwork.init();