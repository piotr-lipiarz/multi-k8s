# Prerequisites
#	logged in to Docker CLI
#	authorized with kubectl CLI 

# Build images
docker build -t piotrlipiarz/multi-client:latest -t piotrlipiarz/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t piotrlipiarz/multi-server:latest -t piotrlipiarz/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t piotrlipiarz/multi-worker:latest -t piotrlipiarz/multi-worker:$SHA -f ./worker/Dockerfile ./worker

# Push to Docker Hub
docker push piotrlipiarz/multi-client:latest
docker push piotrlipiarz/multi-server:latest
docker push piotrlipiarz/multi-worker:latest
docker push piotrlipiarz/multi-client:$SHA
docker push piotrlipiarz/multi-server:$SHA
docker push piotrlipiarz/multi-worker:$SHA

# Apply K8s to cluster
kubectl apply -f k8s -f k8s-prod
kubectl set image deployments/client-deployment client=piotrlipiarz/multi-client:$SHA
kubectl set image deployments/server-deployment server=piotrlipiarz/multi-server:$SHA
kubectl set image deployments/worker-deployment worker=piotrlipiarz/multi-worker:$SHA