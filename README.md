# Complex

## Description
Is a proejct taht uses frontend, server, worker, redis, postgres to calculate fibonaci numbers.
NGINX serves as reverse proxy.


## Running
`docker compose -f docker-compose-dev.yml up --build`

## CI Flow
* Push code to github
* Travis pulls repo
* Travis builds a test image, tests code
* Travis builds prod images
* Travis pushes built prod images to Docker Hub
* Travis pushes project to AWS EB
* EB pulls images from Docker Hub, deploys
