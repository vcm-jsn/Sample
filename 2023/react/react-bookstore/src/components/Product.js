import styles from "./Product.module.css";
import ProductDetails from "./ProductDetails";

function Product(props) {
  const { title, author, published, country, lang, pages, image, url, price } =
    props;
  const click = () => {
    console.log("click");
  };
  function handleClick() {
    if (props.inCart) {
      props.removeFromCart(props.id);
    } else {
      props.addToCart(props.id);
    }
  }
  return (
    <>
      <div>
        {
          <img
            onClick={click}
            className={styles.thumbnail}
            src={image ? "images/" + image : "images/default.jpg"}
            alt={title}
          />
        }
        <div>
          <h2>{title}</h2>
          <p>
            by: {author}
            <br />
            published:{published}, {country}
            <br />
            language: {lang}
            <br />
            pages: {pages}
            <br />
            price: {price}
            <br />
            {url ? <a href={url}>more info</a> : ""}
          </p>
          <button onClick={handleClick}>
            {props.inCart ? "In Cart" : "Add to Cart"}
          </button>{" "}
        </div>
      </div>
    </>
  );
}

export default Product;
