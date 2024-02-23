import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const app = createApp({
  data(){
    return {
      user: {
        username: '',
        password: '',
      }
    }
  },
  methods: {
    login(){
      const api = `${apiUrl}/v2/admin/signin`;
      axios.post(api, this.user)
        .then((res)=>{
          const { token, expired } = res.data;
          document.cookie = `adminAccount=${token}; expires=${new Date(expired)}; path=/`;
          window.location = 'product.html';
        })
        .catch((err)=>{
          console.log(err);
          alert(err.response.data.message);
        });
    },
  },
});

app.mount('#app');