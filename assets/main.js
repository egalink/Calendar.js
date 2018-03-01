
var CAL;

(function(w) {

    'use strict';

    var settings = {
        events: [
            {
                id : 1,
                datetime : "2018-01-26 10:30:15",
                title : "Event title.",
                description : "A brief description for the event.",
                status : 65
            },
            {
                id : 2,
                datetime : "2018-01-26 10:30:15",
                title : "Go for donuts.",
                description : "Go for donuts, before coding this plugin.",
                status : 0
            },
            {
                id : 3,
                datetime : "2018-01-30 13:00:00",
                title : "Feed the frogs.",
                description : "You must feed the dart-frogs. Today use vitamin supplement.",
                status : 0
            },
            {
                id : 4,
                datetime : "2018-01-26 10:30:15",
                title : "Got for donuts.",
                description : "Go for donuts, before coding this plugin.",
                status : 0
            },
            {
                id : 5,
                datetime : "2018-01-26 10:30:15",
                title : "Got for donuts.",
                description : "Go for donuts, before coding this plugin.",
                status : 0
            }
        ],
        onDayClick: function (el, date, events) {
            console.log(arguments);
            //assignEvents(events, document.getElementById('event-list'));

            if (events.length < 1) {
                //
            } else {
                //
            }
        }
    };

    var createEventBox = function (callback) {
        var eventBox = document.createElement("div");
            eventBox.classList = "event-box";
        var box = document.createElement("div");
            box.classList = "box";
            eventBox.appendChild(box);
        var eventBoxTitle = document.createElement("h2");
            eventBoxTitle.innerHTML = "Events";
            box.appendChild(eventBoxTitle)

        callback(box);
        document.body.appendChild(eventBox);
    };

    var assignEvents = function (events, ul) {
            ul.innerHTML = "";
        var li, h4, sp;
        for (var key in events) if (events.hasOwnProperty(key) === true) {
            //
            var data = events[key];
            var date = eventCal.dateParse(data.datetime);
            h4 = document.createElement("h4");
            li = document.createElement("li");
            sp = document.createElement("span");
            h4.innerHTML = (date.getMonth() +1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + " - " + data.title;
            sp.innerHTML = data.description;
            li.appendChild(h4);
            li.appendChild(sp);
            ul.appendChild(li);
        }

        return ul;
    };

    var calendar = new Calendar("#calendar", settings);
    CAL=calendar;
    /***/
})(window);
