# HYPERFISH

Modular phishing script written in node.js


**Installing**

download or clone hyperfish then open up a terminal in the HYPERFISH directory then 
`npm install`

**usage:**

Options:

  --version      Show version number                                   [boolean]  
  --kind         sets the site to phish                      [string] [required]  
  --destination  sets the site your victim lands
                 on when they submit their data  
  --port         sets the port to use default is 80                     [string]  
  --webui        sets if you want to run the web UI
  -?, --help     Show help                                             [boolean]  
  
  
**Example**
`node hyperfish --port=80 --kind=Gmail --webui --destination=https://anysite.com`

then point your browser to `localhost`
if you use the --webui command then goto `localhost/adminPanel`
  
## supported sites
  1. Gmail
  2. Facebook
  
  
  
  
  # Support Me 
  
    * bitcoin: 3M5dv2XiWQYsrsTZBCfaNMR8xUChdCxwkA
    * litecoin: LYyS99RmNzmASfNHZcc7RfcuK2JYgKvB27
    * bytecoin: 223x7XjaTE5RhCz3skRJPXbnzR53C29P6jPjRUGURtCxU2VsoFjbWDcKA32X5SrJuDPBgXTsSmQRoAbCzcDvM2d2PcmYL6U
