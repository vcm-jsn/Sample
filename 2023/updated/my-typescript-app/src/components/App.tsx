//import logo from "./logo.svg";
import { Component } from "react";
import Header from "./Header.js";
import Main from "./Main";
import Footer from "./Footer.js";
import "./App.css";
//import productsData from "../data/products";
//import { useState } from "react";
import { useState, useEffect } from "react";
import Book from "./Book";

function App() {
  const [itemsInCart, setItemsInCart] = useState<Array<string>>([]);
  const [products, setProducts] = useState<Array<Book>>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const firstName = "Siri";

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://localhost:3000/data/products.json"
        );
        const json = await response.json();
        setProducts(shuffleArray(json));
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, [setProducts]);

  function shuffleArray(array: Book[]) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  // function addToCart(id) {
  //   let newItems = [...this.state.itemsInCart, id];
  //   this.setState({
  //     itemsInCart: newItems,
  //   });
  // }
  // function removeFromCart(idToRemove) {
  //   let newItems = this.state.itemsInCart.filter((id) => id !== idToRemove);
  //   this.setState({ itemsInCart: newItems });
  // }

  function addToCart(id: string) {
    let newItems = [...itemsInCart, id];
    setItemsInCart(newItems);
  }

  function removeFromCart(idToRemove: string) {
    let newItems = itemsInCart.filter((id) => id !== idToRemove);
    setItemsInCart(newItems);
  }
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div data-testid="app" className="container">
      <Header firstName={firstName} />
      <Main
        products={products}
        itemsInCart={itemsInCart}
        //setItemsInCart={setItemsInCart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
      <Footer firstName={firstName} />
    </div>
  );
}

export default App;
