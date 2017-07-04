#!/bin/bash

cd /var/www/clients/client1/web3/web

export MAIL_URL=smtp://bot@smartosc.com:thestar0@smtp.gmail.com:587
export MONGO_URL=mongodb://localhost:27017/cloud
export ROOT_URL='https://cloud.connectpos.com'
export PORT=2005
node main.js --port 2005
