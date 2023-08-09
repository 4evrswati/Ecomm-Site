import React, {useState, useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const ProductDetails = () => {
    const params = useParams()
    const [singleProduct, setSingleProduct] = useState({})
    const [relatedProduct, setRelatedProduct] = useState([])

    const getProduct = async (req, res) => {
        try {
            const {data} = await axios.get(`/api/product/get-product/${params.slug}`)
            setSingleProduct(data?.product)
            getSimilarProduct(data?.product._id, data?.product.category._id)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(params?.slug)
            getProduct()
    }, [params?.slug])

    //get similar product
    const getSimilarProduct = async(pid, cid) => {
        try {
            const {data} = await axios.get(`/api/product/related-product/${pid}/${cid}`)
            setRelatedProduct(data?.products)
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <Layout>
        <div className='row container mt-4'>
            <div className='col-md-6'>
                <img src={`/api/product/product-photo/${singleProduct._id}`} className="card-img-top" alt={singleProduct.name} />
            </div>
            <div className='col-md-6 justify-'>
                <h1 className='text-center'>Product Details</h1>
                <h6>Name : {singleProduct.name}</h6>
                <h6>Description : {singleProduct.description}</h6>
                <h6>Price : {singleProduct.price}</h6>
                <h6>Category : {singleProduct?.category?.name}</h6>
                <button className='btn btn-secondary ms-1'>ADD TO CART</button>
            </div>
        </div>
        <hr />
        <div className='row container mt-4'>
            <h6>Similar Products</h6>
            {relatedProduct.length < 1 && (<p className='text-center'>No Similar Products Found</p>)}
            <div className='d-flex flex-wrap justify-content-center'>
                  {relatedProduct?.map(p => (
                      <div className="card m-2" style={{width: '18rem'}} key={p._id}>
                      <img src={`/api/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">{p.description.substring(0, 30)}...</p>
                        <p className="card-text">$ {p.price}</p>
                        <button className='btn btn-secondary ms-1'>ADD TO CART</button>
                      </div>
                      </div>
                    ))}
            </div>
        </div>
    </Layout>
  )
}

export default ProductDetails