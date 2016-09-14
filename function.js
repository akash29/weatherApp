
var lat;
var long;
var description;
var city;
var temp;
var country;
var btnClicked;
var sunsetTime;
var sunriseTime;
var timeCalc;

$(document).ready(function(){

 $.ajaxSetup({ cache: false });

  if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(function(data){
    lat = data.coords.latitude;
    long=data.coords.longitude;
    console.log(lat);
    console.log(long);
    var weatherUrl="http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&units=metric"+"&APPID=08a43cb5224dde3b9300aa2a373cb87b";
    extractVals(weatherUrl);
  });
    
}else{
  alert("geolocation is not supported. Enter your zip code!");
  }

  $("#toggleSwitch").change(function(){
    var newTemp;
  if($("#toggleSwitch").is(":checked")){
    newTemp=temp;
    $("#temp").html(newTemp+"<sup>o</sup>C");
  }else{
    newTemp = Math.round(temp*1.8+32);
    $("#temp").html(newTemp+"<sup>o</sup>F");
  }


  });
});

function extractVals(weatherUrl){
  $.getJSON(weatherUrl,function(d){
    $.ajaxSetup({ cache: false });
      var tempObj = d;
      console.log(tempObj);
      $.each(tempObj,function(k,v){
        if(k==="main"){
          $.each(v,function(k1,v1){
            if(k1==="temp"){
              console.log("temperature is"+v1);
              temp=Math.round(v1);

            }
          });
        }
        else if(k==="weather"){
          $.each(v,function(k1,v1){
            $.each(v1,function(k2,v2){
              if(k2==="description"){
              description=v2;
              console.log("description is"+description);
            }
            });
            
          });

        }
        else if(k==="sys"){
          $.each(v,function(k1,v1){
            if(k1==="country"){
              country=v1;
            }
            else if(k1==="sunset"){
              sunsetTime=v1;
              console.log("sunset time in sys"+sunsetTime);
            }
            else if(k1==="sunrise"){
              sunriseTime=v1;
              console.log("sunsrise time in sys"+sunriseTime);
            }
          });
        }
        else if(k==="dt"){
          timeCalc = v;
        }

        else if(k==="coord"){
          $.each(v,function(k1,v1){
            if(k1==="lon"){
              long=v1;
            }
            else if(k1==="lat"){
              lat=v1;
            }
          });
        }
        else if(k==="name"){
          city=v;
        }

      });
      
      $("#temp").html(temp+"<sup>o</sup>C");
      var tempVal = city+", "+country;
      $("#country").html(tempVal);
      $("#desc").html(description);
      showIcons(description);
  });
  
  
}


function getLocalTime(callback){
  var timeStamp;
  var offset;
  console.log(lat,long);
  var getTimeUrl = "http://api.timezonedb.com/v2/get-time-zone?key=N052L6U2SK64&format=json&by=position&lat="+lat+"&lng="+long;
  $.ajax({
    cache:false,
    url: getTimeUrl,
    dataType:"jsonp",
    success: function(result){
       $.each(result,function(k,v){
        if(k==="timestamp"){
          console.log(v);
          timeStamp=v;
          
        }
        else if(k==="gmtOffset"){
          offset=v;
        }
        
      });
       callback([timeStamp,offset]);
    }
  });
}

function showIcons(description){
  var timeofDay;
  var currentDate;
  var currentHours;
  var timeCalculated;
  var timeNow;
  var finalResult;
  getLocalTime(function(result){
    console.log(result[0]);
    console.log(result[1]);
   finalResult = result[0];
  
    currentDate = new Date(finalResult*1000);

    timeCalculated = new Date(timeCalc*1000);

    timeNow = timeCalculated.getHours();

    if(timeNow>19 || timeNow < 6){
    timeofDay="night";
    }else{
    timeofDay="day";
  }
  console.log("local time is"+currentDate);
  console.log("time cal is"+timeCalculated);
 
  // console.log(description);
  // console.log(weatherCondt["clear-day"]);
  if(description.includes("clear") && timeofDay==="day"){
    var skycons = new Skycons({"color": "orange"});
      skycons.set("icon1", Skycons.CLEAR_DAY);
  }else if(description.includes("clear") && timeofDay==="night"){
    var skycons = new Skycons({"color": "#b3b3ff"});
     skycons.set("icon1", Skycons.CLEAR_NIGHT);
   }else if(description.includes("few clouds") && timeofDay==="day"){
    var skycons = new Skycons({"color": "orange"});
    skycons.set("icon1", Skycons.PARTLY_CLOUDY_DAY);
   }else if(description.includes("few clouds") && timeofDay==="night"){
     var skycons = new Skycons({"color": "#b3b3ff"});
    
    skycons.set("icon1", Skycons.PARTLY_CLOUDY_NIGHT);
   }else if(description.includes("scattered") || description.includes("broken")){
     var skycons = new Skycons({"color": "#b3b3ff"});
    skycons.set("icon1", Skycons.CLOUDY);
  }else if(description.includes("rain")|| description.includes("drizzle")){
     var skycons = new Skycons({"color": "#777372"});
    skycons.set("icon1", Skycons.RAIN);
  }else if(description.includes("thunderstorm")){
     var skycons = new Skycons({"color": "#777372"});
    skycons.set("icon1",Skycons.SLEET);
   
  }else if(description.includes("snow")){
    var skycons = new Skycons({"color": " #b3b3ff"});
    skycons.set("icon1",Skycons.SNOW);
  }else if(description.includes("mist")){
    var skycons = new Skycons({"color": "#2a232a"});
    skycons.set("icon1",Skycons.FOG);
  }
  else{
    var skycons = new Skycons({"color": "#2a232a"});
    skycons.set("icon1",Skycons.FOG);
  }



  skycons.play();
  });
  

 
}

function submitBtn(e){
  e.preventDefault();
   var cityName = $("#cityText").val();
    console.log(cityName);
    
    if(cityName){
      var weatherUrl="http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=metric"+"&APPID=08a43cb5224dde3b9300aa2a373cb87b";
    }else{
      alert("Pease enter a valid city name");
    }

    extractVals(weatherUrl);

}






  


