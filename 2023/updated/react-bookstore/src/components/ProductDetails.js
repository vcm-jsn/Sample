function ProductDetails(props) {
  const { title, author, published, country, lang, pages, url, price } = props;
  return (
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
        link: {url}
      </p>
    </div>
  );
}

export default ProductDetails;
