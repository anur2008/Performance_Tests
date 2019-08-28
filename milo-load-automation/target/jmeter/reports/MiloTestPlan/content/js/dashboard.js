/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 63.912543153049484, "KoPercent": 36.087456846950516};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.587148288973384, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8, 500, 1500, "Click Enchanced Order Search-1"], "isController": false}, {"data": [1.0, 500, 1500, "Click Enchanced Order Search-0"], "isController": false}, {"data": [1.0, 500, 1500, "Click View Link"], "isController": false}, {"data": [1.0, 500, 1500, "Highway Order Search-0"], "isController": false}, {"data": [0.5, 500, 1500, "Highway Order Search-1"], "isController": false}, {"data": [0.0, 500, 1500, "Highway Order Search-2"], "isController": false}, {"data": [1.0, 500, 1500, "PendingReceivedViaEdiAction"], "isController": true}, {"data": [0.6190476190476191, 500, 1500, "Click Logout"], "isController": false}, {"data": [0.6139817629179332, 500, 1500, "Authenticate"], "isController": false}, {"data": [0.9940476190476191, 500, 1500, "Click Queues"], "isController": false}, {"data": [0.00819672131147541, 500, 1500, "Click Order"], "isController": true}, {"data": [0.6288343558282209, 500, 1500, "AuthSuccess"], "isController": false}, {"data": [0.6454545454545455, 500, 1500, "Login URL"], "isController": false}, {"data": [0.01639344262295082, 500, 1500, "Highway Search "], "isController": true}, {"data": [0.0, 500, 1500, "Click Order Id-1"], "isController": false}, {"data": [1.0, 500, 1500, "Click Order Id-0"], "isController": false}, {"data": [0.5, 500, 1500, "Click Enchanced Order Search-2"], "isController": false}, {"data": [1.0, 500, 1500, "View Queue Results"], "isController": false}, {"data": [1.0, 500, 1500, "Click Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "Click Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "Click Views"], "isController": true}, {"data": [0.00819672131147541, 500, 1500, "Enchanced Order Search"], "isController": true}, {"data": [0.0, 500, 1500, "Click Add Location-1"], "isController": false}, {"data": [0.6287878787878788, 500, 1500, "Login"], "isController": true}, {"data": [0.02459016393442623, 500, 1500, "Search OakBrook Terrace"], "isController": false}, {"data": [0.8613138686131386, 500, 1500, "Run Report"], "isController": false}, {"data": [1.0, 500, 1500, "Search Report Name"], "isController": false}, {"data": [1.0, 500, 1500, "Click Add Location-0"], "isController": false}, {"data": [0.9953051643192489, 500, 1500, "Authenticate-0"], "isController": false}, {"data": [1.0, 500, 1500, "Click Vendor Tracing - Dray Vessel Port Report"], "isController": false}, {"data": [0.9530516431924883, 500, 1500, "Authenticate-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "AuthSuccess-1"], "isController": false}, {"data": [1.0, 500, 1500, "AuthSuccess-0"], "isController": false}, {"data": [0.01639344262295082, 500, 1500, "Click Add Location"], "isController": false}, {"data": [0.7068965517241379, 500, 1500, "Click Reports"], "isController": true}, {"data": [0.0, 500, 1500, "AuthSuccess-2"], "isController": false}, {"data": [0.02459016393442623, 500, 1500, "Click Enchanced Order Search"], "isController": false}, {"data": [0.01639344262295082, 500, 1500, "Click Order ID"], "isController": false}, {"data": [0.02459016393442623, 500, 1500, "Highway Order Search"], "isController": false}, {"data": [0.0, 500, 1500, "Search OakBrook Terrace-1"], "isController": false}, {"data": [1.0, 500, 1500, "Search CAView"], "isController": false}, {"data": [0.638095238095238, 500, 1500, "Milo Login"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "Search View Results"], "isController": false}, {"data": [1.0, 500, 1500, "Search OakBrook Terrace-0"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "Logout"], "isController": true}, {"data": [0.9827586206896551, 500, 1500, "Show Reports"], "isController": false}, {"data": [1.0, 500, 1500, "Click Cash Application View"], "isController": false}, {"data": [1.0, 500, 1500, "Search View"], "isController": true}, {"data": [0.0, 500, 1500, "Click Order Id"], "isController": false}, {"data": [1.0, 500, 1500, "Click Vendor Tracing - Dray Vessel Report"], "isController": true}, {"data": [0.6165644171779141, 500, 1500, "Authenticate Login"], "isController": true}, {"data": [1.0, 500, 1500, "Click Accounts Receivable Statement W\/O Credits Report"], "isController": false}, {"data": [0.9880952380952381, 500, 1500, "Click Pending Orders Received via Edit"], "isController": false}, {"data": [0.05737704918032787, 500, 1500, "Search Zip Code"], "isController": false}, {"data": [0.0, 500, 1500, "Click Order ID-1"], "isController": false}, {"data": [1.0, 500, 1500, "Click Order ID-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4345, 1568, 36.087456846950516, 150.78780207134682, 39, 24477, 198.4000000000001, 250.0, 761.6999999999998, 24.77223229455296, 359.1123161680863, 24.169629571032736], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Click Enchanced Order Search-1", 5, 1, 20.0, 50.0, 40, 84, 84.0, 84.0, 84.0, 1.7111567419575633, 0.7596600145448322, 1.3117754320670774], "isController": false}, {"data": ["Click Enchanced Order Search-0", 5, 0, 0.0, 43.2, 42, 45, 45.0, 45.0, 45.0, 1.7105713308244954, 0.6164070518303113, 1.443294560383168], "isController": false}, {"data": ["Click View Link", 31, 0, 0.0, 80.35483870967741, 46, 182, 100.4, 158.59999999999994, 182.0, 1.0522742701968772, 40.34913601069246, 0.8231168851832994], "isController": false}, {"data": ["Highway Order Search-0", 4, 0, 0.0, 44.0, 43, 45, 45.0, 45.0, 45.0, 1.6645859342488556, 0.5998361423220974, 1.3606039325842696], "isController": false}, {"data": ["Highway Order Search-1", 4, 2, 50.0, 60.75, 41, 81, 81.0, 81.0, 81.0, 1.6666666666666667, 0.8829752604166667, 1.2565104166666667], "isController": false}, {"data": ["Highway Order Search-2", 2, 2, 100.0, 167.5, 165, 170, 170.0, 170.0, 170.0, 1.5936254980079683, 1.072273406374502, 1.2076693227091635], "isController": false}, {"data": ["PendingReceivedViaEdiAction", 84, 0, 0.0, 104.89285714285718, 80, 431, 114.0, 174.75, 431.0, 2.9437532854389343, 162.86348590546697, 3.7170634746802174], "isController": true}, {"data": ["Click Logout", 315, 120, 38.095238095238095, 87.13650793650791, 39, 442, 103.40000000000003, 226.0, 281.4399999999996, 1.8145161290322582, 14.904925790250577, 2.083183323732719], "isController": false}, {"data": ["Authenticate", 329, 123, 37.38601823708207, 394.0425531914894, 39, 23361, 258.0, 276.0, 17940.399999999885, 1.8847279747480823, 42.08054531259846, 2.6289162527712375], "isController": false}, {"data": ["Click Queues", 168, 0, 0.0, 144.24404761904776, 54, 786, 189.1, 200.74999999999991, 761.1600000000001, 5.866741164967174, 413.6298401160253, 6.812065669087862], "isController": false}, {"data": ["Click Order", 244, 242, 99.18032786885246, 45.1762295081967, 39, 332, 43.0, 47.0, 225.15000000000197, 8.337889557135046, 25.554008337889556, 7.1523592340418265], "isController": true}, {"data": ["AuthSuccess", 326, 120, 36.809815950920246, 173.88343558282213, 39, 24477, 146.0, 154.64999999999998, 272.69000000000096, 1.8702311972921806, 41.587769276002525, 1.3864263022775514], "isController": false}, {"data": ["Login URL", 660, 233, 35.303030303030305, 113.15606060606065, 40, 726, 177.0, 179.94999999999993, 250.1899999999997, 3.763020907572224, 18.139755202305135, 2.450267589628316], "isController": false}, {"data": ["Highway Search ", 122, 120, 98.36065573770492, 43.48360655737706, 39, 112, 43.0, 59.89999999999992, 106.0199999999999, 4.190567787586302, 9.160258894222512, 3.36746846340123], "isController": true}, {"data": ["Click Order Id-1", 2, 2, 100.0, 63.5, 42, 85, 85.0, 85.0, 85.0, 2.506265664160401, 1.686344768170426, 1.9433348997493733], "isController": false}, {"data": ["Click Order Id-0", 2, 0, 0.0, 42.0, 41, 43, 43.0, 43.0, 43.0, 2.6490066225165565, 0.9545736754966887, 2.279076986754967], "isController": false}, {"data": ["Click Enchanced Order Search-2", 4, 2, 50.0, 149.25, 46, 211, 211.0, 211.0, 211.0, 2.1141649048625792, 13.927887156448204, 1.6289805761099367], "isController": false}, {"data": ["View Queue Results", 84, 0, 0.0, 104.89285714285718, 80, 431, 114.0, 174.75, 431.0, 2.943650126156434, 162.85777860640945, 3.716933215937763], "isController": false}, {"data": ["Click Logout-1", 195, 0, 0.0, 56.88717948717949, 48, 282, 55.0, 59.19999999999999, 269.51999999999987, 1.3464340212805623, 16.83919111249974, 0.9677494527954041], "isController": false}, {"data": ["Click Logout-0", 195, 0, 0.0, 58.11282051282052, 40, 182, 169.0, 173.0, 179.11999999999998, 1.3465084001408656, 0.46943701059598536, 0.9467637188490461], "isController": false}, {"data": ["Click Views", 31, 0, 0.0, 80.35483870967741, 46, 182, 100.4, 158.59999999999994, 182.0, 1.0522742701968772, 40.34913601069246, 0.8231168851832994], "isController": true}, {"data": ["Enchanced Order Search", 122, 121, 99.18032786885246, 91.63934426229507, 79, 341, 88.0, 123.09999999999985, 340.53999999999996, 4.181662382176522, 6.578366002570694, 23.576009532990575], "isController": true}, {"data": ["Click Add Location-1", 2, 2, 100.0, 41.5, 41, 42, 42.0, 42.0, 42.0, 2.2988505747126435, 1.5467852011494252, 1.6253591954022988], "isController": false}, {"data": ["Login", 330, 121, 36.666666666666664, 226.31212121212124, 202, 897, 227.90000000000003, 255.0, 624.8899999999999, 1.8804704595185995, 18.129728555157616, 2.4489132180690416], "isController": true}, {"data": ["Search OakBrook Terrace", 122, 119, 97.54098360655738, 43.09016393442622, 40, 125, 43.7, 46.0, 110.04999999999974, 4.187547195716345, 2.8397206657170315, 19.838591990886936], "isController": false}, {"data": ["Run Report", 137, 0, 0.0, 402.91240875912405, 102, 10821, 924.4000000000001, 1019.8999999999999, 7182.500000000044, 1.6299821534800714, 21.450482878494945, 1.9521141619571685], "isController": false}, {"data": ["Search Report Name", 100, 0, 0.0, 75.45999999999998, 55, 383, 138.60000000000042, 197.0, 383.0, 4.368338284116722, 1.8386267582561595, 3.225062248820549], "isController": false}, {"data": ["Click Add Location-0", 2, 0, 0.0, 41.5, 41, 42, 42.0, 42.0, 42.0, 2.2988505747126435, 0.8283943965517241, 1.8206716954022988], "isController": false}, {"data": ["Authenticate-0", 213, 0, 0.0, 166.39436619718305, 51, 23043, 63.0, 66.29999999999998, 97.15999999999991, 1.4128790893894771, 0.6346917784366791, 1.2252958630170607], "isController": false}, {"data": ["Click Vendor Tracing - Dray Vessel Port Report", 50, 0, 0.0, 88.99999999999999, 72, 220, 98.8, 107.04999999999995, 220.0, 2.1809299485300535, 93.12294004350956, 1.7017217078862428], "isController": false}, {"data": ["Authenticate-1", 213, 7, 3.2863849765258215, 419.29107981220653, 41, 21025, 205.6, 216.59999999999997, 19530.89999999985, 1.4134228722345354, 47.5911272565827, 1.1511666752378928], "isController": false}, {"data": ["AuthSuccess-1", 3, 2, 66.66666666666667, 83.0, 81, 85, 85.0, 85.0, 85.0, 1.6251354279523293, 0.9384733884073673, 1.1760013204225352], "isController": false}, {"data": ["AuthSuccess-0", 3, 0, 0.0, 42.666666666666664, 42, 43, 43.0, 43.0, 43.0, 1.6602102933038185, 0.5982593732706143, 1.2159743359158828], "isController": false}, {"data": ["Click Add Location", 122, 120, 98.36065573770492, 43.48360655737706, 39, 112, 43.0, 59.89999999999992, 106.0199999999999, 4.190423851068214, 9.159944260063886, 3.36735279848183], "isController": false}, {"data": ["Click Reports", 87, 0, 0.0, 910.9425287356323, 244, 11343, 1549.8000000000002, 1663.9999999999998, 11343.0, 1.027712807427883, 105.20426576490775, 1.704560346380561], "isController": true}, {"data": ["AuthSuccess-2", 1, 1, 100.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 5.555555555555555, 3.738064236111111, 4.041883680555555], "isController": false}, {"data": ["Click Enchanced Order Search", 122, 119, 97.54098360655738, 48.549180327868854, 39, 298, 43.0, 48.0, 297.53999999999996, 4.18797844220933, 3.7482889790944354, 3.7709841427517077], "isController": false}, {"data": ["Click Order ID", 122, 120, 98.36065573770492, 47.38524590163935, 39, 332, 43.0, 46.849999999999994, 325.32999999999987, 4.186972338527009, 22.819314286756125, 3.527797678289519], "isController": false}, {"data": ["Highway Order Search", 244, 238, 97.54098360655738, 47.63934426229506, 39, 296, 43.0, 76.5, 292.4000000000001, 8.354161673571404, 16.964174898140858, 7.138833370424898], "isController": false}, {"data": ["Search OakBrook Terrace-1", 1, 1, 100.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 12.82051282051282, 8.626302083333334, 9.502704326923077], "isController": false}, {"data": ["Search CAView", 30, 0, 0.0, 67.43333333333332, 55, 197, 69.4, 187.1, 197.0, 1.022948136529478, 0.37561376888191766, 0.8221546058239847], "isController": false}, {"data": ["Milo Login", 315, 114, 36.19047619047619, 49.673015873015885, 39, 319, 51.0, 52.0, 228.03999999999797, 1.8151016456921587, 14.928288179078503, 1.304604307841239], "isController": false}, {"data": ["Search View Results", 60, 0, 0.0, 1221.7666666666667, 123, 16493, 155.1, 16481.0, 16493.0, 2.0412329046744233, 129.4622068917126, 3.2412545927740357], "isController": false}, {"data": ["Search OakBrook Terrace-0", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 21.73913043478261, 7.833729619565218, 102.85750679347827], "isController": false}, {"data": ["Logout", 315, 120, 38.095238095238095, 136.81269841269844, 79, 492, 217.80000000000194, 278.0, 372.5999999999996, 1.8140667922116067, 29.82101185154311, 3.38652796254384], "isController": true}, {"data": ["Show Reports", 87, 0, 0.0, 379.16091954023, 241, 684, 476.20000000000005, 487.6, 684.0, 1.124031007751938, 73.434610687177, 0.9082409762596898], "isController": false}, {"data": ["Click Cash Application View", 62, 0, 0.0, 80.09677419354838, 60, 142, 108.7, 112.0, 142.0, 2.102621494217791, 133.23939628056434, 1.4742990555159903], "isController": false}, {"data": ["Search View", 30, 0, 0.0, 67.43333333333332, 55, 197, 69.4, 187.1, 197.0, 1.022948136529478, 0.37561376888191766, 0.8221546058239847], "isController": true}, {"data": ["Click Order Id", 122, 122, 100.0, 42.959016393442624, 40, 127, 43.0, 47.0, 117.33999999999983, 4.190279924437575, 2.8474435965138247, 3.6583778765241286], "isController": false}, {"data": ["Click Vendor Tracing - Dray Vessel Report", 50, 0, 0.0, 88.99999999999999, 72, 220, 98.8, 107.04999999999995, 220.0, 2.1809299485300535, 93.12294004350956, 1.7017217078862428], "isController": true}, {"data": ["Authenticate Login", 326, 123, 37.73006134969325, 409.47239263803647, 79, 24711, 410.3, 427.0, 499.19000000000005, 1.8670927761836853, 82.9829737855306, 3.9834731773652226], "isController": true}, {"data": ["Click Accounts Receivable Statement W\/O Credits Report", 37, 0, 0.0, 94.1621621621622, 73, 161, 120.0000000000001, 157.4, 161.0, 1.3100127460699618, 55.59293981686376, 1.0221681485448237], "isController": false}, {"data": ["Click Pending Orders Received via Edit", 84, 0, 0.0, 97.3690476190476, 68, 694, 91.0, 126.25, 694.0, 2.9443723930036105, 133.5314436078201, 1.9782502015493006], "isController": false}, {"data": ["Search Zip Code", 244, 230, 94.26229508196721, 42.06557377049182, 39, 59, 43.0, 45.0, 54.9500000000001, 8.380847702136428, 5.488325526379062, 8.094392946692313], "isController": false}, {"data": ["Click Order ID-1", 2, 2, 100.0, 62.5, 43, 82, 82.0, 82.0, 82.0, 0.9289363678588017, 0.6250362865768695, 0.7075882489549465], "isController": false}, {"data": ["Click Order ID-0", 2, 0, 0.0, 45.5, 43, 48, 48.0, 48.0, 48.0, 0.9456264775413711, 0.34075797872340424, 0.7849438534278959], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/Order 1207954 loaded successfully\\\/", 1, 0.06377551020408163, 0.023014959723820484], "isController": false}, {"data": ["403\/Forbidden", 1567, 99.93622448979592, 36.0644418872267], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4345, 1568, "403\/Forbidden", 1567, "Test failed: text expected to contain \\\/Order 1207954 loaded successfully\\\/", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Click Enchanced Order Search-1", 5, 1, "403\/Forbidden", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Highway Order Search-1", 4, 2, "403\/Forbidden", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Highway Order Search-2", 2, 2, "403\/Forbidden", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Click Logout", 315, 120, "403\/Forbidden", 120, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Authenticate", 329, 123, "403\/Forbidden", 123, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["AuthSuccess", 326, 120, "403\/Forbidden", 120, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login URL", 660, 233, "403\/Forbidden", 233, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Click Order Id-1", 2, 2, "403\/Forbidden", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Click Enchanced Order Search-2", 4, 2, "403\/Forbidden", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Click Add Location-1", 2, 2, "403\/Forbidden", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Search OakBrook Terrace", 122, 119, "403\/Forbidden", 119, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Authenticate-1", 213, 7, "403\/Forbidden", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["AuthSuccess-1", 3, 2, "403\/Forbidden", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Click Add Location", 122, 120, "403\/Forbidden", 120, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["AuthSuccess-2", 1, 1, "403\/Forbidden", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Click Enchanced Order Search", 122, 119, "403\/Forbidden", 119, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Click Order ID", 122, 120, "403\/Forbidden", 120, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Highway Order Search", 122, 119, "403\/Forbidden", 119, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Search OakBrook Terrace-1", 1, 1, "403\/Forbidden", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Milo Login", 315, 114, "403\/Forbidden", 114, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Click Order Id", 122, 122, "403\/Forbidden", 121, "Test failed: text expected to contain \\\/Order 1207954 loaded successfully\\\/", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Search Zip Code", 122, 115, "403\/Forbidden", 115, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Click Order ID-1", 2, 2, "403\/Forbidden", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
