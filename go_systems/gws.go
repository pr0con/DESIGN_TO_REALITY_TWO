package main

import(
	//Native GoLang
	"fmt"
	"flag"
	"net/http"
	"encoding/json"
	
	//3rd party
	"github.com/google/uuid"
	
	"github.com/gorilla/mux"
	//"github.com/gorilla/handlers"
	"github.com/gorilla/websocket"		
	
	//Our packages
	
	
	"procon_jwt"
	"procon_data"
	"procon_utils"
	"procon_mongo"
	"procon_asyncq"
	"procon_config"
)



var addr = flag.String("addr", "0.0.0.0:1200", "http service address");
var upgrader = websocket.Upgrader{} // use default options

func handleAPI(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Something went horribly wrong.")
		return
	}
	
	id, err := uuid.NewRandom()
	if err != nil { fmt.Println(err) }
	
	c.Uuid = "ws-"+id.String();	
	procon_data.SendMsg("^vAr^", "client-websocket-id", c.Uuid, c);
	
	
	Loop:
		for{
			in := procon_data.Msg{}
		
			err := c.ReadJSON(&in)
			if err != nil {
				fmt.Println(err)
				break Loop
			}
					
			switch(in.Type) {
				case "get-jwt-token":
					fmt.Println(in.Data)
					usr, pwd, err := procon_utils.B64DecodeTryUser(in.Data)
					if err != nil { fmt.Println(err); } else {
						upv, auser, err := procon_mongo.MongoTryUser(usr,pwd)
						if err != nil { fmt.Println(err); procon_data.SendMsg("noop","invalid-credentials","noop",c) } else {
							if upv == true { fmt.Println("A user has logged in...")  }	
							auser.Password = "F00"
							jauser, err := json.Marshal(auser); if err != nil { fmt.Println("Error marshaling data.") }else {
								jwt, err := procon_jwt.GenerateJWT(procon_config.PrivKeyFile)
								if err != nil { fmt.Println(err) }else {
									procon_data.SendMsg(jwt, "jwt-token", string(jauser), c)
								}
							}
						}
					}
					break;
				case "verify-jwt-token": fallthrough
				case "validate-stored-jwt-token": 	
					valid, err := procon_jwt.ValidateJWT(procon_config.PubKeyFile, in.Jwt)
					if err != nil { fmt.Println(err); procon_data.SendMsg("^vAr^", "jwt-token-invalid", err.Error(), c)  } else if (err == nil && valid) {
						if in.Type == "verify-jwt-token" { procon_data.SendMsg("^vAr^", "jwt-token-valid", "noop", c)  }
						if in.Type == "validate-stored-jwt-token" {  procon_data.SendMsg("^vAr^", "stored-jwt-token-valid", "noop", c) }
					}
					break;
					
									 
				//https://goinbigdata.com/golang-pass-by-pointer-vs-pass-by-value/
				//non jwt
				case "fetch-menu-items": fallthrough
				case "fetch-public-logos": fallthrough
				case "fetch-public-about": fallthrough
				case "fetch-public-other":
					tobj := procon_mongo.NewMongoTask(in.Type, in.Data, c);
					procon_asyncq.TaskQueue <- tobj
					break;
										
				//jwt needed
				case "update-menu-items": fallthrough
				case "create-new-logo": fallthrough
				case "create-new-other": fallthrough
				case "fetch-admin-logos": fallthrough
				case "fetch-admin-other": fallthrough				
				case "delete-existing-logo": fallthrough
				case "update-existing-logo": fallthrough
				case "delete-existing-other": fallthrough
				case "update-existing-other": fallthrough
				case "add-site-content-about-data": fallthrough
				case "update-site-content-about-data": fallthrough
				case "fetch-admin-site-content-about": 
					valid, err := procon_jwt.ValidateJWT(procon_config.PubKeyFile, in.Jwt)
					if err != nil { fmt.Println(err); procon_data.SendMsg("^vAr^", "jwt-token-invalid", err.Error(), c)  } else if (err == nil && valid) {
						tobj := procon_mongo.NewMongoTask(in.Type, in.Data, c);
						procon_asyncq.TaskQueue <- tobj				
					}
					break;
										
				default:
					break;
			}
				
		}
}

func main() {
	go procon_asyncq.StartTaskDispatcher(9)
	
	r := mux.NewRouter()	
	r.HandleFunc("/ws", handleAPI)
	
	
	//System Boot
	fmt.Println("Server Running...");
	http.ListenAndServeTLS(*addr, "/etc/letsencrypt/live/void.pr0con.com/cert.pem", "/etc/letsencrypt/live/void.pr0con.com/privkey.pem", r);
}