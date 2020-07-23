package procon_data

import(
	"fmt"
	"encoding/json"
	
	"github.com/gorilla/websocket"
)

/* Email == Email || Alias */
type TryUser struct {
    Email    string     `json:"user"`
    Password string     `json:"password"`
}


type AUser struct {
   FullName 	string 		`json:"fullname"`
   Alias    	string      `json:"alias"`
   Email    	string		`json:"email"`
   Password 	string		`json:"password"`
   Role     	string		`json:"role"`   	
}


type Msg struct {
	Jwt  string `json:"jwt"`
	Type string `json:"type"`
	Data string	`json:"data"`
}


func SendMsg(j string, t string, d string, c *websocket.Conn) {
	
	m := Msg{j,t,d}
	
	c.Lock()
	if err := c.WriteJSON(m); err != nil {
		fmt.Println("Error sending websocket message: ", err);
	}
	c.Unlock();
}


type LogoUpdate struct {
	Id string `json:"_id"`
	ShowOnDesktop bool `json:"show_on_desktop"`
	ShowOnMobile  bool `json:"show_on_mobile"`
	BWImageData   string `json:"bw_image_data"`
	FCImageData	  string `json:"fc_image_data"`
}

type OtherUpdate struct {
	Id string `json:"_id"`
	Title string `json:"title"`
	ShowOnDesktop bool `json:"show_on_desktop"`
	ShowOnMobile  bool `json:"show_on_mobile"`
	FGImageData   string `json:"fg_image_data"`
	BGImageData	  string `json:"bg_image_data"`
}
 
 
type AdminAboutUpdate struct {
	Id string `json:"_id"`
	Title string `json:"title"`
	Bio string `json:"bio"`
	ProfileImageData   string `json:"profile_image_data"`
}
 
type MenuItemUpdate struct {
	MenuItemIndex json.Number `json:"menu_item_index"`
	MenuItemText string `json:"menu_item_text"`
}  
 