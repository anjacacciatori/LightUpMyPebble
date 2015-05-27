/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Accel = require('ui/accel');
var Vector2 = require('vector2');
var ajax= require('ajax');

/*
 * Variable declaration
 *
 */

var spashText = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    text:'Recording data from accelerometer...',
    font:'GOTHIC_28_BOLD',
    color:'black',
    textOverflow:'wrap',
    textAlign:'center',
    backgroundColor:'white'
  });

var spashWind = new UI.Window();
var wind = new UI.Window();
var getUrl='http://';
var putUrl='http://';
var getGroupUrl;
var putGroupUrl;
var ipAddr;
var lightNum;
var developer;
var groupNum;

var errorajax = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    text:'Sorry!Probably you set the wrong ip address',
    font:'GOTHIC_28_BOLD',
    color:'black',
    textOverflow:'wrap',
    textAlign:'center',
    backgroundColor:'white'
  });

var ip;
var ipA;
var errorLight;


function updateUrl(ip) {
  developer='iacopodeveloper';
  getUrl='http://'+ipAddr+'/api/'+developer+'/lights/'+lightNum+'/'; //'http://192.168.0.13:8000/api/newdeveloper/lights/1/';
  putUrl='http://'+ipAddr+'/api/'+developer+'/lights/'+lightNum+'/state/'; //'http://192.168.100.74/api/iacopodeveloper/lights/4/state';
  getGroupUrl='http://'+ipAddr+'/api/'+developer+'/groups/'+groupNum+'/'; //'http://192.168.0.13:8000/api/newdeveloper/lights/1/';
  putGroupUrl='http://'+ipAddr+'/api/'+developer+'/groups/'+groupNum+'/action/'; //'http://192.168.100.74/api/iacopodeveloper/lights/4/state';
}

/*
 *   Settings on phone
 *
*/

var initialized = false;
var options = {};

Pebble.addEventListener("ready", function() {
  console.log("ready called!");
  initialized = true;
});

Pebble.addEventListener("showConfiguration", function() {
  console.log("showing configuration");
  Pebble.openURL('http://www.lump.pe.hu');
});

Pebble.addEventListener("webviewclosed", function(e) {
  //Pebble.sendAppMessage(options);
  console.log(e.response);
  console.log("configuration closed");
  // webview closed
  //Using primitive JSON validity and non-empty check
  if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
    options = JSON.parse(decodeURIComponent(e.response));
    ipA = encodeURIComponent(options.ip);
    console.log(ipA);
    console.log("Options = " + JSON.stringify(options));
    ipAddr=ipA;
    console.log(ipAddr);
    //updateUrl(ipAddr);
    console.log(getUrl);
  } else {
    console.log("Cancelled");
  }
});

/*
 *Close settings
 *
 */

/*
 * Variable inizialization
 *
 */
ipAddr='192.168.100.74'; //192.168.100.74 //U-Hopper address
updateUrl(ipAddr);
spashWind.add(spashText);
spashWind.show();


/*
 * definition of menu!
 *
 */

var menu = new UI.Menu({
  sections: [{
    title: 'Select what you want to do',
    items: [{
      title:'Select # of Light' //case 0
    }, {
      title: 'Switching Light on or off', //case 1
      subtitle: 'Is my light on?',
    }, {
      title: 'Change color of light' //case 2
    },{
      title: 'Change light saturation' //case 3
    },{
      title: 'Change light brightness' //case 4
    },{
      title: 'Light colorloop' //case 5
    },{
      title: 'Select Group' //case 6
    },{
      title: 'Switch Group on/off' //case 7
    }, {
      title: 'Change color of group' //case 8
    },{
      title: 'Change group saturation' //case 9
    },{
      title: 'Change group brightness' //case 10
    },{
      title: 'Group colorloop' //case 11
    },{
      title: 'One-Time Configuration', //case 12
      subtitle:'If the brigde has more memory then me!'
    },{
      title: 'Ip address discovery' //case 13
    }]
  }]
});


/*
 * What each menu selection is doing
 *
 */

menu.on('select', function(e){
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
switch(e.itemIndex){  
    
    /*
     * Change light number
     *
     */
    
  case 0:
    Accel.init();
    spashWind.add(spashText);
    spashWind.show();
    wind.hide();
    var ln=0;
    var url = 'http://'+ipAddr+'/api/'+developer+'/lights';
    console.log('doing ajax request');
    console.log(url);
    ajax({
          url: url,
          method:'get',
          type:'json'
          },
          function(data){
            var key=[];
            var lights=data;
            
            errorLight=data[0];
            console.log(errorLight);
            if(errorLight!==undefined){
                key=Object.keys(errorLight);
                console.log(key[0]);
            }else{
                key[0]="success";
            }
            if(key[0]==="error"){
                console.log(errorLight.error.description);
            
                var errore = new UI.Text({
                    position: new Vector2(0, 0),
                    size: new Vector2(144, 168),
                    text: errorLight.error.description,
                    font:'GOTHIC_28_BOLD',
                    color:'black',
                    textOverflow:'wrap',
                    textAlign:'center',
                    backgroundColor:'white'
                    });
                spashWind.hide();
                wind.hide();
                wind.add(errore);
                wind.show();
                              
            }else{
            
              Object.size = function(obj) { //Function to find the number of light the light
                      var size = 0, key;
                      for (key in obj) {
                          if (obj.hasOwnProperty(key)) size++;
                          }
                      return size;
                      };
              ln=Object.size(lights);
              console.log(ln);
            }
            },
          function(error) {
              spashWind.hide();
              wind.hide();
              wind.add(errorajax);
              wind.show();
              console.log('The ajax request failed: ' + error);
          });
    var k=1;
    if(errorLight===undefined){
      Accel.on('tap',function(e){
            
            var text = new UI.Text({
                        position: new Vector2(0, 0),
                        size: new Vector2(144, 168),
                        text:'You choose the Light '+k,
                        font:'GOTHIC_28_BOLD',
                        color:'black',
                        textOverflow:'wrap',
                        textAlign:'center',
                        backgroundColor:'white'
                        });
            
             spashWind.hide();
             wind.hide();
             wind.add(text);
             wind.show();         
      lightNum=k;
      if(k<ln){k=k+1;
      }else{
        k=1;
      }
      getUrl='http://'+ipAddr+'/api/'+developer+'/lights/'+lightNum+'/'; 
      putUrl='http://'+ipAddr+'/api/'+developer+'/lights/'+lightNum+'/state/'; 
      });
    } 
  break;
    
     /*
     * Switching lights on/off
     *
     */
    
  case 1: 
    Accel.init();
    spashWind.add(spashText);
    spashWind.show();
    wind.hide();
    var status;
    ajax({
          url: getUrl,
          method: 'get',
          type: 'json',
          },
          function(data){
              var key=[];
              
              errorLight=data[0];
              console.log(errorLight);
              if(errorLight!==undefined){
                  key=Object.keys(errorLight);
                  console.log(key[0]);
              }else{
                  key[0]="success";
              }
              if(key[0]==="error"){
                console.log(errorLight.error.description);
                var errore = new UI.Text({
                      position: new Vector2(0, 0),
                      size: new Vector2(144, 168),
                      text: errorLight.error.description,
                      font:'GOTHIC_28_BOLD',
                      color:'black',
                      textOverflow:'wrap',
                      textAlign:'center',
                      backgroundColor:'white'
                      });
                spashWind.hide();
                wind.hide();
                wind.add(errore);
                wind.show();
                              
             }else{
                status=data.state.on;
             }
        }, 
        function(error) {
            console.log('The ajax request failed: ' + error);
            spashWind.hide();
            wind.hide();
            wind.add(errorajax);
            wind.show();
          }); //chiude ajax
    if(errorLight===undefined){
      Accel.on('tap', function(e){
          console.log(status);
          if(status===false){
          var text = new UI.Text({
              position: new Vector2(0, 0),
              size: new Vector2(144, 168),
              text:'Your light is ON!',
              font:'GOTHIC_28_BOLD',
              color:'black',
              textOverflow:'wrap',
              textAlign:'center',
              backgroundColor:'white'
              });
          ajax({  
                url: putUrl,
                method: 'put',
                type: 'json',
                data: {"on":true}
                },
                function(data) {
                    spashWind.hide();
                    wind.hide();
                    wind.add(text);
                    wind.show(); 
                    ajax({
                          url: getUrl,
                          method: 'get',
                          type: 'json',
                          },
                          function(data){                          
                              status=data.state.on;
                          }, 
                          function(error) {
                              console.log('The ajax request failed: ' + error);
                              spashWind.hide();
                              wind.hide();
                              wind.add(errorajax);
                              wind.show();
                          }); //chiude ajax
                }, 
                function(error) {
                    spashWind.hide();
                    wind.hide();
                    wind.add(errorajax);
                    wind.show();
                    console.log('The ajax request failed: ' + error);
                }); 
              
          }else{
                var newText = new UI.Text({
                    position: new Vector2(0, 0),
                    size: new Vector2(144, 168),
                    text:'Your light is OFF!',
                    font:'GOTHIC_28_BOLD',
                    color:'black',
                    textOverflow:'wrap',
                    textAlign:'center',
                    backgroundColor:'white'
                    });
                 ajax({
                        url: putUrl,
                        method: 'put',
                        type: 'json',
                        data: {"on":false}
                        },
                        function(data) {
                          
                             spashWind.hide();
                             wind.hide();
                             wind.add(newText);
                             wind.show(); 
                             ajax({
                                  url: getUrl,
                                  method: 'get',
                                  type: 'json',
                            },
                            function(data){                          
                                  status=data.state.on;
                            }, 
                            function(error) {
                                  console.log('The ajax request failed: ' + error);
                                  spashWind.hide();
                                  wind.hide();
                                  wind.add(errorajax);
                                  wind.show();
                            }); //chiude ajax
                        }, 
                        function(error) {
                            console.log('The ajax request failed: ' + error);
                            spashWind.hide();
                            wind.hide();
                            wind.add(errorajax);
                            wind.show();
                        }); 
            }
          }); //chiude accel.on
    }  
 break;
    
    /*
     * Changing light colors
     *
     */

 case 2: 
    spashWind.add(spashText);
    spashWind.show();
    wind.hide();
    Accel.init();

    var text = new UI.Text({
        position: new Vector2(0, 0),
        size: new Vector2(144, 168),
        text:'You changed the color, is it the one you wanted?',
        font:'GOTHIC_28_BOLD',
        color:'black',
        textOverflow:'wrap',
        textAlign:'center',
        backgroundColor:'white'
        });
  
    var i;
    ajax({
         url: getUrl,
         type: 'json'
         },
         function(data) {
             var key=[];         
             
             errorLight=data[0];
             console.log(errorLight);
             if(errorLight!==undefined){
                 key=Object.keys(errorLight);
                 console.log(key[0]);
             }else{
                 key[0]="success";
             }
             if(key[0]==="error"){
                 console.log(errorLight.error.description);
                 var errore = new UI.Text({
                     position: new Vector2(0, 0),
                     size: new Vector2(144, 168),
                     text: errorLight.error.description,
                     font:'GOTHIC_28_BOLD',
                     color:'black',
                     textOverflow:'wrap',
                     textAlign:'center',
                     backgroundColor:'white'
                     });
                spashWind.hide();
                wind.hide();
                wind.add(errore);
                wind.show();
             }else{
                i=data.state.hue;
             }
           }, 
           function(error) {
               spashWind.hide();
               wind.hide();
               wind.add(errorajax);
               wind.show();
               console.log('The ajax request failed: ' + error);
            }); 
    if(errorLight===undefined){
      Accel.on('tap', function(e){
        ajax({
             url: putUrl,
             method: 'put',
             type: 'json',
             data: {"hue":i}
             },
             function(data) {
                       spashWind.hide();
                       wind.hide();
                       wind.add(text);
                       wind.show(); 
                       if(i<52850){i=i+12150;}
                       else{i=0;}
             },
            function(error) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(errorajax);
                 wind.show();
                 console.log('The ajax request failed: ' + error);
            }); 
        });
    }
break;
    
    /*
     * Changing light saturation
     *
     */
    
case 3: 
     Accel.init();
     spashWind.add(spashText);
     spashWind.show();
    wind.hide();
     var newText = new UI.Text({
         position: new Vector2(0, 0),
         size: new Vector2(144, 168),
         text:'You changed the saturation, is it the one you wanted? !',
         font:'GOTHIC_28_BOLD',
         color:'black',
         textOverflow:'wrap',
         textAlign:'center',
         backgroundColor:'white'
         });
     var y;
     ajax({
          url: getUrl,
          type: 'json'
          },
          function(data) {
              var key=[];
            
              errorLight=data[0];
              console.log(errorLight);
              if(errorLight!==undefined){
                  key=Object.keys(errorLight);
                  console.log(key[0]);
              }else{
                  key[0]="success";
              }
              if(key[0]==="error"){
                  console.log(errorLight.error.description);
                  var errore = new UI.Text({
                      position: new Vector2(0, 0),
                      size: new Vector2(144, 168),
                      text: errorLight.error.description,
                      font:'GOTHIC_28_BOLD',
                      color:'black',
                      textOverflow:'wrap',
                      textAlign:'center',
                      backgroundColor:'white'
                      });
                  spashWind.hide();
                  wind.hide();
                  wind.add(errore);
                  wind.show();
              }else{
                  y=data.state.sat;
              }
          }, 
          function(error) {
              console.log('The ajax request failed: ' + error);
              spashWind.hide();
              wind.hide();
              wind.add(errorajax);
              wind.show();
          }); 
    if(errorLight===undefined){
       Accel.on('tap', function(e){
            ajax({
                 url: putUrl,
                 method: 'put',
                 type: 'json',
                 data: {"sat":y}
                 },
                 function(data) {
                     spashWind.hide();
                     wind.hide();
                     wind.add(newText);
                     wind.show(); 
                     if(y<204){y=y+50;}
                     else{y=0;}
                 }, 
                 function(error) {
                     spashWind.hide();
                     wind.hide();
                     wind.add(errorajax);
                     wind.show();
                     console.log('The ajax request failed: ' + error);
                 }); 
       });
    }
  break;
    
    /*
     * Changing light brightness
     *
     */
    
  case 4: 
     Accel.init();
     spashWind.add(spashText);
     spashWind.show();
    wind.hide();
     var text1 = new UI.Text({
         position: new Vector2(0, 0),
         size: new Vector2(144, 168),
         text:'You changed the brightness, is it the one you wanted? !',
         font:'GOTHIC_28_BOLD',
         color:'black',
         textOverflow:'wrap',
         textAlign:'center',
         backgroundColor:'white'
         });
     var z;
     ajax({
          url: getUrl,
          type: 'json'
          },
          function(data) {
            var key=[];
            errorLight=data[0];
            console.log(errorLight);
            if(errorLight!==undefined){
              key=Object.keys(errorLight);
              console.log(key[0]);
            }else{
              key[0]="success";
            }
            if(key[0]==="error"){
                console.log(errorLight.error.description);
                var errore = new UI.Text({
                    position: new Vector2(0, 0),
                    size: new Vector2(144, 168),
                    text: errorLight.error.description,
                    font:'GOTHIC_28_BOLD',
                    color:'black',
                    textOverflow:'wrap',
                    textAlign:'center',
                    backgroundColor:'white'
                    });
                spashWind.hide();
                wind.hide();
                wind.add(errore);
                wind.show();
            }else{
                z=data.state.bri;
            }
          }, 
          function(error) {
              spashWind.hide();
              wind.hide();
              wind.add(errorajax);
              wind.show();
              console.log('The ajax request failed: ' + error);
              }); 
    if(errorLight===undefined){
     Accel.on('tap', function(e){
        ajax({
             url: putUrl,
             method: 'put',
             type: 'json',
             data: {"bri":z}
             },
             function(data) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(text1);
                 wind.show(); 
                 if(z<204){z=z+50;}
                 else{z=1;}
             }, 
             function(error) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(errorajax);
                 wind.show();
                 console.log('The ajax request failed: ' + error);
                 }); 
       });
    }
  break;
    
    /*
     * light color loop
     *
     */
    
  case 5: 
    Accel.init();
    spashWind.add(spashText);
    spashWind.show();
    wind.hide();
    var loop;
    var textLoop = new UI.Text({
         position: new Vector2(0, 0),
         size: new Vector2(144, 168),
         text:'You activated the colorloop!',
         font:'GOTHIC_28_BOLD',
         color:'black',
         textOverflow:'wrap',
         textAlign:'center',
         backgroundColor:'white'
         });
    var textNone = new UI.Text({
         position: new Vector2(0, 0),
         size: new Vector2(144, 168),
         text:'You deactivated the colorloop!',
         font:'GOTHIC_28_BOLD',
         color:'black',
         textOverflow:'wrap',
         textAlign:'center',
         backgroundColor:'white'
         });

     ajax({
          url: getUrl,
          type: 'json'
          },
          function(data) {
            var key=[];
            errorLight=data[0];
            console.log(errorLight);
            if(errorLight!==undefined){
              key=Object.keys(errorLight);
              console.log(key[0]);
            }else{
              key[0]="success";
            }
            if(key[0]==="error"){
                console.log(errorLight.error.description);
                var errore = new UI.Text({
                    position: new Vector2(0, 0),
                    size: new Vector2(144, 168),
                    text: errorLight.error.description,
                    font:'GOTHIC_28_BOLD',
                    color:'black',
                    textOverflow:'wrap',
                    textAlign:'center',
                    backgroundColor:'white'
                    });
                spashWind.hide();
                wind.hide();
                wind.add(errore);
                wind.show();
            }else{
                loop=data.state.effect;
            }
          }, 
          function(error) {
              spashWind.hide();
              wind.hide();
              wind.add(errorajax);
              wind.show();
              console.log('The ajax request failed: ' + error);
              }); 
    if(errorLight===undefined){
     Accel.on('tap', function(e){
      if (loop==="none"){
        ajax({
             url: putUrl,
             method: 'put',
             type: 'json',
             data: {"effect":"colorloop"}
             },
             function(data) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(textLoop);
                 wind.show(); 
               ajax({
                  url: getUrl,
                  type: 'json'
                  },
                  function(data) {
           
                    loop=data.state.effect;

                  }, 
                  function(error) {
                    spashWind.hide();
                    wind.hide();
                    wind.add(errorajax);
                    wind.show();
                    console.log('The ajax request failed: ' + error);
                  }); 
             }, 
             function(error) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(errorajax);
                 wind.show();
                 console.log('The ajax request failed: ' + error);
                 }); 
      }else{
      ajax({
             url: putUrl,
             method: 'put',
             type: 'json',
             data: {"effect":"none"}
             },
             function(data) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(textNone);
                 wind.show(); 
               ajax({
                  url: getUrl,
                  type: 'json'
                  },
                  function(data) {
           
                    loop=data.state.effect;

                  }, 
                  function(error) {
                    spashWind.hide();
                    wind.hide();
                    wind.add(errorajax);
                    wind.show();
                    console.log('The ajax request failed: ' + error);
                  }); 
             }, 
             function(error) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(errorajax);
                 wind.show();
                 console.log('The ajax request failed: ' + error);
                 }); 
      }
    });
  }  
  break;
    
    /*
     * Selecting a group
     *
     */
    
  case 6: 
    Accel.init();
    spashWind.add(spashText);
    spashWind.show();
    wind.hide();
    var lu=0; //number of group found from ajax
   
    ajax({
          url: 'http://'+ipAddr+'/api/'+developer+'/groups',
          method:'get',
          type:'json'
          },
          function(data){
            var key=[];
            var groups=data;
            
            errorLight=data[0];
            console.log(errorLight);
            if(errorLight!==undefined){
                key=Object.keys(errorLight);
                console.log(key[0]);
            }else{
                key[0]="success";
            }
            if(key[0]==="error"){
                console.log(errorLight.error.description);
            
                var errore = new UI.Text({
                    position: new Vector2(0, 0),
                    size: new Vector2(144, 168),
                    text: errorLight.error.description,
                    font:'GOTHIC_28_BOLD',
                    color:'black',
                    textOverflow:'wrap',
                    textAlign:'center',
                    backgroundColor:'white'
                    });
                spashWind.hide();
                wind.hide();
                wind.add(errore);
                wind.show();
                              
            }else{
            
              Object.size = function(obj) {
                      var size = 0, key;
                      for (key in obj) {
                          if (obj.hasOwnProperty(key)) size++;
                          }
                      return size;
                      };
              lu=Object.size(groups);
                console.log(lu);
            }
            },
          function(error) {
              spashWind.hide();
              wind.hide();
              wind.add(errorajax);
              wind.show();
              console.log('The ajax request failed: ' + error);
          });
    var a=0;
    if(errorLight===undefined){
      Accel.on('tap',function(e){
            
            var text = new UI.Text({
                        position: new Vector2(0, 0),
                        size: new Vector2(144, 168),
                        text:'You choose group '+a,
                        font:'GOTHIC_28_BOLD',
                        color:'black',
                        textOverflow:'wrap',
                        textAlign:'center',
                        backgroundColor:'white'
                        });
            
             spashWind.hide();
             wind.hide();
             wind.add(text);
             wind.show();         
      groupNum=a;
      if(a<lu){a=a+1;
      }else{
        a=0;
      }
      getGroupUrl='http://'+ipAddr+'/api/'+developer+'/groups/'+groupNum+'/'; 
      putGroupUrl='http://'+ipAddr+'/api/'+developer+'/groups/'+groupNum+'/action/'; 
      });
    }  
  break;
    
    /*
     * Switching group on/off
     *
     */
    
  case 7: 
    Accel.init();
    spashWind.add(spashText);
    spashWind.show();
    wind.hide();
    var stata;
    ajax({
          url: getGroupUrl,
          method: 'get',
          type: 'json',
          },
          function(data){
              var key=[];
              
              errorLight=data[0];
              if(errorLight!==undefined){
                  key=Object.keys(errorLight);
                  console.log(key[0]);
              }else{
                  key[0]="success";
              }
              if(key[0]==="error"){
                console.log(errorLight.error.description);
                var errore = new UI.Text({
                      position: new Vector2(0, 0),
                      size: new Vector2(144, 168),
                      text: errorLight.error.description,
                      font:'GOTHIC_28_BOLD',
                      color:'black',
                      textOverflow:'wrap',
                      textAlign:'center',
                      backgroundColor:'white'
                      });
                spashWind.hide();
                wind.hide();
                wind.add(errore);
                wind.show();
                              
             }else{
               console.log(getGroupUrl);
                stata=data.action.on;
               console.log(stata);
             }
        }, 
        function(error) {
            console.log('The ajax request failed: ' + error);
            spashWind.hide();
            wind.hide();
            wind.add(errorajax);
            wind.show();
          }); //chiude ajax
    if(errorLight===undefined){
      Accel.on('tap', function(e){
          console.log(stata);
          if(stata===false){
          var text = new UI.Text({
              position: new Vector2(0, 0),
              size: new Vector2(144, 168),
              text:'Your light is ON!',
              font:'GOTHIC_28_BOLD',
              color:'black',
              textOverflow:'wrap',
              textAlign:'center',
              backgroundColor:'white'
              });
          ajax({  
                url: putGroupUrl,
                method: 'put',
                type: 'json',
                data: {"on":true}
                },
                function(data) {
                    spashWind.hide();
                    wind.hide();
                    wind.add(text);
                    wind.show(); 
                    ajax({
                          url: getGroupUrl,
                          method: 'get',
                          type: 'json',
                          },
                          function(data){                          
                              stata=data.action.on;
                              console.log('1');
                          }, 
                          function(error) {
                              console.log('The ajax request failed: ' + error);
                              spashWind.hide();
                              wind.hide();
                              wind.add(errorajax);
                              wind.show();
                          }); //chiude ajax
                }, 
                function(error) {
                    spashWind.hide();
                    wind.hide();
                    wind.add(errorajax);
                    wind.show();
                    console.log('The ajax request failed: ' + error);
                }); 
              
          }else{
                var newText = new UI.Text({
                    position: new Vector2(0, 0),
                    size: new Vector2(144, 168),
                    text:'Your light is OFF!',
                    font:'GOTHIC_28_BOLD',
                    color:'black',
                    textOverflow:'wrap',
                    textAlign:'center',
                    backgroundColor:'white'
                    });
                 ajax({
                        url: putGroupUrl,
                        method: 'put',
                        type: 'json',
                        data: {"on":false}
                        },
                        function(data) {
                          
                             spashWind.hide();
                             wind.hide();
                             wind.add(newText);
                             wind.show(); 
                             ajax({
                                  url: getGroupUrl,
                                  method: 'get',
                                  type: 'json',
                            },
                            function(data){                          
                                  stata=data.action.on;
                                  console.log('2');
                            }, 
                            function(error) {
                                  console.log('The ajax request failed: ' + error);
                                  spashWind.hide();
                                  wind.hide();
                                  wind.add(errorajax);
                                  wind.show();
                            }); //chiude ajax
                        }, 
                        function(error) {
                            console.log('The ajax request failed: ' + error);
                            spashWind.hide();
                            wind.hide();
                            wind.add(errorajax);
                            wind.show();
                        }); 
            }
          }); //chiude accel.on
    }  
  break;
    
    /*
     * Changing group color
     *
     */
    
  case 8: 
    spashWind.add(spashText);
    spashWind.show();
    wind.hide();
    Accel.init();

    var atext = new UI.Text({
        position: new Vector2(0, 0),
        size: new Vector2(144, 168),
        text:'You changed the color, is it the one you wanted?',
        font:'GOTHIC_28_BOLD',
        color:'black',
        textOverflow:'wrap',
        textAlign:'center',
        backgroundColor:'white'
        });
  
    var c;
    ajax({
         url: getGroupUrl,
         type: 'json'
         },
         function(data) {
             var key=[];         
             
             errorLight=data[0];
             console.log(errorLight);
             if(errorLight!==undefined){
                 key=Object.keys(errorLight);
                 console.log(key[0]);
             }else{
                 key[0]="success";
             }
             if(key[0]==="error"){
                 console.log(errorLight.error.description);
                 var errore = new UI.Text({
                     position: new Vector2(0, 0),
                     size: new Vector2(144, 168),
                     text: errorLight.error.description,
                     font:'GOTHIC_28_BOLD',
                     color:'black',
                     textOverflow:'wrap',
                     textAlign:'center',
                     backgroundColor:'white'
                     });
                spashWind.hide();
                wind.hide();
                wind.add(errore);
                wind.show();
             }else{
                c=data.action.hue;
             }
           }, 
           function(error) {
               spashWind.hide();
               wind.hide();
               wind.add(errorajax);
               wind.show();
               console.log('The ajax request failed: ' + error);
            }); 
    if(errorLight===undefined){
      Accel.on('tap', function(e){
        ajax({
             url: putGroupUrl,
             method: 'put',
             type: 'json',
             data: {"hue":c}
             },
             function(data) {
                       spashWind.hide();
                       wind.hide();
                       wind.add(atext);
                       wind.show(); 
                       if(c<52850){c=c+12150;}
                       else{c=0;}
             },
            function(error) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(errorajax);
                 wind.show();
                 console.log('The ajax request failed: ' + error);
            }); 
        });
    }
break;
    
    /*
     * Changing group saturation
     *
     */
    
case 9: 
     Accel.init();
     spashWind.add(spashText);
     spashWind.show();
     wind.hide();
     var Text = new UI.Text({
         position: new Vector2(0, 0),
         size: new Vector2(144, 168),
         text:'You changed the saturation, is it the one you wanted? !',
         font:'GOTHIC_28_BOLD',
         color:'black',
         textOverflow:'wrap',
         textAlign:'center',
         backgroundColor:'white'
         });
     var s;
     ajax({
          url: getGroupUrl,
          type: 'json'
          },
          function(data) {
              var key=[];
            
              errorLight=data[0];
              console.log(errorLight);
              if(errorLight!==undefined){
                  key=Object.keys(errorLight);
                  console.log(key[0]);
              }else{
                  key[0]="success";
              }
              if(key[0]==="error"){
                  console.log(errorLight.error.description);
                  var errore = new UI.Text({
                      position: new Vector2(0, 0),
                      size: new Vector2(144, 168),
                      text: errorLight.error.description,
                      font:'GOTHIC_28_BOLD',
                      color:'black',
                      textOverflow:'wrap',
                      textAlign:'center',
                      backgroundColor:'white'
                      });
                  spashWind.hide();
                  wind.hide();
                  wind.add(errore);
                  wind.show();
              }else{
                  s=data.action.sat;
              }
          }, 
          function(error) {
              console.log('The ajax request failed: ' + error);
              spashWind.hide();
              wind.hide();
              wind.add(errorajax);
              wind.show();
          }); 
    if(errorLight===undefined){
       Accel.on('tap', function(e){
            ajax({
                 url: putGroupUrl,
                 method: 'put',
                 type: 'json',
                 data: {"sat":s}
                 },
                 function(data) {
                     spashWind.hide();
                     wind.hide();
                     wind.add(Text);
                     wind.show(); 
                     if(s<204){s=s+50;}
                     else{s=0;}
                 }, 
                 function(error) {
                     spashWind.hide();
                     wind.hide();
                     wind.add(errorajax);
                     wind.show();
                     console.log('The ajax request failed: ' + error);
                 }); 
       });
    }
  break;
    
    /*
     * Changing group brightness
     *
     */ 
    
  case 10: 
         Accel.init();
     spashWind.add(spashText);
     spashWind.show();
    wind.hide();
     var text3 = new UI.Text({
         position: new Vector2(0, 0),
         size: new Vector2(144, 168),
         text:'You changed the brightness, is it the one you wanted? !',
         font:'GOTHIC_28_BOLD',
         color:'black',
         textOverflow:'wrap',
         textAlign:'center',
         backgroundColor:'white'
         });
     var b;
     ajax({
          url: getGroupUrl,
          type: 'json'
          },
          function(data) {
            var key=[];
            errorLight=data[0];
            console.log(errorLight);
            if(errorLight!==undefined){
              key=Object.keys(errorLight);
              console.log(key[0]);
            }else{
              key[0]="success";
            }
            if(key[0]==="error"){
                console.log(errorLight.error.description);
                var errore = new UI.Text({
                    position: new Vector2(0, 0),
                    size: new Vector2(144, 168),
                    text: errorLight.error.description,
                    font:'GOTHIC_28_BOLD',
                    color:'black',
                    textOverflow:'wrap',
                    textAlign:'center',
                    backgroundColor:'white'
                    });
                spashWind.hide();
                wind.hide();
                wind.add(errore);
                wind.show();
            }else{
                b=data.action.bri;
            }
          }, 
          function(error) {
              spashWind.hide();
              wind.hide();
              wind.add(errorajax);
              wind.show();
              console.log('The ajax request failed: ' + error);
              }); 
    if(errorLight===undefined){
     Accel.on('tap', function(e){
        ajax({
             url: putGroupUrl,
             method: 'put',
             type: 'json',
             data: {"bri":b}
             },
             function(data) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(text3);
                 wind.show(); 
                 if(b<204){b=b+50;}
                 else{b=1;}
             }, 
             function(error) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(errorajax);
                 wind.show();
                 console.log('The ajax request failed: ' + error);
                 }); 
       });
    }
  break;
    
    /*
     * Group colorloop
     *
     */
    
  case 11:
    Accel.init();
    spashWind.add(spashText);
    spashWind.show();
    wind.hide();
    var loopG;
    var textGLoop = new UI.Text({
         position: new Vector2(0, 0),
         size: new Vector2(144, 168),
         text:'You activated the colorloop!',
         font:'GOTHIC_28_BOLD',
         color:'black',
         textOverflow:'wrap',
         textAlign:'center',
         backgroundColor:'white'
         });
    var textGNone = new UI.Text({
         position: new Vector2(0, 0),
         size: new Vector2(144, 168),
         text:'You deactivated the colorloop!',
         font:'GOTHIC_28_BOLD',
         color:'black',
         textOverflow:'wrap',
         textAlign:'center',
         backgroundColor:'white'
         });

     ajax({
          url: getGroupUrl,
          type: 'json'
          },
          function(data) {
            var key=[];
            errorLight=data[0];
            console.log(errorLight);
            if(errorLight!==undefined){
              key=Object.keys(errorLight);
              console.log(key[0]);
            }else{
              key[0]="success";
            }
            if(key[0]==="error"){
                console.log(errorLight.error.description);
                var errore = new UI.Text({
                    position: new Vector2(0, 0),
                    size: new Vector2(144, 168),
                    text: errorLight.error.description,
                    font:'GOTHIC_28_BOLD',
                    color:'black',
                    textOverflow:'wrap',
                    textAlign:'center',
                    backgroundColor:'white'
                    });
                spashWind.hide();
                wind.hide();
                wind.add(errore);
                wind.show();
            }else{
                loopG=data.action.effect;
            }
          }, 
          function(error) {
              spashWind.hide();
              wind.hide();
              wind.add(errorajax);
              wind.show();
              console.log('The ajax request failed: ' + error);
              }); 
    if(errorLight===undefined){
     Accel.on('tap', function(e){
      if (loopG==="none"){
        ajax({
             url: putGroupUrl,
             method: 'put',
             type: 'json',
             data: {"effect":"colorloop"}
             },
             function(data) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(textGLoop);
                 wind.show(); 
               
                 ajax({
                    url: getGroupUrl,
                    type: 'json'
                    },
                    function(data) {
                      loopG=data.action.effect;
                    }, 
                    function(error) {
                        spashWind.hide();
                        wind.hide();
                        wind.add(errorajax);
                        wind.show();
                        console.log('The ajax request failed: ' + error);
                    }); 
               }, 
               function(error) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(errorajax);
                 wind.show();
                 console.log('The ajax request failed: ' + error);
                 }); 
      }else{
      ajax({
             url: putGroupUrl,
             method: 'put',
             type: 'json',
             data: {"effect":"none"}
             },
             function(data) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(textGNone);
                 wind.show(); 
                 ajax({
                    url: getGroupUrl,
                    type: 'json'
                    },
                    function(data) {
                        loopG=data.action.effect;
                    }, 
                    function(error) {
                        spashWind.hide();
                        wind.hide();
                        wind.add(errorajax);
                        wind.show();
                        console.log('The ajax request failed: ' + error);
                    }); 
             }, 
             function(error) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(errorajax);
                 wind.show();
                 console.log('The ajax request failed: ' + error);
                 }); 
      }
    });
  }    
  break;
    
    /*
     * Configure an authorized user
     *
     */
    
  case 12: 
    Accel.init();
    var text2 = new UI.Text({
         position: new Vector2(0, 0),
         size: new Vector2(144, 168),
         text:'Some starting info: Shake Pebble once, then go on the Bridge, press the Button on top of it and then shake once again. Be fast!',
         font:'GOTHIC_18_BOLD',
         color:'black',
         textOverflow:'wrap',
         textAlign:'center',
         backgroundColor:'white'
         });
    spashWind.hide();
    wind.hide();
    wind.add(text2);
    wind.show(); 
    Accel.on('tap', function(e) {
          ajax({
            url: 'http://'+ipAddr+'/api/',
             method: 'post',
             type: 'json',
             data: {"devicetype":"Pebble","username":"pebblepebble"}
             },
             function(data) {
               var key=[];
               errorLight=data[0];
               key=Object.keys(errorLight);
               console.log(key[0]);
               if(key[0]==='error'){
                   console.log(errorLight.error.description);
                   var errore = new UI.Text({
                       position: new Vector2(0, 0),
                       size: new Vector2(144, 168),
                       text: errorLight.error.description + '! Press the Bridge!',
                       font:'GOTHIC_28_BOLD',
                       color:'black',
                       textOverflow:'wrap',
                       textAlign:'center',
                       backgroundColor:'white'
                       });
                   spashWind.hide();
                   wind.hide();
                   wind.remove(text2);
                   wind.add(errore);
                   wind.show();           
              }else{
                 if(key[0]==='success'){
                 var text = new UI.Text({
                     position: new Vector2(0, 0),
                     size: new Vector2(144, 168),
                     text:'You are done, bravo!',
                     font:'GOTHIC_28_BOLD',
                     color:'black',
                     textOverflow:'wrap',
                     textAlign:'center',
                     backgroundColor:'white'
                     });
                     spashWind.hide();
                     wind.hide();
                     wind.remove(text2);
                     wind.add(text);
                     wind.show();
                     developer='pebblepebble';
                 }
               }            
             }, 
             function(error) {
                 spashWind.hide();
                 wind.hide();
                 wind.add(errorajax);
                 wind.show();
                 console.log('The ajax request failed: ' + error);
                 }); 
          });
  
  break;
    
    /*
     * Automatically get the IP address.
     *
     */
    
  case 13:
    ajax({
                  url: 'https://www.meethue.com/api/nupnp',
                  method: 'get',
                  type: 'json'
                 },
             function(data) {
                 ip=data[0].internalipaddress;
                  ipAddr=ip; 
                 var text4 = new UI.Text({
                     position: new Vector2(0, 0),
                     size: new Vector2(144, 168),
                     text:'The ip addr is!'+ipAddr,
                     font:'GOTHIC_28_BOLD',
                     color:'black',
                     textOverflow:'wrap',
                     textAlign:'center',
                     backgroundColor:'white'
                     });
                 spashWind.hide();
                 wind.hide();
                 wind.add(text4);
                 wind.show();
                
             }, 
             function(error) {
                 console.log('The ajax request failed: ' + error);
                 spashWind.hide();
                 wind.hide();
                 wind.add(errorajax);
                 wind.show();
                 }); 
    console.log(ip);
  break;
  }//close menu's switch
}); //close selection menu
menu.show();
spashWind.hide();
wind.hide();
wind.remove();