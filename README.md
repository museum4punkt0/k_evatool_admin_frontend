# k:evatool admin frontend

This app is part of the k:evatool and provides the admin frontend.

### Funding
This project is part of the project museum4punkt0 - Digital Strategies for the Museum of the Future, sub-project k:eva. Further information: https://www.museum4punkt0.de.

The project museum4punkt0 is funded by the Federal Government Commissioner for Culture and the Media in accordance with a resolution issued by the German Bundestag (Parliament of the Federal Republic of Germany).
 
![BKM-Logo](https://github.com/museum4punkt0/Object-by-Object/blob/77bba25aa5a7f9948d4fd6f0b59f5bfb56ae89e2/04%20Logos/BKM_Fz_2017_Web_de.gif)
![NeustartKultur](https://github.com/museum4punkt0/Object-by-Object/blob/22f4e86d4d213c87afdba45454bf62f4253cada1/04%20Logos/BKM_Neustart_Kultur_Wortmarke_pos_RGB_RZ_web.jpg)

## Project setup

Please copy the file .env_example to .env and adjust the parameters:
- VITE_API_BASE_URL_API: Set the base URL of the k:evatool backend api endpoints (i.e. http://localhost:8085/api for local development)
- VITE_API_BASE_URL_AUTH: Set the base URL of the k:evatool backend oauth endpoints (i.e. http://localhost:8085/oauth for local development)
- VITE_PREVIEW_URL: URL of the survey player (i.e. http://localhost:3001 for local development)
- VITE_BASE_URL: URL of the admin frontend itself (i.e. http://localhost:3002 for local development)
- VITE_TUS_URL: Set the base URL of the TUS server needed for file uploads (i.e. http://localhost:8085/tus for local development)
- VITE_DEBUG: Set debug mode (should be false in production)
- VITE_PREFILL_PASSWORD: Prefill password for local development (not needed in production)
- VITE_PREFILL_EMAIL: Prefill email for local development (not needed in production)
- VITE_TINY_MCE_API_KEY: TinyMCE API key. Can be obtained at https://www.tiny.cloud

### Important note
Please make sure that the Laravel Backend and the survey player are running. Otherwise backend connections and survey preview won't work 

### Preparation
The following needs to be run for production and development prior to building and running the dev environment
```
yarn
```

### Compiles and hot-reloads for development
```
yarn dev
```

### Compiles and serves statically
Like on a webserver. Ideal for testing builds locally.
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint (--fix)
```

### License
GNU GENERAL PUBLIC LICENSE <br>
Copyright © 2022, 2av GmbH <br>
Please also see the LICENSE file provided within this repository
