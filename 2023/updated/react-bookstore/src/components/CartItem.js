import styles from "./CartItem.module.css";
import PropTypes from "prop-types";

function CartItem({ title = "", price = "" }) {
  return (
    <div className={styles.cartItem} data-testid="cartitem">
      {title} - {price}
    </div>
  );
}

CartItem.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
};
CartItem.defaultProps = {
  title: "",
  price: "",
};

export default CartItem;
