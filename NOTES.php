https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04
https://www.digitalocean.com/community/tutorials/how-to-use-certbot-standalone-mode-to-retrieve-let-s-encrypt-ssl-certificates-on-ubuntu-16-04

- apt-get update
- apt-get upgrade
- apt-get install nginx
- apt-get install certbot python3-certbot-nginx
- service nginx stop
- sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

db.createUser({
    user: "mongod",
    pwd: "SOMEHARDPASSWORD",
    roles: [
              { role: "userAdminAnyDatabase", db: "admin" },
              { role: "readWriteAnyDatabase", db: "admin" },
              { role: "dbAdminAnyDatabase", db: "admin"},
              { role: "clusterAdmin", db: "admin" }
           ]
})

    "role" : "Administrator",
    "fullname" : "system admin",
    "alias" : "system",
    "email" : "admin@pr0con.com",
    "password" : ""
    
    
- mkdir keycertz
- openssl genrsa -des3 -out mykey.pem 2048
- openssl rsa -in mykey.pem -pubout > mykey.pub    


AsyncQ notes:
	- async programming
	https://www.youtube.com/watch?v=TIAkt9csksI
		
Concurrent websocket write problem
	- https://golang.org/pkg/sync/
	- https://godoc.org/github.com/gorilla/websocket#hdr-Concurrency
	- https://stackoverflow.com/questions/44949467/when-do-you-embed-mutex-in-struct-in-go
	- other possible solution sync.map && redis 