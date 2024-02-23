import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from './pagination.js';
import productModal from './productModal.js';

const app = createApp({
  data(){
    return{
      products:[],
      tempProduct: {
        imageUrl: [] //多圖
      },
      modalProduct: null,
      modalDel: null,
      isNew: false,
      pages: {}
    }
  },
  methods:{
    getProducts(page = 1){ //參數預設值  
      const api = `${apiUrl}/v2/api/${apiPath}/admin/products?page=${page}`;
      axios.get(api)
        .then(res =>{
          this.products = res.data.products
          this.pages = res.data.pagination
        })
        .catch(err =>{
          alert(err.data.message);
        });
    },
    openModal(status, product){
      if(status === 'new'){
        this.tempProduct = {
          imagesUrl: []
        }
        this.isNew = true
        this.$refs.opencloseModal.openModal()
      }else if(status === 'edit'){
        this.tempProduct = {...product}
        if(!Array.isArray(this.tempProduct.imagesUrl)){
          this.tempProduct.imagesUrl = []
        }
        this.isNew = false
        this.$refs.opencloseModal.openModal()
      }else if(status === 'delete'){
        this.tempProduct = {...product}
        this.modalDel.show()
      }
    },
    updateProduct(){
      //新增
      let api = `${apiUrl}/v2/api/${apiPath}/admin/product`;
      let method = 'post'

      //更新
      if(!this.isNew){
        api = `${apiUrl}/v2/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put'
      }
      axios[method](api, { data: this.tempProduct })
        .then(res =>{
          this.getProducts()
          this.$refs.opencloseModal.closeModal()
          this.tempProduct = {}
      })
    },
    deleteProduct(){
      const api = `${apiUrl}/v2/api/${apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(api)
      .then(res =>{
        this.getProducts()
        this.modalDel.hide()
    })
    }
  },
  mounted(){
    // 取得 Token（Token 僅需要設定一次）
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)adminAccount\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
    // 夾帶token在header中，只要加入一次就可以重複使用
    axios.defaults.headers.common['Authorization'] = token;
    this.getProducts()

    this.modalDel = new bootstrap.Modal(this.$refs.delProductModal)
  },
  components :{
    pagination,
    productModal
  }
})

app.mount('#app')