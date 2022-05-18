# k:evatool admin frontend

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

