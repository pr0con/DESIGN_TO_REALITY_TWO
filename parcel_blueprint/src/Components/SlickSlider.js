import React, { useState, useEffect, useContext } from "react";
import styled from 'styled-components';
import Slick from "react-slick";
import shortid from 'shortid';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const StyledSlickSlider = styled.div`
	.slick-slider {
		.slick-arrow {
			background: #F7F7F7;
			border: 2px solid rgba(159, 52, 52, .05);
			width: 5rem;
			height: 5rem;
			border-radius: 1rem;
			
			
			&.slick-prev:before,
			&.slick-next:before {
				display:none;	
			}
			
			&.slick-prev,
			&.slick-next {
				display: flex !important;
				align-items: center;
				justify-content: center;				
			}			

		}
		
		.slick-dots {
			text-align: left;
			padding-left: 2rem;
			li button:before {
				color: #9F3434;
			}
			li.slick-active button:before {
				opacity: 1;
			}			
		}	
	}
	
	.slick-slider.logos {
		.slick-slide>div {
			padding: 2rem;

			.slick-box {
				min-width: 22.5rem;
				min-height: 22.5rem;
				box-shadow: 0px 3px 6px rgba(0,0,0,.16);
				border-radius: .9rem;
				overflow: hidden;
				display: flex !important;
				align-items: center;
				justify-content: center;
				
				img.slick-slide-img {
					width: 100%;
					height: 100%;
					object-fit: cover;					
				}
				
				&:hover { cursor:pointer; }
			}
		}
	}
	
	.slick-slider.other {
		.slick-slide>div {
			padding: 2rem;

			.slick-box {
				min-width: 36.5rem;
				min-height: 22rem;
				box-shadow: 0px 3px 6px rgba(0,0,0,.16);
				border-radius: .9rem;
				overflow: hidden;
				display: flex !important;
				align-items: center;
				justify-content: center;
				
				img.slick-slide-img {
					width: 100%;
					height: 100%;
					object-fit: cover;					
				}
				
				&:hover { cursor:pointer; }
			}
		}
	}		
`;

/*
	<svg xmlns="http://www.w3.org/2000/svg" width="6.1" height="9.4" viewBox="0 0 6.1 9.4">
	  <g id="Symbol_85" data-name="Symbol 85" transform="translate(0 9.4) rotate(-90)">
	    <path id="Path_36" data-name="Path 36" d="M4.7,0,0,4.7,1.4,6.1,4.7,2.8,8,6.1,9.4,4.7Z" transform="translate(0 0)" fill="#9f3434"/>
	  </g>
	</svg>


	<svg xmlns="http://www.w3.org/2000/svg" width="6.1" height="9.4" viewBox="0 0 6.1 9.4">
	  <g id="Symbol_85" data-name="Symbol 85" transform="translate(-702 692.4) rotate(-90)">
	    <path id="Path_36" data-name="Path 36" d="M6.7,8.1,2,3.4,3.4,2,6.7,5.3,10,2l1.4,1.4Z" transform="translate(681 700)" fill="#9f3434"/>
	  </g>
	</svg>
*/




function SamplePrevArrow(props) {
	const { className, style, onClick } = props;
	return (
		<div className={className} style={{ ...style, display: "block" }} onClick={onClick}>	
			<svg xmlns="http://www.w3.org/2000/svg" width="6.1" height="9.4" viewBox="0 0 6.1 9.4">
			  <g id="Symbol_85" data-name="Symbol 85" transform="translate(0 9.4) rotate(-90)">
			    <path id="Path_36" data-name="Path 36" d="M4.7,0,0,4.7,1.4,6.1,4.7,2.8,8,6.1,9.4,4.7Z" transform="translate(0 0)" fill="#9f3434"/>
			  </g>
			</svg>			
		</div>
    );
}

function SampleNextArrow(props) {
	const { className, style, onClick } = props;
	return (
		<div className={className} style={{ ...style, display: "block"  }} onClick={onClick}>
			<svg xmlns="http://www.w3.org/2000/svg" width="6.1" height="9.4" viewBox="0 0 6.1 9.4">
			  <g id="Symbol_85" data-name="Symbol 85" transform="translate(-702 692.4) rotate(-90)">
			    <path id="Path_36" data-name="Path 36" d="M6.7,8.1,2,3.4,3.4,2,6.7,5.3,10,2l1.4,1.4Z" transform="translate(681 700)" fill="#9f3434"/>
			  </g>
			</svg>
		</div>
    );
}

//https://react-slick.neostack.com/docs/example/custom-arrows/
/* 
	May want to pass slidesToShow as a prop
	May want to just pass setInsertedLogoId & setInsertedOtherId to a global= prop
*/
export function SlickSlider({ sliderFor, dataObjAry, setInsertedLogoId, setInsertedOtherId, resetFunc  }) {
	let slidesToShow = 5;
	(sliderFor === "other") ? slidesToShow = 3 : '';
	
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		arrows: true,
		slidesToShow: slidesToShow,
		slidesToScroll: slidesToShow, //keep same as to show...
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />
	}
	
	const [ boxes, setBoxes  ] = useState([]);
	
	useEffect(() => {
		let tmpary = Array(20).map(function() { return 0; })
		setBoxes([...tmpary]);
	},[]);
	
	
	return(
		<StyledSlickSlider>
			<Slick {...settings} className={`${sliderFor}`}>
				{ boxes.length > 0 && boxes.map((box,i) => (
					<div className={`slick-box`} key={shortid.generate()} onClick={(e) => { 
						if(typeof dataObjAry[i] !== 'undefined')  {
							if(sliderFor === "logos") { 
								setInsertedLogoId(dataObjAry[i]['_id']);
							} else {
								setInsertedOtherId(dataObjAry[i]['_id']);
							}
						} else if  (typeof dataObjAry[i] === 'undefined') {
							resetFunc()
						}
					}}>
						{ (dataObjAry[i] && sliderFor === "logos")  &&
							<img src={dataObjAry[i]['bw_image_data']} className="slick-slide-img" /> 
						}
						{ (dataObjAry[i] && sliderFor === "other")  &&
							<img src={dataObjAry[i]['fg_image_data']} className="slick-slide-img" /> 
						}						
					</div>
				))}		
			</Slick>
		</StyledSlickSlider>
	)
}