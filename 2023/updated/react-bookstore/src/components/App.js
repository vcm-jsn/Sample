//import logo from "./logo.svg";
import { Component } from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import "./App.css";
import productsData from "../data/products";
//import { useState } from "react";
import { useState, useEffect } from "react";
import * as actionCreators from "../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

function App(props) {
  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   itemsInCart: ["10", "14", "16"],
  //   //   firstName: "Siri",
  //   // };
  //   this.state = {
  //     itemsInCart: [],
  //     products: [],
  //     loading: false,
  //     firstName: "Siri",
  //   };
  //   this.addToCart = this.addToCart.bind(this);
  //   this.removeFromCart = this.removeFromCart.bind(this);
  // }
  // const [itemsInCart, setItemsInCart] = useState([]);
  // const [products, setProducts] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shuffledProductList, setShuffledProductList] = useState([]);
  const firstName = "Siri";
  const {
    products,
    itemsInCart,
    loadProducts,
    addToCart,
    removeFromCart,
    submitCart,
    readCart,
  } = props;

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setIsLoading(true);
  //       const response = await fetch("/data/products.json");
  //       const json = await response.json();
  //       shuffleArray(json);
  //       setProducts(json);
  //       setIsLoading(false);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }
  //   fetchData();
  // }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://localhost:3000/data/products.json"
        );
        const json = await response.json();

        loadProducts(json);
        readCart();
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, [loadProducts, readCart]);

  // componentDidMount() {
  //   this.setState({ loading: true });
  //   fetch("http://localhost:3000/data/products.json")
  //     .then((response) => response.json())
  //     .then((products) => this.shuffleArray(products))
  //     .then((products) => {
  //       this.setState({ products: products, loading: false });
  //     });
  // }

  useEffect(() => {
    let shuffled = shuffleArray(props.products);
    setShuffledProductList(shuffled);
  }, [props.products]);

  function shuffleArray(array) {
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

  // function addToCart(id) {
  //   let newItems = [...itemsInCart, id];
  //   setItemsInCart(newItems);
  // }

  // function removeFromCart(idToRemove) {
  //   let newItems = itemsInCart.filter((id) => id !== idToRemove);
  //   setItemsInCart(newItems);
  // }
  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }
  //let firstName = "Siri";
  //const [itemsInCart, setItemsInCart] = useState(["10", "14", "16", "4"]);

  return (
    <div data-testid="app" className="container">
      <Header firstName={firstName} />
      <Main
        products={products}
        itemsInCart={itemsInCart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        submitCart={submitCart}
      />
      {/* <Main
        products={products}
        itemsInCart={itemsInCart}
        setItemsInCart={setItemsInCart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      /> */}
      <Footer firstName={firstName} />
    </div>
  );
}
const mapStateToProps = (state, props) => {
  return {
    itemsInCart: state.cart.items,
    products: state.products.products,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

//export default App;
