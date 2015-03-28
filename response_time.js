$(document).ready(function() {
    var costThroughput = $('#throughput-cost');
    var Basepage = $('#basesize');
   // var Other_size = $('#othersize');
    var bandwid = $('#ba');
    var latency = $('#lat1');
    var turns = $('#obj');
  //  var dns_time = $('#dnstime');
    var server_count = $('#ser');
  //  var ssl_hand =  $('#ssl');
    var dnstime;
    var ssltime;
    
    $('.knob').knob({
        'release' : function(v){respTime();}
    });
    
    function respTime(){       
         var sum = 0;
         var actual_pagesize = 0;
         var turn_time = 0;
         var min_bandwidth = (bandwid.val() * 1000);          // Converting MB into KB
         var countserver = server_count.val();               // No. of servers required to hit for the page to load so it gets mutiplied in next step with DNS setup time
        
        // Total Page Size
        actual_pagesize = Basepage.val() ;
        
        // RTT * TURNS
        turn_time = ((latency.val() / 1000) * turns.val());             // Converting Milliseconds into Seconds
        
        if ((dnstime != 0) && (ssltime != 0)) {
            var time_dns = (server_count.val() * 2 * (latency.val() / 1000));
            var ssl_time = (latency.val() / 1000);
        // Page Response Time
        sum = ((actual_pagesize / min_bandwidth) + turn_time + time_dns + ssl_time);
            console.log('the sum with checked in dns and ssl' + sum);
        } else if ((dnstime != 0) && (ssltime == 0)) {
            var ssl_time = 0;
            var time_dns = (server_count.val() * 2 * (latency.val() / 1000));
        sum = ((actual_pagesize / min_bandwidth) + turn_time + time_dns + ssl_time);
            console.log('the sum with checked in dns only' + sum);
        } else if ((dnstime == 0) && (ssltime != 0)) {
            var ssl_time = (latency.val() / 1000);
            var time_dns = 0;
            sum = ((actual_pagesize / min_bandwidth) + turn_time + time_dns + ssl_time);
            console.log('the sum with checked in ssl only' + sum);
        } else {
            var ssl_time = 0;
            var time_dns = 0;
            sum = ((actual_pagesize / min_bandwidth) + turn_time + time_dns + ssl_time);
            console.log('the default sum' + sum);
        }
        costThroughput.html(sum);
    }
    dnstime = 0;
    ssltime = 0;
    respTime();
    
    $('input.check_id').on('change', function(event){
    if($('input.check_id').is(":checked")) {
        dnstime = 1;                                      
        respTime();                                                 
    } else {
        dnstime = 0;       
        respTime();
    }
    });
    
    $('input.ssl_id').on('change', function(event){
    if($('input.ssl_id').is(":checked")) {
        ssltime = 1;                                      
        respTime();                                                 
    } else {
        ssltime = 0;       
        respTime();
    }
    });
    
} );