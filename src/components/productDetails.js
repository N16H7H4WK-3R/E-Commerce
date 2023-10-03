import React, { useEffect, useState } from 'react';
import styles from './componentCss/productDetails.module.css';
import Carousel from 'react-bootstrap/Carousel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShopDetails = () => {
    const { productId } = useParams();
    const [productData, setProductData] = useState(null);
    const navigate = useNavigate();

    const notifyCart = () => {
        toast.success('Item added to cart !', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            theme: "dark",
        });
    };

    const notifyFav = () => {
        toast.success('Item added to favorite ♥', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            theme: "dark",
        });
    };

    const handleAddToCartClick = async (productData) => {
        try {
            const token = sessionStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const formData = new FormData();
            formData.append('item_id', 25);
            formData.append('quantity', 1);

            const response = await axios.post(
                'http://127.0.0.1:8000/services/cart/',
                formData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                notifyCart();
            } else {
                console.error('Error adding item to cart:', response);
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            if (error.response) {
                console.error('Response Data:', error.response.data);
                console.error('Response Status:', error.response.status);
            }
        }
    };


    const handleAddToFavClick = () => {
        notifyFav();
    };

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/services/detail/${productId}/`)
            .then(response => {
                setProductData(response.data);
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    }, [productId]);

    return (
        <>
            {productData && (
                <div className={styles.container}>
                    <Carousel className={styles.carousel}>
                        {productData.imageUrl1 && (
                            <Carousel.Item>
                                <img
                                    className={styles.images}
                                    src={productData.imageUrl1}
                                    alt="First slide"
                                />
                            </Carousel.Item>
                        )}
                        {productData.imageUrl2 && (
                            <Carousel.Item>
                                <img
                                    className={styles.images}
                                    src={productData.imageUrl2}
                                    alt="Second slide"
                                />
                            </Carousel.Item>
                        )}
                        {productData.imageUrl3 && (
                            <Carousel.Item>
                                <img
                                    className={styles.images}
                                    src={productData.imageUrl3}
                                    alt="Third slide"
                                />
                            </Carousel.Item>
                        )}
                    </Carousel>
                    <div className={styles.product}>
                        <h1 style={{ color: 'black' }}>{productData.productTitle}</h1>
                        <h2 style={{ color: 'black' }}>{productData.productPrice}</h2>
                        <p className={styles.desc}>{productData.productDescription}</p>
                        <div className={styles.buttons}>
                            <button className={styles.add} onClick={handleAddToCartClick}>Add to Cart</button>
                            <button className={styles.like} onClick={handleAddToFavClick}><span>♥</span></button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </>
    );
};

export default ShopDetails;