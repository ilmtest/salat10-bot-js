Setting up:

```
heroku create salat10 --buildpack heroku/nodejs
git push heroku master
```

Your .env file should specify the following:

```
NODE_ENV=development
PORT=5000
GEOCODER_PROVIDER=mapquest
GEOCODER_API_KEY=nrv

# https://timezonedb.com/account
TIMEZONE_API_KEY=6076
```
