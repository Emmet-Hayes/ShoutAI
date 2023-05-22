# deploy app<>
run docker compose up and currently nginx will allow access to localhost. <br/> 
I have tried a few things to expose a url, which then forwards the traffic to hte server, but nothing has worked. <br />
You can also simply run docker cpomse in the shoutai and it will create an image. <br/ >
NOTE: if you do docker compose or docker build a few times and run into problems there is probably a ached image problem. to fix this simply clear the  containers for the api from docker desktop images and run the fresh build or compose command and everything hsould work. 