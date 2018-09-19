angular.module("calendarApp",[])
    .factory("datesBuilder", function(){
        // Returns months between two dates.
        
        var code = "en-IN"; //es-cr
        var builder = {};
        builder.getDates = function(startDate, daysNumber){

            var fromDate = new Date(startDate); // date to start
            var toDate = new Date (fromDate);
            toDate = toDate.addDays(daysNumber);  // date to end
            
            console.log("fromDate", fromDate);
            console.log("toDate", toDate);

            months = (toDate.getFullYear() - fromDate.getFullYear()) * 12;
            months -= fromDate.getMonth() + 1;
            months += toDate.getMonth();
            var dates = [];

            if (months >= 0) {
                months = months + 1;
                for (m = 0; m <= months ; m++) {
                    if(m == months){
                        // Builds the data object for the last month, 
                        // it can be ends before its last day.

                        var oDate = {
                            _date:toDate,
                            _firstDate: 1,
                            _lastDate:toDate.getDate(),
                            _firstWeekDay:new Date(toDate.toLocaleString(code, { month: "long" }) + " " + "1" + toDate.getFullYear()).getDay(),
                            _month:toDate.toLocaleString(code, { month: "long" }).toUpperCase(),
                            _year:toDate.getFullYear()
                        };
                        dates.push(oDate);
                    }
                    else if(m == 0){
                        //Builds the data object for the first month, 
                        //which can be begins at any day different from the first.

                        var d = fromDate.addMonth(m);
                        var oDate = {
                            _date:d,
                            _firstDate: d.getDate(),
                            _lastDate:new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
                            _firstWeekDay:d.getDay(),
                            _month:d.toLocaleString(code, { month: "long" }).toUpperCase(),
                            _year:d.getFullYear()
                        };
                        dates.push(oDate);

                    }
                    else{
                        // Builds the data object for all months that begin at its first day 
                        // and finish at its last day (normal to show).

                        var d = fromDate.addMonth(m);
                        var oDate = {
                            _date:d,
                            _firstDate: 1,
                            _lastDate:new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
                            _firstWeekDay:new Date(d.toLocaleString(code, { month: "long" }) + " " + "1" + d.getFullYear()).getDay(),
                            _month:d.toLocaleString(code, { month: "long" }).toUpperCase(),
                            _year:d.getFullYear()
                        };
                        dates.push(oDate);
                    }
                }
                
            }
            else{
                //Builds the data object in case the numbers of days start and end at the same month
                var oDate = {
                    _date:fromDate,
                    _firstDate: fromDate.getDate(),
                    _lastDate:fromDate.getDate() + daysNumber,
                    _firstWeekDay:fromDate.getDay(),
                    _month:fromDate.toLocaleString(code, { month: "long" }).toUpperCase(),
                    _year:fromDate.getFullYear()
                };
                dates.push(oDate); 
            }

            return dates;
        };

        Date.prototype.addMonth = function(month) {
            var date = new Date(this.valueOf());
            date.setMonth(date.getMonth() + month);
            return date;
        };

        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };

        return builder;

    })
    .factory("calendarBuilder", function(){
        //This factory is in charge to build the calendar.
        var builder = {};

        builder.createCalendar = function(dates){
            //This function creates the calendar adding ever sheet of the month.

            console.log('dates to validate',dates);
            
            var $calendar = $("<div>", {id: "calendars"});
            var mElement = 0;

            do {

                var $divRow = $("<div>", {"class": "row"});

                for (var d = 0; d <= 3; d++) {

                    if(mElement >= dates.length){
                        $calendar.append($divRow);
                        break;
                    }

                    var $divCol = $("<div>", {"class": "col-lg-3"});


                    var newMonth = createMonth(dates[mElement]);

                    $divCol.append(newMonth);
                    $divRow.append($divCol);

                    mElement++;

                }

                $calendar.append($divRow);   
                
            } while (mElement < dates.length);    
            
            return $calendar;
                 
        }
        
        function createMonth(date){
            //This function creates a new sheet by month.

            var $table = $('<table>', {'class':'calendar'});
            var $th = $('<th>', {'colspan':'7'});
            $th.append(date._month +" "+date._year);
            $table.append($th);
            var $tr1 = $('<tr>');
            var $tr2 = $('<tr>');

            //builds the row for days letters
            for (var c = 0; c <= 6; c++) {

                var $td = $('<td>',{'class':'day'});
                var letter = 'SMTWTFS'[c];
                $td.append(letter);
                $tr1.append($td);
            }
        
            $table.append($tr1);
        
            //builds the second row
            var i;
            for ( i = 0; i <= 6; i++) {
                if(i == date._firstWeekDay){
                    break;
                }

                var $td = $('<td>',{'class':'day invalid'});
                $td.append('');
                $tr2.append($td);

            }
        
            var counter = date._firstDate;
            for (; i <= 6; i++) {

                if(i == 0 || i == 6){
                    var $td = $('<td>',{'class':'day weekend'});
                    $td.append(counter.toString());
                    counter++;
                    $tr2.append($td);
                }
                else{
                    var $td = $('<td>',{'class':'day valid'});
                    $td.append(counter.toString());
                    counter++;
                    $tr2.append($td);
                }
            }
        
            $table.append($tr2);
        
            //Builds the rows from 3 to 7.
        
            for (var r = 3; r <= 7; r++) {
               $tr = $('<tr>');

               for (var d = 0; d <= 6; d++) {
                   if(counter > date._lastDate){

                        for (; d <= 6; d++) {
                            var $td = $('<td>',{'class':'day invalid'});
                            $tr.append($td);
                        }
                        
                        $table.append($tr);
                        return $table;

                   }

                   if(d==0||d==6){
                    var $td = $('<td>',{'class':'day weekend'});
                    $td.append(counter.toString());
                    counter++;
                    $tr.append($td);
                   }
                   else{
                    var $td = $('<td>',{'class':'day valid'});
                    $td.append(counter.toString());
                    counter++;
                    $tr.append($td);
                    }
                }
        
                $table.append($tr);
            }
        
            return $table;
        }

         return builder;
    })
    .controller("calendarCtrlr", function($scope, datesBuilder, calendarBuilder){

        angular.element(document).ready(function () {
            var dates = datesBuilder.getDates("9/10/2018", 206);
            var calendar = calendarBuilder.createCalendar(dates);
            $('#calendar-container').append(calendar);

        });
    });
