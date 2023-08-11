import Product from './Product';
import styles from './ProductList.module.css';
// import PropTypes from 'prop-types';
// import { productsType } from '../types';
import Book from './Book';

interface Props {
  itemsInCart: string[];
  addToCart: (id : string) => void;
  removeFromCart: (id : string) => void;
  products: Book[] | [];
};

function ProductList(props : Props) {
  const itemsInCart = props.itemsInCart;
  return (
    <ul className={styles.productList}>
      {props.products.map((product) => (
        <li key={product.id} className={styles.productListItem}>
          <Product
            {...product}
            inCart={itemsInCart.includes(product.id) ? '1' : ''}
            addToCart={props.addToCart}
            removeFromCart={props.removeFromCart}
          />
        </li>
      ))}
    </ul>
  );
}

// ProductList.propTypes = {
//   itemsInCart: PropTypes.array.isRequired,
//   addToCart: PropTypes.func.isRequired,
//   removeFromCart: PropTypes.func.isRequired,
//   products: productsType,
// };

// ProductList.defaultProps = {
//   itemsInCart: [],
//   products: [],
// };

export default ProductList;
