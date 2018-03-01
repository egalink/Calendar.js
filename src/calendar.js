
;(function(w) {

    'use strict';
 
    var _date = new Date(),
        _defaultD = _date.getDate(),
        _defaultM = _date.getMonth(),
        _defaultY = _date.getFullYear(),
        _defaults = {
            theme: 'calendar',
            i18n: {
                prevMonth : '<',
                nextMonth : '>',
                months    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                weekdays  : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            },
            events: [],
            weekOffset: 0,
            onDayClick: function (el, date, events) {}
        };

    /**
     * A native JS extend() function
     *
     * Returns a new object instead, preserving all of the original objects
     * and their properties. Supported back to IE6.
     *
     * All credits to author.
     * https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
     */
    var extend = function () {

        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // check if a deep merge
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]' ) {
            deep = arguments[0];
            i ++;
        }

        // merge the object into the extended object
        var merge = function (obj) {
            for (var prop in obj) if (Object.prototype.hasOwnProperty.call(obj, prop) === true) {
                // if deep merge and property is an object, merge properties
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]')
                    extended[prop] = extend(true, extended[prop], obj[prop]);
                else
                    extended[prop] = obj[prop];
            }
        };

        // loop through each object and conduct a merge
        for (i; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;
    };

    /**
     * Simple creation of an Element Node with the specified 'name'.
     *
     * @return HTML Element
     */
    function node(name) {
        return document.createElement(name || 'div');
    };

    /**
     * Returns the parent Element or Node from any other HTML Element.
     *
     * @return HTML Element
     */
    function parentElement (el) {
        return el.parentElement || el.parentNode;
    }

    /**
     * Pad a string to a certain length with another string.
     *
     * @return value (string)
     */
    function lpad (value, length, pad) {
        var p;
        if (typeof pad == 'undefined')
            pad = '0';
        for (var i = 0; i < length; i ++)
            p += pad;
        return (p + value).slice(-length);
    }

    /**
     * Create a unique number:
     *
     * @return string
     */
    function uniqueId(str) {
        return (str || '_') + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Regexp to find a className on a string.
     *
     * @return RegExp Obj
     */
    function classReg (className) {
        return new RegExp('(^|\\s+)' + className + '(\\s+|$)');
    }

    /**
     * Returns a Boolean value, indicating whether an element has
     * the specified class name.
     * 
     * Usage:
     *
     * var exists = containsClass(element, 'className');
     * 
     * @return bool
     */
    function containsClass (el, className) {
        var fn;
        if (document.documentElement.classList) {
            fn = function (el, className) { return el.classList.contains(className); }
        } else {
            fn = function (el, className) {
                if (! el || ! el.className)
                    return false;
                return el.className.match(classReg(className));
            }
        }
        return fn(el, className);
    };

    /**
     * Adds one or more class names to an element.
     * If the specified class already exist, the class will not be added.
     *
     * Usage:
     *
     * addClass(el, 'class1', 'class2', 'class3', ...);
     *
     * @return bool false|HTML Element
     */
    function addClass (el) {
        var fn;
        var classNames = arguments;
        if (classNames.length <= 1 || typeof el != 'object')
            return false;

        if (document.documentElement.classList)
            fn = function (el, classNames) {
                for (var i = 1; i < classNames.length; i ++) if (typeof classNames[i] == 'string') {
                    el.classList.add(classNames[i]);
                }
                return el;
            }
        else
            fn = function (el, classNames) {
                for (var i = 1; i < classNames.length; i ++) if (! containsClass(el, classNames[i]) && typeof classNames[i] == 'string') {
                    el.className += (el.className ? ' ' : '') + classNames[i];
                }
                return el;
            }

        return fn(el, classNames);
    };

    /**
     * Removes one or more class names from an element.
     * Note: Removing a class that does not exist, does NOT throw an error.
     *
     * Usage:
     *
     * removeClass(el, 'class1', 'class2', 'class3', ...);
     *
     * @return bool false|HTML Element
     */
    function removeClass (el) {
        var fn;
        var classNames = arguments;
        if (classNames.length <= 1 || typeof el != 'object')
            return false;
        
        if (document.documentElement.classList)
            fn = function (el, classNames) {
                for (var i = 1; i < classNames.length; i ++) if (typeof classNames[i] == 'string') {
                    el.classList.remove(classNames[i]);
                }
                return el;
            }
        else
            fn = function (el, classNames) {
                for (var i = 1; i < classNames.length; i ++) if (containsClass(el, classNames[i]) && typeof classNames[i] == 'string') {
                    el.className = el.className.replace(classReg(classNames[i]), '$2');
                }
                return el;
            }

        return fn(el, classNames);
    };

    /**
     * Toggles between a class name for an element.
     * 
     * Usage:
     *
     * var result = toggleClass(el, 'className');
     *
     * @return bool
     */
    function toggleClass (el, className) {
        var fn;
        if (document.documentElement.classList)
            fn = function (el, className) { return el.classList.toggle(className); }
        else
            fn = function (el, className) {
                var exists = containsClass(el, className);
                var caller = exists === true ? removeClass : addClass;
                    caller(el, className);
                return ! exists;
            }
        return fn(el, className);
    };

    /**
     * Add Event
     *
     * Attaches an event handler to the document.
     *
     * http://www.thecssninja.com/javascript/handleevent
     *
     * @param  {element}  element
     * @param  {event}    event
     * @param  {Function} fn
     * @param  {boolean}  bubbling
     * @return el
     */
    function addEvent (el, evt, fn, bubble) {
        if ('addEventListener' in el) {
            // BBOS6 doesn't support handleEvent, catch and polyfill:
            try {
                el.addEventListener(evt, fn, bubble);
            } catch (e) {
                if (typeof fn === 'object' && fn.handleEvent) {
                    el.addEventListener(evt, function (e) {
                        // bind fn as this and set first arg as event object:
                        fn.handleEvent.call(fn, e);
                    }, bubble);
                } else {
                    throw e;
                }
            }
        } else if ('attachEvent' in el) {
            // check if the callback is an object and contains handleEvent:
            if (typeof fn === 'object' && fn.handleEvent) {
                el.attachEvent('on' + evt, function () {
                    // bind fn as this:
                    fn.handleEvent.call(fn);
                });
            } else {
                el.attachEvent('on' + evt, fn);
            }
        }

        return el;
    };
        
    /**
     * Remove Event
     *
     * Removes an event handler that has been attached with the 'addEvent' method.
     *
     * http://www.thecssninja.com/javascript/handleevent
     *
     * @param  {element}  element
     * @param  {event}    event
     * @param  {Function} fn
     * @param  {boolean}  bubbling
     * @return el
     */
    function removeEvent (el, evt, fn, bubble) {
        if ('removeEventListener' in el) {
            try {
                el.removeEventListener(evt, fn, bubble);
            } catch (e) {
                if (typeof fn === 'object' && fn.handleEvent) {
                    el.removeEventListener(evt, function (e) {
                        fn.handleEvent.call(fn, e);
                    }, bubble);
                } else {
                    throw e;
                }
            }
        } else if ('detachEvent' in el) {
            if (typeof fn === 'object' && fn.handleEvent) {
                el.detachEvent('on' + evt, function () {
                    fn.handleEvent.call(fn);
                });
            } else {
                el.detachEvent('on' + evt, fn);
            }
        }

        return el
    };

    /**
     * Parse a valid 'Y-m-d' or 'Y-m-d H:i:s' date string to js Date Format.
     *
     * @return new Date | FALSE if date string is invalid.
     */
    function dateParser (str) {
        var regex1 = /^([0-9]{4}|[0-9]{2})[./-]([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])$/;
        var regex2 = /^([0-9]{4}|[0-9]{2})[./-]([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1]) (?:2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])$/;
        var isValidDate = regex1.test(str) || regex2.test(str);
        if (isValidDate)
            return new Date(str.replace(/[./-]/g, '/'));
        else
            return false;
    }

    /**
     * Check if a string would make a valid html ID.
     *
     * @return boolean
     */
    function isId(selector) {
        return /^(?:#([\w-]+))$/.test(selector);
    };

    /**
     * Check if a string would make a valid html className.
     *
     * @return boolean
     */
    function isCl(selector) {
        return /^(?:\.([\w-]+))$/.test(selector);
    };

    /**
     * Initialize the Calendar.js plugin.
     */
    function init (el, options) {
        
        var currDate = _date,
            // these variables are dynamic:
            currentD = _defaultD,
            currentM = _defaultM,
            currentY = _defaultY,
            // the variables are statics:
            presentD = _defaultD,
            presentM = _defaultM,
            presentY = _defaultY,
            // user defined options and defauls:
            settings = extend(true, _defaults, options);

        // first:
        // Assign a unique ID in each user defined events:
        for (var key in settings.events)
            if (settings.events.hasOwnProperty(key) === true) {
                settings.events[key].id = uniqueId(key);
            }

        /**
         * Mouse Event.
         *
         * Create a previous month calendar.
         */
        var prevMonthEvent = function () {
            if (currentM > 0) {
                currentM --;
            } else {
                currentM = 11;
                currentY --;
            }

            generate();
        };

        /**
         * Mouse Event.
         *
         * Create a current month calendar.
         */
        var currMonthEvent = function () {
            currentD = presentD,
            currentM = presentM,
            currentY = presentY,
            generate();
        };

        /**
         * Mouse Event.
         *
         * Create the next month calendar.
         */
        var nextMonthEvent = function () {
            if (currentM < 11) {
                currentM ++;
            } else {
                currentM = 0;
                currentY ++;
            }

            generate();
        };

        /**
         * Create the header element.
         *
         * Generates the previous month button, next month button and current
         * calendar month name and year.
         *
         * @return cBody
         */
        var createCalendarHeader = function (cBody) {
            var cHeader = addClass(node(), 'c-header');
            // create a previous month button:
            var cPrevButton = addClass(node('button'), 'c-button', 'c-button--prev');
                cPrevButton.type = 'button';
                cPrevButton.innerHTML = settings.i18n.prevMonth || '%lt;';
                cHeader.appendChild(addEvent(cPrevButton, 'click', prevMonthEvent));
            // set the current month name and year:
            var cMonth = addClass(node(), 'c-month');
                cMonth.innerHTML = settings.i18n.months[currentM] + ' ' + currentY;
                cHeader.appendChild(cMonth);
            // create a next month button:
            var cNextButton = addClass(node('button'), 'c-button', 'c-button--next');
                cNextButton.type = 'button';
                cNextButton.innerHTML = settings.i18n.nextMonth || '%gt;';
                cHeader.appendChild(addEvent(cNextButton, 'click', nextMonthEvent));
            cBody.appendChild(cHeader);
            return cBody;
        };

        /**
         * Create the calendar weekday names:
         *
         * @return cBody
         */
        var createCalendarWeekdays = function (cBody) {
            // establish the first day of week from config:
            var dayOfWeek = settings.weekOffset;
            var cWeekdays = addClass(node(), 'c-weekdays');

            if (dayOfWeek < 0)
                dayOfWeek = 0;

            for (var i = 0; i < 7; i ++) {    
                if (dayOfWeek > 6)
                    dayOfWeek = 0;
                var weekday = addClass(node(), 'c-weekday');
                    weekday.innerHTML = settings.i18n.weekdays[dayOfWeek] || ':weekdays:';
                // append weekday name to list:
                cWeekdays.appendChild(weekday);
                dayOfWeek ++;
            }

            cBody.appendChild(cWeekdays);
            return cBody;
        };

        /**
         * Check if a day has events.
         *
         * @return int
         */
        var checkIfDayHasEvents = function (day) {
            var numEvt = 0;
            var events = settings.events;
            if (events.length < 1) // if it has 0 events:
                return 0;
            for (var key in events) if (events.hasOwnProperty(key) === true) {
                // get the datetime in events:
                var datetime = dateParser(events[key].datetime);
                if (datetime === false) // check if datetime is correct:
                    continue;
                if (datetime.getDate() == day &&
                    datetime.getMonth() == currentM &&
                    datetime.getFullYear() == currentY) {
                        numEvt ++;
                    }
            } // endfor;

            return numEvt;
        };

        /**
         * Get all the events from a date if those exists.
         *
         * @return object
         */
        var getEventsFromDate = function (date) {
            date = dateParser(date);
            var i = 0;
            var object = [];
            var events = settings.events;
            if (events.length < 1 || date === false) // if it has 0 events or date is invalid:
                return object;

            for (var key in events) if (events.hasOwnProperty(key) === true) {
                // get the datetime in events:
                var datetime = dateParser(events[key].datetime);
                if (datetime === false) // check if datetime is correct:
                    continue;
                if (datetime.getDate() === date.getDate() &&
                    datetime.getMonth() === date.getMonth() &&
                    datetime.getFullYear() === date.getFullYear()) {
                        object[i ++] = events[key];
                    }
            } // endfor;

            return object;
        }

        /**
         * Bind a click event to a day.
         *
         * @return cDayNumber
         */
        var addEventOnDayClick = function (cDayNumber) {
            addEvent(cDayNumber, 'click', function (e) {
                e.preventDefault();
                var date = parentElement(e.target).getAttribute('data-date');
                settings.onDayClick(e.target, date, getEventsFromDate(date));
            });
            return cDayNumber;
        };

        /**
         * Create all each calendar days.
         *
         * @return cBody
         */
        var createAllCalendarDays = function (cBody) {
            // check if weekOffset is correct:
            var dayOfWeek = settings.weekOffset;
            if (dayOfWeek < 0 || dayOfWeek > 6)
                dayOfWeek = 0;
            
            // the container of all calendar days:
            var cDays = addClass(node(), 'c-days');

            // set the correct calendar day:
            var dayWhenTheMonthStarts = new Date(currentY, currentM, 1).getDay() - dayOfWeek;
            if (dayWhenTheMonthStarts < 0) {
                dayWhenTheMonthStarts = (dayWhenTheMonthStarts + 1) * -1;
                dayWhenTheMonthStarts = (6 - dayWhenTheMonthStarts);
                // xD
            }

            // get the last and previous date:
            var prevDate = new Date(currentY, currentM +0, 0);
            var lastDate = new Date(currentY, currentM +1, 0);
            var dayOfLastMonth = lastDate.getDate();
            var lastDayOfPreviousMonth = (prevDate.getDate() - dayWhenTheMonthStarts) +1;
            var day = 1;
            var dayOfNextMonth = 1;
            
            // if the date pints to a previous date:
            var addDayToPrevDate = function (cDay) {
                var previousDate = prevDate.getFullYear();
                    previousDate+= '-';
                    previousDate+= lpad(prevDate.getMonth() +1, 2);
                    previousDate+= '-';
                    previousDate+= lpad(lastDayOfPreviousMonth, 2);
                addClass(cDay, 'c-day--previous-month').setAttribute('data-date', previousDate);
                var cDayNumber = addClass(node('a'), 'c-day-number');
                    cDayNumber.href = '';
                    cDayNumber.innerHTML = lastDayOfPreviousMonth ++;
                    cDay.appendChild(addEventOnDayClick(cDayNumber));
            };
            // if the date points to a current date:
            var addDayToCurrDate = function (cDay) {
                // add day number:
                var currentDate = currentY;
                    currentDate+= '-';
                    currentDate+= lpad(currentM +1, 2);
                    currentDate+= '-';
                    currentDate+= lpad(day, 2);
                cDay.setAttribute('data-date', currentDate);
                var cDayNumber = addClass(node('a'), 'c-day-number');
                    cDayNumber.href = '';
                    cDayNumber.innerHTML = (day ++);
                    cDay.appendChild(addEventOnDayClick(cDayNumber));
            };
            // if the data points to a next date:
            var addDayToNextDate = function (cDay) {
                var nextDate = (currentM +1 >= 12) ? currentY +1 : currentY;
                    nextDate+= '-';
                    nextDate+= lpad((currentM +2 >= 13) ? '01' : currentM +2, 2);
                    nextDate+= '-';
                    nextDate+= lpad(dayOfNextMonth, 2);
                addClass(cDay, 'c-day--next-month').setAttribute('data-date', nextDate);
                var cDayNumber = addClass(node('a'), 'c-day-number');
                    cDayNumber.href = '';
                    cDayNumber.innerHTML = dayOfNextMonth ++;
                    cDay.appendChild(addEventOnDayClick(cDayNumber));
            };

            // generates each day of calendar:
            var createDay = function (cDay, i) {
                if (i < dayWhenTheMonthStarts) {
                    // if the date pints to a previous date:
                    addDayToPrevDate(cDay);
                } else if (day <= dayOfLastMonth) {
                    // if the date points to a current date:
                    if (day == presentD && currentM == presentM && currentY == presentY) {
                        addClass(cDay, 'c-day--today');
                    }
                    // check if exists events for this date:
                    var numEvents = checkIfDayHasEvents(day);
                    if (numEvents > 0) {
                        addClass(cDay, 'c-day--has-events').setAttribute('data-num-events', numEvents);
                    }
                    addDayToCurrDate(cDay);
                } else {
                    // if the data points to a next date:
                    addDayToNextDate(cDay);
                }

                return cDay;
            };

            for (var i = 0; i < 42; i ++) {
                var cDay = createDay(addClass(node('span'), 'c-day'), i);
                    cDays.appendChild(cDay);
            }

            return cBody.appendChild(cDays);
        };

        /**
         * Generates the calendar structure of events:
         *
         * @return void
         */
        var generate = function () {
            // remove all other child elements on instance:
            var children = el.childNodes;
            if (children) {
                for (var i = 0; i < children.length; i ++) el.removeChild(children[i]);
            }

            var cBody = addClass(node(), 'c-body');
            createCalendarHeader(cBody);
            createCalendarWeekdays(cBody);
            createAllCalendarDays(cBody);
       
            // add calendar to main container and show it:
            addClass(el, settings.theme || '').appendChild(cBody);
        };

        // assign prototypes:
        Calendar.prototype.nextMonth = nextMonthEvent;
        Calendar.prototype.prevMonth = prevMonthEvent;
        Calendar.prototype.currMonth = currMonthEvent;
        Calendar.prototype.dateParse = dateParser;

        /**
         * Add a user event to event list.
         *
         * @return void
         */
        Calendar.prototype.addEvents = function (object) {
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i ++) this.addEvents(arguments[i]);
            } else {
                if (! object.id)
                      object.id = uniqueId();
                settings.events.push(object);
            }

            generate();
        };

        /**
         * Get all user defined events or filter by a date.
         *
         * @return Object
         */
        Calendar.prototype.getEvents = function (date) {
            var events = (! date) ? settings.events : getEventsFromDate(date);
            return events;
        };

        /**
         * Remove a user-defined event from the calendar by
         * passing the event ID as a parameter.
         *
         * @return Object
         */
        Calendar.prototype.removeEvent = function (id) {
            if (! id)
                return false;
            var i = 0;
            var object = [];
            var events = settings.events;
            for(var key in events) if (events.hasOwnProperty(key) === true) {
                if (events[key].id == id)
                    continue;
                object[i ++] = events[key];
            }

            settings.events = object;
            generate();
        };

        /**
         * Assign new function to "onDayClick" event.
         *
         * @return void
         */
        Calendar.prototype.onDayClick = function (callback) {
            if (typeof callback === 'function')
                settings.onDayClick = callback;
        };

        generate();
    };

    /**
     * Constructor.
     *
     * @return void
     */
    var Calendar = function (element, options) {
        // do more...
        if (typeof element === "string") {
            if (isId(element) === true || isCl(element) === true) element = document.querySelectorAll(element);
            else
                throw new Error("You must provide a valid CSS selector or Element Object as first parameter.");
        }

        if (! element)
            throw new Error("Element Object is undefined.");

        if (element.isNodeList() === false) {
            init(element, options);
        } else {
            for (var i = 0; i < element.length; i ++) init(element[i], options);
        }
    };

    /**
     * JS TRICK
     * How to detect HTMLCollection/NodeList in JavaScript.
     *
     * https://stackoverflow.com/questions/7238177/how-to-detect-htmlcollection-nodelist-in-javascript
     */
    Element.prototype.isNodeList = function () {
        return false;
    };
    NodeList.prototype.isNodeList = HTMLCollection.prototype.isNodeList = function () {
        return true;
    };

    window.Calendar = Calendar;

})(window);