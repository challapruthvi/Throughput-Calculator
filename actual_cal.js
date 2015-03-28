$(document).ready(function() {
    var costDisplayNode = $('#cost-estimate-value');
    var newipv4;
    var costThroughput = $('#throughput-cost');
    var Backoff_time = $('#backofftime');
    var Total_time = $('#total_time');
    var timeError = $('#time_error');
    var userTime = $('#user_time');
    var windowsize = $('#window');
    var latency = $('#lat');
    var error = $('#err');
    var datasize = $('#payload');
    var bandwid = $('#band');
    var parallelcon = $('#paracon');
	
	$('#band').knob({
		'release' : function(v){test();}
		});
	
	$('#window').knob({
		'release' : function(v){test();}
		});
	
	$('#lat').knob({
		'release' : function(v){test();}
		});
		
    $('.knob').knob({
        'release' : function(v){sumCal();test();}
    });

	function test() {
	$('#paracon').trigger('configure', {
    max: ( $('#band').val() / ( $('#window').val() / $('#lat').val() )) }); }
	
// MTU = 1500 BYTES ; Ipv4 header = 20 BYTES ; Tcp header = 20 BYTES ; MSS = 1460/1500 = 0.9733
    function sumCal(){       
         var sum = 0;
         var actual_backoff_time = 0;
         var throughput = 0;
         var eff_throughput = 0;
         var win_damaged = 0;
         var backoff_time = 0;
		 var num_con = parallelcon.val();
         var bw = (1000000 * bandwid.val());                          // Converting MB into Bytes
         var d = ((1000000000 * datasize.val()) / num_con);                  // Converting Gigabytes into Bytes
         var ws = 1000 * windowsize.val();      // Converting KiloBytes into Bytes
         var lat = (latency.val() / 1000);      // Converting Milliseconds into Seconds
         var err = (error.val() / 100);
         if(newipv4 == 0.9733) { 
             
             // Total Transmission Time
            throughput = ((ws / lat) * 0.9733);
            var transmission_time = (d / throughput); 
             
             // Time with errors
            eff_throughput = ((1 - (2 * (err))) / (1 - err));
            var time_error = (transmission_time / eff_throughput); 
             
             // Total Backoff time
            win_damaged = (((err) / (1 - err)) * (d / ws));
            backoff_time = (((Math.pow(2, 1)) - 1) / 2);
			actual_backoff_time = (time_error + (win_damaged * backoff_time));
             
             // User imagined time 
            var user_think = (d / bw);
             
             // Final Throughput in MBps
            sum = (((eff_throughput * throughput) / 1000000) * num_con);         // MegaBytes per second 
        }else{
             
             // Total Transmission Time
            throughput = (ws / lat);
            var transmission_time = (d / throughput); 
             
             // Time with errors
            eff_throughput = ((1 - (2 * (err))) / (1 - err));
            var time_error = (transmission_time / eff_throughput);
             
             // Total Backoff time
            win_damaged = (((err) / (1 - err)) * (d / ws));
            backoff_time = (((Math.pow(2, 1)) - 1) / 2);
            actual_backoff_time = (time_error + (win_damaged * backoff_time));
             
             // User imagined time 
            var user_think = (d / bw);
              
             // Final Throughput in MBps
            sum = (((eff_throughput * throughput) / 1000000) * num_con);         // MegaBytes per second 
        }
        Backoff_time.html(actual_backoff_time);
        Total_time.html(transmission_time);
        timeError.html(time_error);
        userTime.html(user_think);
        costThroughput.html(sum);
    }
        sumCal();
        $('input.check_id').on('change', function(event){
            if($('input.check_id').is(":checked")) {
                newipv4 = 0.9733;                                               
                sumCal();                                                 
            } else {
                newipv4 = 0;
                sumCal();
            }
        });    
});
