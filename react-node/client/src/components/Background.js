import React from "react"
import styled from 'styled-components';

const BackgroundStyled = styled.div`
   width: 100%;
   z-index: 100;
   height: 100%;
   position: fixed;
   top: 0;
   left: 0;
   background-color: rgba(0, 0, 0, 0.7);
   opacity: ${props => (props.show ? "1" : "0")};
   visibility: ${props => (props.show ? "visible" : "hidden")};
   transistion: all 0.3s;
   `;

   const Background = ({show, setIsOpened}) =>{
        return(

        <BackgroundStyled
        onClick = {() => {
            setIsOpened(false);
            console.log("Background clicked. close sidebar");
        }}
        show ={show? 1:0}
        />
     );

   }
   export default  Background;