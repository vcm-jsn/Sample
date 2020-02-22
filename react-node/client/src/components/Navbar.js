import React from "react"
import styled from 'styled-components';

const NavWrapper = styled.div`
   width: 100%;
   color: #fff;
   display:flex;
   align-items: center;
   justify-content:space-between;   
   position: fixed;
   top: 0;
   left: 0;
   height:60px;
   padding: 0 1;
   background-color: #860d0d;
   `;

   const BurgerMenu = styled.div`
   cursor:pointer;
   padding: 10px 35px 16px 0px;
   & span.
   & span:before,
   & span:after {
       cursor: pointer;
       border-radius:1px;
       height: 5px;
       background: white;
       position: absolute;
       display: block;
       content: "";       
   }
   & span:before, {
       top: -10px;
   }
   & span:after, {
    bottom: -10px;
    }
    
   `;

   const NavBar = ({toggleMenu}) =>{
        return(
        <NavWrapper>

            <BurgerMenu onClick={() => {
                toggleMenu(true);
                console.log("Hamburger menu clicked, toggle open")

            }}
            ><span/> </BurgerMenu>
            <h1>Web app</h1>
            Welcome user1212
        </NavWrapper>      
     );

   };
   export default  NavBar;