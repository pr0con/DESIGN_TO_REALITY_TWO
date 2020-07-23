import React, { useState, useEffect, createContext } from "react";
import axios from 'axios';
import { navigate } from 'hookrouter'; //export this for use everywhere

export const AppContext = createContext();
export default function(props) {	
	
	const [ rs, setRs ] = useState(0);
	const [ ws, setWs] = useState(null); 
	
	const [ wsId, setWsId ] = useState('');
	const [ jwt, setJwt ] = useState(null);	
	const [ verifiedJwt, setVerifiedJwt ] = useState(false);
	
	const [ user, setUser ] = useState('');
	const [ loading, setLoading ] = useState(true);
	
	
	/*
		Admin Logo & Other Data	
	*/
	const [ adminLogos, setAdminLogos ] = useState(null);
	const [ insertedLogoId, setInsertedLogoId ] = useState(null);
	
	const [ adminOther, setAdminOther ] = useState(null);
	const [ insertedOtherId, setInsertedOtherId ] = useState(null);
	
	
	/* 
		Admin About
	*/
	const [ adminAbout, setAdminAbout ] = useState(null);
	
	/* Menu Items */
	const [ menuItems, setMenuItems ] = useState([]);
	
	/* Public Logos */
	const [ publicLogos, setPublicLogos ] = useState(null);
	
	
	/* Public About */
	const [ publicAbout, setPublicAbout ] = useState(null);
	
	
	/* Public Other */
	const [ publicOther, setPublicOther ] = useState(null);
	
	
	/* Modal / Menu */
	const [ modalState, setModalState ] = useState('');
	
	const request = async(jwt, type, data) => {
		let payload = {
			jwt,
			type,
			data
		}
		ws.send(JSON.stringify(payload));
	}
	
	const heartbeat = async(ws) =>  {
		setTimeout(
			function() {
				//console.log(ws.readyState);
				/*  0 	CONNECTING 	Socket has been created. The connection is not yet open.
					1 	OPEN 	The connection is open and ready to communicate.
					2 	CLOSING 	The connection is in the process of closing.
					3 	CLOSED 	The connection is closed or couldn't be opened.	
				*/			
				if(rs !== ws.readyState) {
					setRs(ws.readyState);
				}
				heartbeat(ws)
			}
			.bind(this),
			1000	
		);
	} 
	
	const configureWebsocket = async() => {
		ws.onopen  = function(open_event) {
			ws.onmessage = function(event) {
				console.log(event);
				let tjo = JSON.parse(event.data);
			
				switch(tjo['type']) {
					case "client-websocket-id":
						setWsId(tjo['data']);
						break;
					case "jwt-token":
						setJwt(tjo['jwt']);
						setUser(JSON.parse(tjo['data']));						
						request(tjo['jwt'],'verify-jwt-token','noop');
					case "jwt-token-valid":
						setVerifiedJwt(true);
						break;
					case "stored-jwt-token-valid":
						let storedJwt = window.localStorage.getItem('SICKJWT');	
						setJwt(storedJwt);
						setVerifiedJwt(true);
						let storedUser = window.localStorage.getItem('User');
						setUser(JSON.parse(storedUser));				
						break;	
						
					case "inserted-logo-id":
						setInsertedLogoId(tjo['data']);
						break;
					case "inserted-other-id":
						setInsertedOtherId(tjo['data']);
						break;	
					
					case "requested-admin-logos":
						let admin_logos = JSON.parse(tjo['data']);
						setAdminLogos(admin_logos);
						break;	
						
					case "requested-admin-other":
						let admin_other = JSON.parse(tjo['data']);
						setAdminOther(admin_other);
						break;	
						
					case "requested-admin-site-cotent-about":
						let admin_about = JSON.parse(tjo['data']);
						setAdminAbout(admin_about);
						break;
						
					case "requested-site-menu-items":
						let menu_items = JSON.parse(tjo['data']);
						setMenuItems(menu_items['menu_items']);
						break;
					case "requested-public-logos":
						let public_logos = JSON.parse(tjo['data']);
						setPublicLogos(public_logos)
						break;						
					case "requested-public-about":
						let public_about = JSON.parse(tjo['data']);
						setPublicAbout(public_about);
						break;
					case "requested-public-other":
						let public_other = JSON.parse(tjo['data']);
						setPublicOther(public_other);
						break;						
					default:
						break;
				}		
			} 
			ws.onclose = function(close_event) {
				
			}
			ws.onerror = function(error_event) {
			
			}
			
			request( 'junk', 'fetch-menu-items', 'noop');
			request( 'junk', 'fetch-public-logos', 'noop');
			request( 'junk', 'fetch-public-about', 'noop');
			request( 'junk', 'fetch-public-other', 'noop');
		}
	} 
	
	/* 
		Make not run when loading from stored JWT... 
	*/
	useEffect(() => {
	    if (jwt !== null && verifiedJwt && loading === false) { 
		    //console.log(jwt);
		    console.log("JWT has been verified: "+verifiedJwt); 
		    window.localStorage.setItem('SICKJWT', jwt); 
		    
		    //extract and store user...
		    window.localStorage.setItem('User', JSON.stringify(user));
		}
	}, [verifiedJwt]);	
	
		
	useEffect(() => {
		if(verifiedJwt && user !== null) {
			navigate('/admin');
			
			request( jwt, 'fetch-admin-logos','noop');
			request( jwt, 'fetch-admin-other','noop');
			
			request( jwt, 'fetch-admin-site-content-about','noop');
		}
	},[verifiedJwt]);	
	
	
	useEffect(() => {
		if(rs === 1) {
			let storedJwt = window.localStorage.getItem("SICKJWT")
				
			if(storedJwt !== null) {
				let db64jwt = atob(storedJwt.split('.')[1])
				let psjwt = JSON.parse(db64jwt );
				let exp = new Date(psjwt['exp'] * 1000).toUTCString();
				let now = new Date(Date.now()).toUTCString();
				if(exp > now) {
					console.log('Stored Jwt Good');
					request(storedJwt,'validate-stored-jwt-token','noop');
				}
				if(exp < now) {
					window.localStorage.removeItem("SICKJWT");
					window.localStorage.removeItem("User");
				}
			} else if (storedJwt === null) {
				//notta
			}
		
		}
		setLoading(false);
	},[rs])
		
	useEffect(() => {
		if(ws === null) { setWs(new WebSocket('wss://void.pr0con.com:1200/ws')); }
		if(ws !== null && rs === 0) { configureWebsocket(); heartbeat(ws); }
	},[ws, rs])
	
	
	const doLogOut = () => {
		setJwt(null);
		setUser(null);
		setVerifiedJwt(null);
		window.localStorage.removeItem("SICKJWT");
		window.localStorage.removeItem("User");
	}
	
	return(
		<AppContext.Provider value={{
			jwt,
			
			request,
			navigate,
			
			user, 
			verifiedJwt,
			
			doLogOut,
			
			/* Admin Logos */
			adminLogos,
			insertedLogoId,
			setInsertedLogoId,
			
			/* Admin Other */
			adminOther,
			insertedOtherId,
			setInsertedOtherId,
			
			/* Admin About */
			adminAbout, 
			
			/* sites menu items */
			menuItems,
			setMenuItems,
			
			/* Public Data */
			publicLogos,
			publicAbout,
			publicOther,
			
			/* Modal / Hamburger */
			modalState, 
			setModalState,
		}}>
			{props.children}
		</AppContext.Provider>
	)
}