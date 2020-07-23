package procon_utils

import(
	"fmt"
	
	"encoding/json"
	b64 "encoding/base64"
	
	"golang.org/x/crypto/bcrypt"
	
	"procon_data"
)

func B64DecodeTryUser(test_user_json_str string) ([]byte,[]byte, error) {
	var tu procon_data.TryUser
	err := json.Unmarshal([]byte(test_user_json_str), &tu)
	
	if err != nil { fmt.Println(err); return nil, nil, err } else {
		tu_u_sDec, _ := b64.StdEncoding.DecodeString(string(tu.Email))
		tu_p_sDec, _ := b64.StdEncoding.DecodeString(string(tu.Password))
		
		return tu_u_sDec, tu_p_sDec, nil
	}
	
}


func GenerateUserPassword( pwdstr string) (string) {
	hp, err := bcrypt.GenerateFromPassword([]byte(pwdstr), 0)
	if	err != nil {
		fmt.Println("Error Generating b-crypted password: ", err)
	}
	return string(hp)
}


func ValidateUserPassword(tryPass []byte, byteHash []byte) (bool, error) {
	err := bcrypt.CompareHashAndPassword(byteHash, tryPass)
	if err != nil { return false, err }else { return true, nil }
}