import React, {useState, useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { Checkbox, Radio } from 'antd'
import { Prices } from '../components/Prices'
import { Navigate, useNavigate } from 'react-router-dom'

const HomePage = () => {

  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [checked, setChecked] = useState([])
  const [radio, setRadio] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  //get products
  const getAllProducts = async() => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/product/product-list/${page}`)
      setLoading(false)
      setProducts(data.products)
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }

  useEffect(() => {
    if(!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length])

  useEffect(() => {
    if(checked.length || radio.length) filterProduct();
  }, [checked, radio])

  //get categories
  const getAllCategory = async(req, res) => {
    try {
        const { data } = await axios.get('/api/category/get-category')
        if(data?.success) {
            setCategories(data?.category)
        }
    } catch (error) {
        console.log(error);
    }
}

useEffect(() => {
    getAllCategory();
    getTotal();
}, []);

//handle Filter
const handleFilter = (value, id) => {
  let all = [...checked]
  if(value){
    all.push(id)
  } else {
    all = all.filter(c => c!==id)
  }
  setChecked(all)
}

//getTotal Count
const getTotal = async () => {
  try {
    const {data} = await axios.get('/api/product/product-count')
    setTotal(data?.total)
  } catch (error) {
    console.log(error);
  }
}

useEffect(() => {
  if(page === 1) return;
  loadMore()
}, [page])

//load more
const loadMore = async() => {
  try {
    setLoading(true)
    const {data} = await axios.get(`/api/product/product-list/${page}`)
    setLoading(false)
    setProducts([...products,...data?.products])
  } catch (error) {
    console.log(error);
    setLoading(false)
  }
}

//get filtered products
const filterProduct = async() => {
  try {
    const {data} = await axios.post('/api/product/filter-products', {checked, radio})
    setProducts(data?.products)
  } catch (error) {
    console.log(error);
  }
}

  return (
    <Layout title={'All Products - Best Offers'}>
      <div className='container-fluid m-3 p-3'>
        <div className='row mt-2'>
          <div className='col-md-2'>
          <h4 className='text-center'>Filter by Category</h4>
          <div className='d-flex flex-column'>
          {
            categories?.map((c) => 
            <Checkbox key = {c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
              {c.name}
            </Checkbox>)
          }
          </div>

          {/* Price Filter */}
          <h4 className='text-center mt-4'>Filter by Price</h4>
          <div className='d-flex flex-column'>
          <Radio.Group onChange={e => setRadio(e.target.value)}>
            {Prices?.map(p => (
              <div key={p._id}>
                <Radio value={p.array}>{p.name}</Radio>
              </div>
            ))}
          </Radio.Group>
          </div>
          <div className='d-flex flex-column'>
            <button className='btn btn-danger mt-4' onClick={()=>window.location.reload()}>RESET FILTERS</button>
          </div>
          </div>

          <div className='col-md-10'>
            <h1 className='text-center'>All Products</h1>
            <div className='d-flex flex-wrap justify-content-center'>
                  {products?.map(p => (
                      <div className="card m-2" style={{width: '18rem'}} key={p._id}>
                      <img src={`/api/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">{p.description.substring(0, 30)}...</p>
                        <p className="card-text">$ {p.price}</p>
                        <button className='btn btn-primary ms-1' onClick={()=>navigate(`/product/${p.slug}`)}>More Detail</button>
                        <button className='btn btn-secondary ms-1'>ADD TO CART</button>
                      </div>
                      </div>
                    ))}
            </div>
            <div className='m-2 p-3'>
              {products && products.length < total && (
                <button className='btn btn-warning' onClick={(e) => {
                  e.preventDefault()
                  setPage(page + 1);
                }}>
                  {loading ? "Loading..." : "Load More"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage