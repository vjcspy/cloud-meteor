#!/bin/bash
#nohup ./up.sh > output.log 2>&1&
cd /home/congnv/sites/xcloud_meteor

export MAIL_URL=smtp://bot@smartosc.com:thestar0@smtp.gmail.com:587
export MONGO_URL=mongodb://localhost:27017/cloud1
export ROOT_URL='http://account.xcloud.smartosc.com'
export PORT=2005
node main.js --port 2005
