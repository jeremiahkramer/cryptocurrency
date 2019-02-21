$(document).ready(function(){////////////////

const hoursPerDay = 24;
var i;

var btc = document.getElementById("btcChart");
if(btc){
	btc.getContext('2d');
}

var eth = document.getElementById("ethChart");
if(eth){
	eth.getContext('2d');
}

var xrp = document.getElementById("xrpChart");
if(xrp){
	xrp.getContext('2d');
}

var btcDataset = [];
var ethDataset = [];
var xrpDataset = [];
var masterDataset = {"numberOfCoins": 3, "coins": [btcDataset, ethDataset, xrpDataset] }; //master object
var time = [];

/////////////////////// H A S H   F U N C T I O N /////////////////////////////////////////////////////
function hasher(string){   //hash function for place coins in array, for quick access/lookup by trading name ie: "btc"
    var intValue = 0;
    var temp = 0;
    for(i =0; i< string.length; i++){
        temp = 0;
        temp = string[i].charCodeAt(0);
        temp -= 120;
        temp = temp*temp; //square to make positive
        temp = Math.sqrt(temp);
        intValue += temp;
    }
    return intValue % 10;
}

////////////////////Init Time array for 24 hour chart///////////////////////////////////////////////////
function timeOneDay(){
    var formattedTime;
    for(i =0; i < hoursPerDay+1 ; i++){ //fill in all of the hours
        formattedTime = (moment().subtract(i, "hours")).format("hA");  //give the time in format X AM/PM
        time.unshift(formattedTime);  //add to beginning of array
    }
}
timeOneDay();

/////////////////////SET UP 1 DAY CHARTS//////////////////////////////////////////////////

////////////////////// B I T C O I N ////////////////////////////////////////////////////
if(btc){
	$.getJSON('https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=25', function(btc24Hour){
	    for(i =0; i < hoursPerDay+1; i++){
	        btcDataset.push(btc24Hour.Data[i].close); //fill BTC dataset with latest price action from last 24 hours
	    }
	    var btcChart = new Chart(btc, {
	        type: 'line',
	        data: {
	            labels: time,
	            datasets: [{
	                label: 'Price in USD',
	                data: btcDataset,
	                backgroundColor: [
	                    'rgba(76, 175, 80, 0.2)'
	                ],
	                borderColor: [
	                    'rgba(0, 100, 0, 1)'
	                ],
	                borderWidth: 1,
	                pointHoverBackgroundColor: 'rgb(255, 99, 132)'
	            }]
	        },

	        options: {
	            tooltips: {
	                mode: 'index',
	                intersect: false
	            },
	            elements:{
	                 point:{
	                     radius: 0
	                 }
	             },
	            maintainAspectRatio: false
	        }
	    });
	});
}
////
//////////////////////// E T H E R E U M ////////////////////////////////////////////////////////////////
if(eth){
	var coinName = "ETH"; //test to see if templated API works
	$.getJSON('https://min-api.cryptocompare.com/data/histohour?fsym=' + coinName + '&tsym=USD&limit=25', function(eth24Hour){
	    for(i =0; i < hoursPerDay+1; i++){
	        ethDataset.push(eth24Hour.Data[i].close); //fill ETH dataset with latest price action from last 24 hours
	    }
	    var ethChart = new Chart(eth, {
	        type: 'line',
	        data: {
	            labels: time,
	            datasets: [{
	                label: 'Price in USD',
	                data: ethDataset,
	                backgroundColor: [
	                    'rgba(76, 175, 80, 0.2)'
	                ],
	                borderColor: [
	                    'rgba(0, 100, 0, 1)'
	                ],
	                borderWidth: 1,
	                pointHoverBackgroundColor: 'rgb(255, 99, 132)' //pink dot
	            }]
	        },

	       options: {
	            tooltips: {
	                mode: 'index',
	                intersect: false
	            },
	            elements:{
	                 point:{
	                     radius: 0
	                 }
	             },
	            maintainAspectRatio: false
	        }
	    });
	});
}
/////////////////////////// R I P P L E /////////////////////////////////////////////////////////////
if(xrp){
	$.getJSON('https://min-api.cryptocompare.com/data/histohour?fsym=XRP&tsym=USD&limit=25', function(xrp24Hour){
	    for(i =0; i < hoursPerDay+1; i++){
	        xrpDataset.push(xrp24Hour.Data[i].close); //fill XRP dataset with latest price action from last 24 hours
	    }
	    var xrpChart = new Chart(xrp, {
	        type: 'line',
	        data: {
	            labels: time,
	            datasets: [{
	                label: 'Price in USD',
	                data: xrpDataset,
	                backgroundColor: [
	                    'rgba(76, 175, 80, 0.2)'
	                ],
	                borderColor: [
	                    'rgba(0, 100, 0, 1)'
	                ],
	                borderWidth: 1,
	                pointHoverBackgroundColor: 'rgb(255, 99, 132)'
	            }]
	        },

	        options: {
	            tooltips: {
	                mode: 'index',
	                intersect: false
	            },
	            elements:{
	                 point:{
	                     radius: 0
	                 }
	             },
	            maintainAspectRatio: false
	        }
	    });
	});
}
///////////////UPDATE PRICE CHART//////////////////////////////////////////////////////////////////////////////
function updateChartSecond() {
	btcDataset.shift(); //remove the first value (oldest value not needed)
	ethDataset.shift();
	xrpDataset.shift();

	$.getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP&tsyms=USD', function(chartObj){
		btcDataset.push(chartObj.BTC.USD); //get the latest price values
		ethDataset.push(chartObj.ETH.USD);
		xrpDataset.push(chartObj.XRP.USD);
	});

	btcChart.update(); //update the charts
	ethChart.update();
	xrpChart.update();
}
//setInterval(updateChartSecond, 1000); //do this every second
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////UPDATE PRICE VALUE////////////////////////////////////////////////////////////////////////////////
var priceValueElements = document.getElementsByClassName("price-value");
var currentPrices = [];
function updateCurrentPrice() {
	$.getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP&tsyms=USD', function(pricesObj){
	//	for(i =0; i < masterDataset.numberOfCoins; i++){
         //   priceValueElements[i].textContent = pricesObj[i].USD
            $('#btc-current-price').text(pricesObj.BTC.USD); //update the current price stated within the boxes
    		$('#eth-current-price').text(pricesObj.ETH.USD);
    		$('#xrp-current-price').text(pricesObj.XRP.USD);
        //}
        currentPrices[0] = (pricesObj.BTC.USD); //assuming we only have 3 coins....not dynamic code.....Yikes....
        currentPrices[1] = (pricesObj.ETH.USD);
        currentPrices[2] = (pricesObj.XRP.USD);
	});
}
setInterval(updateCurrentPrice, 500); //do this every 1 second
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////FIND PERCENT CHANGE 24HR AND UPDATE ALL COIN TILE///////////////////////////////////////////////////
function generateTwentyFourHourChange(latestPrices, data, index){
    var result = (latestPrices[index]-data[0]); //take current price of Coin 'i' and subtract last known price (24 hrs ago) to get live % change
    result = ((result/data[0])*100).toFixed(2);
    return result; //round percentage change to 2 decimal places
}
var val;
var priceChangeElements = document.getElementsByClassName("price-change-value"); //get a list of the HTML elements (coin tiles' price change section) to insert into
function UpdateTwentyFourHrChange(){
    for(i =0; i < masterDataset.numberOfCoins; i++){
        val = generateTwentyFourHourChange(currentPrices, masterDataset.coins[i], i);
        priceChangeElements[i].textContent = val;

        priceChangeElements[i].classList.remove("sign-green");
        priceChangeElements[i].classList.remove("sign-red");

        priceChangeElements[i].classList.add("sign-green"); //make it green by default (includes 0% change, im an optimist lol)
        if(val < 0){
            priceChangeElements[i].classList.remove("sign-green"); //turn off green
            priceChangeElements[i].classList.toggle("sign-red"); //change to red if below 0
        }
    }
}
	if(btc && eth && xrp){
		setInterval(UpdateTwentyFourHrChange, 505); //do this every 1.x second
	}

///////////UPDATE MARKET CAP///////////////////////////////////////////////////////////////////////////////////////
function updateMarketCap(){
    var temp;
    $.getJSON('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP&tsyms=USD', function(marketCapObj){
        temp = marketCapObj.RAW.BTC.USD.MKTCAP
        $('#btc-marketCap').text(temp.toFixed(0)); //not dynamic...
        temp = marketCapObj.RAW.ETH.USD.MKTCAP
        $('#eth-marketCap').text(temp.toFixed(0));
        temp = marketCapObj.RAW.XRP.USD.MKTCAP
        $('#xrp-marketCap').text(temp.toFixed(0));
    });
}
setInterval(updateMarketCap, 500); //do this every 1 second

///////////UPDATE 24 HR VOLUME/////////////////////////////////////////////////////////////////////////////////////
function updateTwentyFourHrVolume(){
    var temp;
    $.getJSON('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP&tsyms=USD', function(twentyFourHrVolumeObj){

        temp = Number(twentyFourHrVolumeObj.RAW.BTC.USD.TOTALVOLUME24H);
        $('#btc-twentyFourHrVolume').text(temp.toFixed(2)); //not dynamic...

        temp = Number(twentyFourHrVolumeObj.RAW.ETH.USD.TOTALVOLUME24H);
        $('#eth-twentyFourHrVolume').text(temp.toFixed(2));

        temp = Number(twentyFourHrVolumeObj.RAW.XRP.USD.TOTALVOLUME24H);
        $('#xrp-twentyFourHrVolume').text(temp.toFixed(2));

    });
}
setInterval(updateTwentyFourHrVolume, 500); //do this every 1 second

//////////////////////////////////// G R A P H   P R E F E R E N C E S //////////////////////////////////////////////////////////////////////////

Chart.defaults.global.hover.intersect = false;
Chart.Tooltip.positioners.cursor = function(chartElements, coordinates) {
  return coordinates;
};

////////////////// N A V B A R //////////////////////////////////////////////////////////////////////////////
$( ".nav-container" ).mouseenter(function() {
    $(".nav-container").animate({
        'marginLeft' : "+=110px" //moves right
    });
    //$(".coin-container").css("left", "5%");
    $(".coin-container").animate({
        left : "+=45px" //moves right
    });

});

$( ".nav-container" ).mouseleave(function() {
    $(".nav-container").animate({
        'marginLeft' : "-=110px" //moves left
    });
    $(".coin-container").animate({
        left : "-=45px" //moves left
    });
   // $(".coin-container").css("left", "-.8%");
});

// hovering over the elements
 $(".link-container").mouseenter(function() {
    	$(this).css('backgroundColor', '#004985');
 });
 $(".link-container").mouseleave(function() {
    	$(this).css('backgroundColor', 'rgb(48, 162, 255)');
 });
// end hovering over elements

});//////////////////////////////////////////


/////////////////////Favorites////////////////////////////////////////////////////////////////////////

/////////////////////BTC/////////////////////////////////
window.onload = function(){
function btc_star_clicked(){

    var btc_star = document.getElementById("btc-star");
    var btc_child = btc_star.children;

    var already_starred = btc_child[0].classList.contains('clicked');

    if(already_starred === false) {
        btc_child[0].classList.add('fas');
        btc_child[0].classList.add('fa-star');
        btc_child[0].classList.add('clicked');
    }
    else{
      btc_child[0].classList.remove('fas');
      btc_child[0].classList.remove('fa-star');
      btc_child[0].classList.add('far');
      btc_child[0].classList.remove('clicked');
    }

}
	if(document.getElementById("ethChart")){
		document.getElementById("btc-star").onclick = btc_star_clicked;
	}

 //////////////////ETH///////////////////////////////////////
 // window.onload = function(){
 function eth_star_clicked(){

    var eth_star = document.getElementById("eth-star");
    var eth_child = eth_star.children;
    var already_starred_eth = eth_child[0].classList.contains('clicked');

    if(already_starred_eth === false){
     eth_child[0].classList.add('fas');
     eth_child[0].classList.add('fa-star');
     eth_child[0].classList.add('clicked');
   }
   else{
     eth_child[0].classList.remove('fas');
     eth_child[0].classList.remove('fa-star');
     eth_child[0].classList.add('far');
     eth_child[0].classList.remove('clicked');
   }
 }
 	if(document.getElementById("btcChart")){
 		document.getElementById("eth-star").onclick = eth_star_clicked;
 	}
 // }

 /////////////////////////XRP///////////////////////////////////////

 // window.onload = function(){
 function xrp_star_clicked(){

     var xrp_star = document.getElementById("xrp-star");
     var xrp_child = xrp_star.children;
    var already_starred_xrp = xrp_child[0].classList.contains('clicked');
    if(already_starred_xrp === false){
     xrp_child[0].classList.add('fas');
     xrp_child[0].classList.add('fa-star');
     xrp_child[0].classList.add('clicked');
   }
   else{
     xrp_child[0].classList.remove('fas');
     xrp_child[0].classList.remove('fa-star');
     xrp_child[0].classList.add('far');
     xrp_child[0].classList.remove('clicked');
   }
 }
 	if(document.getElementById("xrpChart")){
 		document.getElementById("xrp-star").onclick = xrp_star_clicked;
 	}
 // }


//////////////////Search for certain coin////////////////////////
  $('#search').on('keyup', function(){
    var coinName;
    var input = $('#search').val().toLowerCase();
    $('.coin-full').each(function(){
      coinName = $(this).text().toLowerCase();;
      if(!(coinName.includes(input))){//if it doesnt contain the string then hide the coin tile
        $(this).parent().parent().hide();
      }
      else{ //it does have contain the string
        $(this).parent().parent().show();
      }
    });
  });


//////////////NAVBAR////////////////////////////////////////////////
$('#nav1').click(function(){
	window.location.replace("/");
});

$('#nav2').click(function(){
	window.location.replace("alts");
});

$('#nav3').click(function(){
	window.location.replace("addCoin");
});


//////////////////HANDLE ADD COIN//////////////////////////////////////////////////

$('#submit-coin-input').click(function(){
	$
	var i;
	var dataObj = {          //THIS IS THE OBJECT THAT WILL BE SENT TO SERVER
		coinFullName: "Ethereum Classic",
		coinName: "ETC",
		currentPrice: "15.30",
		priceChange: "2.3",
		marketCap: "1562723687",
		twentyFourHrVolume: "108092000",
		dataset: []
	};
	var coinName = $('#coin-input').val();

	let store = new Promise(function(resolve, reject){
		if(coinName){
			coinName = coinName.toUpperCase();

			$.getJSON('https://min-api.cryptocompare.com/data/histohour?fsym='+ coinName +'&tsym=USD&limit=25', function(priceData){
				for(i =0; i < 25; i++){
		      		dataObj.dataset.push(priceData.Data[i].close); //fill coin dataset with latest price action from last 24 hours
		   		}
			   	$.getJSON('https://min-api.cryptocompare.com/data/pricemultifull?fsyms='+ coinName +'&tsyms=USD', function(otherData){
					dataObj.coinFullName = otherData.RAW[coinName].USD.FROMSYMBOL;
					dataObj.coinName = otherData.RAW[coinName].USD.FROMSYMBOL;
					dataObj.currentPrice = otherData.RAW[coinName].USD.PRICE;
					dataObj.priceChange = otherData.RAW[coinName].USD.CHANGEPCT24HOUR;
					dataObj.marketCap = otherData.RAW[coinName].USD.MKTCAP;
					dataObj.twentyFourHrVolume = otherData.RAW[coinName].USD.VOLUME24HOURTO;
	   				resolve('done');
	   			});

	   		});
		}
	});
	store.then(function(){
		$('#coin-input').val("");

		//At this point object 'dataObj' is ready for delivery to the DB

		//WRITE THE REST OF THE CODE BELOW HERE:

		// function storeCoinInDB(dataObj.coinFullName, dataObj.coinName, dataObj.currentPrice, dataObj.priceChange, dataObj.marketCap, dataObj.twentyFourHrVolume) {
		var request = new XMLHttpRequest();
		var requestURL = '/addCoin';
		request.open('POST', requestURL);

		var requestBody = JSON.stringify(dataObj);

		request.setRequestHeader(
			'Content-Type', 'application/json'
		);

		request.addEventListener('load', function (events) {
			if (event.target.status !== 200) {
				var message = event.target.response;
				alert("Error storing coin in database" + message);
			}
		});

		request.send(requestBody);

	});
});          //function ends here

/////////////// REPLACE NEW COINS WITH GENERIC PICTURE //////////////////////////////////////////////
var coins = ["btc", "eth", "xrp", "icx", "req", "ven"];
function replacePicture(){
	var i, a, flag;
	var coinImages = document.getElementsByClassName("coin-icon");
	for(i= 0; i < coinImages.length; i++){
		flag = 0;
		for(a= 0; a < coins.length; a++){
			if($(coinImages[i]).attr("src") === (coins[a] + ".png")){ //if its matching with AT LEAST one of the coins from the list (coins with supported pictures)
				flag = 1;
				break;
			}
		}

		if(flag == 0){ // if match to certified coins was never found a.k.a. flag was never set
			$(coinImages[i]).attr("src", "generic.png");
		}

	}
}
replacePicture(); //called everytime a page is opened

































}/////DOCUMENT READY FUNCTION END
