package procon_mongo

import(
	"fmt"
	"context"
	"reflect"
	"encoding/json"
	
	
	
	"github.com/gorilla/websocket"
	
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/bson/primitive"
	
	"procon_data"
	"procon_utils"
	"procon_config"
)

type key string 

const(
	HostKey     = key("hostKey")
	UsernameKey = key("usernameKey")
	PasswordKey = key("passwordKey")
	DatabaseKey = key("databaseKey")		
)

var ctx context.Context
var client *mongo.Client;

func init() {
	ctx = context.Background()
	ctx, cancel := context.WithCancel(ctx)
	
	defer cancel()
	
	
	ctx = context.WithValue(ctx, HostKey, procon_config.MongoHost)
	ctx = context.WithValue(ctx, UsernameKey, procon_config.MongoUser)
	ctx = context.WithValue(ctx, PasswordKey, procon_config.MongoPassword)
	ctx = context.WithValue(ctx, DatabaseKey, procon_config.MongoDb)
	
	uri := fmt.Sprintf(`mongodb://%s:%s@%s/%s`, 
		ctx.Value(UsernameKey).(string), 
		ctx.Value(PasswordKey).(string), 
		ctx.Value(HostKey).(string), 
		ctx.Value(DatabaseKey).(string),
	)
	clientOptions := options.Client().ApplyURI(uri)
	
	var err error
	client, err = mongo.Connect(ctx, clientOptions)
	
	err = client.Ping(ctx, nil)
	
	if err != nil { fmt.Println(err); } else {
		fmt.Println("Mongo Connected...")
	}
}


/* Authentication Functions*/
func MongoTryUser(u []byte, p []byte) (bool, *procon_data.AUser,error) {
	var xdoc procon_data.AUser
	collection := client.Database("api").Collection("users")
	
	filter := bson.D{{"$or",bson.A{
								bson.D{{"email", string(u)}},
								bson.D{{"alias", string(u)}},
							},
					}}
					
	if err := collection.FindOne(ctx, filter).Decode(&xdoc); err != nil {
		return false, nil, err
	}else {
		bres, err := procon_utils.ValidateUserPassword(p, []byte(xdoc.Password))
		if err != nil { return false, nil, err } else { return bres, &xdoc, nil }
	}
	
}


func InsertDocument(db string, col string, doc []byte) (bool, string, error)  {
	collection := client.Database(db).Collection(col)
	var xdoc map[string]interface{}	
	
	err := json.Unmarshal(doc, &xdoc)
	if err != nil {  return false, "noop", err } else {
		if val, ok := xdoc["_id"]; ok {
			fmt.Println("document already exists: "+val.(string) )
			return false, "noop", nil
		} else {
			insertResult, err := collection.InsertOne(ctx, &xdoc)
			if err != nil { return false, "noop", nil } else {
				return true, insertResult.InsertedID.(primitive.ObjectID).Hex(), nil	
			}
		}
	}
	
}

func GetCollectionDocs(db string, col string) ([]byte) {
	var docs []interface{}
	
	filter := bson.D{}
	
	collection := client.Database(db).Collection(col)
	cursor, err := collection.Find(ctx, filter)
	
	defer cursor.Close(ctx);
	if err != nil { fmt.Println("Error Finding Documents") } else {
		for cursor.Next(ctx) {
			var xdoc map[string]interface{}
			err = cursor.Decode(&xdoc)
			
			if err != nil {
				fmt.Println("Error occurred at decoding")
			} else {
				docs = append(docs, xdoc);
			}				
		}
		
		jsonStr, err := json.Marshal(docs)
		if err != nil {
	    	fmt.Println(err);
	    	return []byte("Error During Doc Marshal.")		
		}else {
			return jsonStr
		}
	}
	
	return []byte("Something went horribly wrong.")
}

func RemoveDocumentByOId(db string, col string, oid string) {
	collection := client.Database(db).Collection(col);
	objId, err := primitive.ObjectIDFromHex(oid)
	
	if err != nil { fmt.Println(err) } else {
		deleteResult, err := collection.DeleteOne(ctx, bson.M{"_id": objId })
		if deleteResult.DeletedCount == 0 {
			fmt.Println("Error on deleting the document...", err)
		}
		fmt.Println("Deleted One: ", deleteResult.DeletedCount)		
	}
}


func GetSingleDocumentByKV(db string,col string, key string, value string) ([]byte) {
	var xdoc map[string]interface{}
	
	filter := bson.D{{key,value}}	

	collection := client.Database(db).Collection(col)
	err := collection.FindOne(ctx, filter).Decode(&xdoc)
	
	if (err != nil  && xdoc == nil) {
		fmt.Println("Document Doesn't Exist @ Mongo: w/ ", err)
		return nil		
	}	else {
		jsonStr, err := json.Marshal(xdoc)
		if err != nil { fmt.Println("Error marshling xdoc: ",err) }else {
			return jsonStr
		}
	}
	return nil
}


func UpdateDocumentByKVSetKVStr(db string, col string, ik string, iv string, k string, v string) {
	collection := client.Database(db).Collection(col);	
	filter := bson.D{{ ik, iv}}
	
	update := bson.D{
	    {"$set", bson.D{
	        {k, v},
	    }},
	}	

	updateResult, err := collection.UpdateOne(ctx, filter, update)
	if err != nil { fmt.Println("Error updating document", err, " \n") } else {
		fmt.Printf("Matched %v documents and updated %v documents.\n", updateResult.MatchedCount, updateResult.ModifiedCount)
	}		
}

/* 
	Mongo Tasks 
*/
type MongoTask struct {
	task string
	data string
	ws *websocket.Conn
}

//task == in.Type, 
//data == in.Data
func NewMongoTask(task string, data string, ws *websocket.Conn) *MongoTask  {
	return &MongoTask{task, data, ws}	
}


/* Internal Sub Task Functions*/
func sendNewLogos(ws *websocket.Conn) {
	logos := GetCollectionDocs("api","logos");
	procon_data.SendMsg("^vAr^", "requested-admin-logos", string(logos), ws) 	
}

func sendNewOther(ws *websocket.Conn) {
	other := GetCollectionDocs("api","other");
	procon_data.SendMsg("^vAr^", "requested-admin-other", string(other), ws) 	
}


func sendAdminAboutData(ws *websocket.Conn) {
	about := GetSingleDocumentByKV("api","site_content","site_content_id","about")	
	if about != nil {
		procon_data.SendMsg("^vAr^", "requested-admin-site-cotent-about", string(about), ws)	
	}
}

func sendSiteMenuItems(ws *websocket.Conn) {
	menuItems := GetSingleDocumentByKV("api","site_content","site_content_id","menu_items")
	if menuItems != nil {
		procon_data.SendMsg("^vAr^", "requested-site-menu-items", string(menuItems), ws)	
	}			
}


func (mt *MongoTask) Perform() {
	//mt.ws.Lock() -- moved to SendMsg function... --
	switch(mt.task) {
		case "fetch-menu-items":
			sendSiteMenuItems(mt.ws)		
			break;
		case "fetch-public-logos":
			logos := GetCollectionDocs("api","logos");
			procon_data.SendMsg("^vAr^", "requested-public-logos", string(logos), mt.ws)			
			break;
		case "fetch-public-about":
			about := GetSingleDocumentByKV("api","site_content","site_content_id","about")	
			if about != nil {
				procon_data.SendMsg("^vAr^", "requested-public-about", string(about), mt.ws)	
			}
			break;
		case "fetch-public-other":
			other := GetCollectionDocs("api","other");
			procon_data.SendMsg("^vAr^", "requested-public-other", string(other), mt.ws) 
			break;			
		case "update-menu-items":
			menu_item_udpate := procon_data.MenuItemUpdate{}
			err := json.Unmarshal([]byte(mt.data), &menu_item_udpate);	
			if err != nil { fmt.Println("Error updating site menu item") } else {
				//fmt.Println(menu_item_udpate)
				UpdateDocumentByKVSetKVStr("api","site_content","site_content_id","menu_items","menu_items."+string(menu_item_udpate.MenuItemIndex), menu_item_udpate.MenuItemText)
				sendSiteMenuItems(mt.ws)
			}
			break;

			
			
		case "create-new-logo": fallthrough
		case "create-new-other":	
			createType := "logos"
			returnType := "inserted-logo-id"
			
			if mt.task == "create-new-other" {
				createType = "other"
				returnType = "inserted-other-id"
			}
			
			result, insert_doc_id, err := InsertDocument("api", createType, []byte(mt.data))
			if err != nil { fmt.Println("Error inserting Images doc: ", err) }else {
				fmt.Println(result, insert_doc_id)	
				
				if mt.task == "create-new-logo" { sendNewLogos(mt.ws) } else if mt.task == "create-new-other" { sendNewOther(mt.ws)  }
				procon_data.SendMsg("^vAr^", returnType, insert_doc_id, mt.ws) 
				
			}				
			break
				
		case "fetch-admin-logos":
			logos := GetCollectionDocs("api","logos");
			procon_data.SendMsg("^vAr^", "requested-admin-logos", string(logos), mt.ws) 
			break
		case "fetch-admin-other":
			other := GetCollectionDocs("api","other");
			procon_data.SendMsg("^vAr^", "requested-admin-other", string(other), mt.ws) 
			break			
		case "delete-existing-logo":
			RemoveDocumentByOId("api","logos", mt.data);
			sendNewLogos(mt.ws)
			break
		case "delete-existing-other":
			RemoveDocumentByOId("api","other", mt.data);
			sendNewOther(mt.ws)
			break			
		case "update-existing-logo":
			lu := procon_data.LogoUpdate{}
			err := json.Unmarshal([]byte(mt.data),&lu)
			
			if err != nil { fmt.Println(err) }else {
				//fmt.Println(lu);
				objId, err := primitive.ObjectIDFromHex(lu.Id)
				if err != nil { fmt.Println(err) } else {
					collection := client.Database("api").Collection("logos")
					
					filter := bson.M{"_id": bson.M{"$eq": objId}}
					update := bson.M{"$set": bson.M{"bw_image_data": lu.BWImageData, "fc_image_data": lu.FCImageData, "show_on_desktop": lu.ShowOnDesktop, "show_on_mobile": lu.ShowOnMobile }}
					result, err := collection.UpdateOne(
						ctx,
					    filter,
					    update,					
					)
					if err != nil {
				        fmt.Println("UpdateOne() result ERROR:", err)
				        //os.Exit(1)
				    } else {
					    sendNewLogos(mt.ws)
				        fmt.Println("UpdateOne() result:", result)
				        fmt.Println("UpdateOne() result TYPE:", reflect.TypeOf(result))
				        fmt.Println("UpdateOne() result MatchedCount:", result.MatchedCount)
				        fmt.Println("UpdateOne() result ModifiedCount:", result.ModifiedCount)
				        fmt.Println("UpdateOne() result UpsertedCount:", result.UpsertedCount)
				        fmt.Println("UpdateOne() result UpsertedID:", result.UpsertedID)
				    }			
				}
			}
			break;
		case "update-existing-other":
			ou := procon_data.OtherUpdate{}
			err := json.Unmarshal([]byte(mt.data),&ou)
			
			if err != nil { fmt.Println(err) }else {
				//fmt.Println(ou);
				objId, err := primitive.ObjectIDFromHex(ou.Id)
				if err != nil { fmt.Println(err) } else {
					collection := client.Database("api").Collection("other")
					
					filter := bson.M{"_id": bson.M{"$eq": objId}}
					update := bson.M{"$set": bson.M{"title": ou.Title, "fg_image_data": ou.FGImageData, "bg_image_data": ou.BGImageData, "show_on_desktop": ou.ShowOnDesktop, "show_on_mobile": ou.ShowOnMobile }}
					result, err := collection.UpdateOne(
						ctx,
					    filter,
					    update,					
					)
					if err != nil {
				        fmt.Println("UpdateOne() result ERROR:", err)
				        //os.Exit(1)
				    } else {
					    sendNewOther(mt.ws)
				        fmt.Println("UpdateOne() result:", result)
				        fmt.Println("UpdateOne() result TYPE:", reflect.TypeOf(result))
				        fmt.Println("UpdateOne() result MatchedCount:", result.MatchedCount)
				        fmt.Println("UpdateOne() result ModifiedCount:", result.ModifiedCount)
				        fmt.Println("UpdateOne() result UpsertedCount:", result.UpsertedCount)
				        fmt.Println("UpdateOne() result UpsertedID:", result.UpsertedID)
				    }			
				}
			}
			break;	
			
		case "add-site-content-about-data":
			result, insert_doc_id, err := InsertDocument("api", "site_content", []byte(mt.data))
			if err != nil { fmt.Println("Error inserting Images doc: ", err) }else {
				fmt.Println(result, insert_doc_id)	
				
				sendAdminAboutData(mt.ws)
				procon_data.SendMsg("^vAr^", "inserted-admin-site-content-about-id", insert_doc_id, mt.ws) 
			}
			break;
		case "update-site-content-about-data":
			aau := procon_data.AdminAboutUpdate{} //aau == admin about update
			err := json.Unmarshal([]byte(mt.data),&aau)
			
			if err != nil { fmt.Println(err) }else {
				collection := client.Database("api").Collection("site_content")
				filter := bson.M{"site_content_id": bson.M{"$eq": "about" }}
				update := bson.M{"$set": bson.M{"title": aau.Title, "bio": aau.Bio, "profile_image_data": aau.ProfileImageData  }}
				result, err := collection.UpdateOne(
					ctx,
				    filter,
				    update,					
				)
				if err != nil {
			        fmt.Println("UpdateOne() result ERROR:", err)
			        //os.Exit(1)
			    } else {
				    sendNewOther(mt.ws)
			        fmt.Println("UpdateOne() result:", result)
			        fmt.Println("UpdateOne() result TYPE:", reflect.TypeOf(result))
			        fmt.Println("UpdateOne() result MatchedCount:", result.MatchedCount)
			        fmt.Println("UpdateOne() result ModifiedCount:", result.ModifiedCount)
			        fmt.Println("UpdateOne() result UpsertedCount:", result.UpsertedCount)
			        fmt.Println("UpdateOne() result UpsertedID:", result.UpsertedID)
			    }
			}	
			
			break;
		case "fetch-admin-site-content-about":
			sendAdminAboutData(mt.ws)
			break;			
		default:
			break;
	}
	//mt.ws.Unlock() -- moved to procon_data.SendMsg func... --
	fmt.Println("Attempted to Perform or Performed -> "+mt.task)
}
