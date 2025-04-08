export const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : '';
  };
  
  export const formatPrice = (price) => {
    return (Number(price) || 0).toFixed(2);
  };
  
  export const orderTotal = (products) => {
    return products?.reduce((sum, p) => sum + (p.quantity * p.price), 0) || 0;
  };
  