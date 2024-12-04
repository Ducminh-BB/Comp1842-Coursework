// create a component

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `<div class="product">
            <div class="product-image">
                <img :src="image" alt="">
            </div>

            <div class="product-info">
                <h1> {{ title }} </h1>

                <p v-if="inStock">In Stock</p>
                <p v-else>Out of Stock</p>
                <p>Shipping: {{ shipping }}</p>

                <ul>
                    <li v-for="detail in details"> {{ detail }} </li>
                </ul>

                <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
                :style="{ backgroundColor: variant.variantColor}"
                @mouseover="updateProduct(index)">
                </div>

                <button 
                @click="addToCart" :disabled="!inStock"
                :class="{disabledButton: !inStock}">Add To Cart</button>
            </div>

            <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>

            <product-review @review-submitted="addReview"></product-review>
        </div>`,
    
    data() {
        return {
            // the data contain property-value pair
            product: 'Socks',
            brand: 'Vue Mastery',
            selectedVariant: 0, // accessed by index
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    },

    // all the methods we want to embed on html tag will be defined below
    methods: {
        // function to append the number of product on the cart
        addToCart: function() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        // function to change the image of product based on variants
        updateProduct: function(index){
            this.selectedVariant = index
        },
        
        addReview(productReview){
            this.reviews.push(productReview)
        }

    },
    // computed: to calculate a value rather than store a value
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },

        image() {
            return this.variants[this.selectedVariant].variantImage
        },

        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },

        shipping() {
            return (this.premium) ? "Free" : 2.99
        }
    }
})

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="submitError">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">
                    {{ error }}
                </li>
            </ul>
        </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            submitError: false
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating){
                this.submitError = false

                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                
                this.name = null
                this.review = null
                this.rating = null
            }
            else{
                this.submitError = true
                this.errors = []
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
            }           
            
        }
        

    }
})

// we create new instance which has the id the same with the id we defined
var app = new Vue({
    el: '#app',// el: to activate Vue on the div with id: app
    data: {
        premium: true,
        cart: []
        
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
})