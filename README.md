# YATTWO #

An optimizer for Tap Titans 2, following in the footsteps of YATTO. Hosted at yattwo.me

### How do I use it? ###

Read the FAQ page

### How do I get set up? ###

After pulling the repo, install the dependencies. Then compile with gulp and then run with npm

```
#install mongo
sudo apt-get install -y mongodb-org
# Windows needs to download the .msi or use Chocolatey
choco install mongodb

# setup config
cp config.default config
# Windows
copy config.default config

# create self-signed cert
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 999
openssl rsa -in key.pem -out unencrypted-key.pem


# install things
npm install -g gulp
npm install -g nodemon

# install libraries
npm install

# install dev libraries
npm install --only=dev

# run each of these in separate terminal sessions
mongod
gulp
npm run watch
```