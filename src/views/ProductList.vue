<template>
  <div>

    <v-snackbar v-model="alert.show" :timeout="alert.timeout" :color="alert.color" top>
      {{ alert.message }}
      <v-btn text @click="alert.show = false">Close</v-btn>
    </v-snackbar>

    <v-subheader class="py-0 d-flex justify-space-between rounded-lg">
            <h3>Product List</h3>
            <v-btn color="primary" @click="showCreateDialog = true">Create Product</v-btn>
        </v-subheader>
    <v-col>
      <v-card>
        <v-data-table :headers="headers" :items="products" :items-per-page="5"
          class="elevation-1">
    
          <template v-for="header in headers" v-slot:[`item.${header.value}`]="{ item }">
            <template v-if="header.value === 'name'">
              {{ item[header.value] }}
            </template>
            <template v-else-if="header.value === 'Images'">
              <div v-for="(image, index) in item[header.value]" :key="index">
                <img :src="`/storage/${image}`" alt="Product Image" style="width: 100px; height: 100px;">
              </div>
            </template>
            <template v-else-if="header.value === 'DateTime'">
              {{ formatDateTime(item[header.value]) }}
            </template>
            
            <div v-else-if="header.value === 'actions'" :key="header.value" style="display: flex; gap: 10px;">
              <v-btn color="primary" @click="viewProduct(item)">View</v-btn>
              <v-btn color="warning" @click="editProduct(item)">Edit</v-btn>
              <v-btn color="error" @click="confirmDelete(item)">Delete</v-btn>
              <v-dialog v-model="deleteConfirmation" max-width="400">
                <v-card>
                  <v-card-title>Confirm Deletion</v-card-title>
                  <v-card-text>Are you sure you want to delete this product?</v-card-text>
                  <v-card-actions>
                    <v-btn color="error" @click="deleteConfirmed(item)">Yes, Delete</v-btn>
                    <v-btn @click="cancelDelete">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
            <div v-else :key="header.value">
              {{ item[header.value] }}
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-col>

    <v-dialog v-model="showCreateDialog" max-width="500" @input="cancelCreate">
    <v-card>
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1">Step 1</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 2" step="2">Step 2</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 3" step="3">Step 3</v-stepper-step>
        </v-stepper-header>

        <!-- Step 1 -->
        <v-stepper-content step="1">
          <v-card-title>Create New Product - Step 1</v-card-title>
          <v-form ref="step1Form" @submit.prevent="validateStep1">
            <v-text-field
              v-model="newProduct.name"
              :class="{'error--text': shouldShowError('name')}"
              label="Name"
            ></v-text-field>
            <v-select
              v-model="newProduct.category"
              :items="categoryOptions"
              :class="{'error--text': shouldShowError('category')}"
              label="Category"
            ></v-select>
            
            <!-- <v-text-field -->
              <!-- v-model="newProduct.description" -->
              <!-- :class="{'error--text': shouldShowError('description')}" -->
              <!-- label="Description" -->
            <!-- ></v-text-field> -->
            <v-textarea
              v-model="newProduct.description"
              label="Product Description"
              outlined
              rows="10"
              counter="1500" 
            ></v-textarea>
            <v-btn type="submit" color="primary">Next</v-btn>
          </v-form>
        </v-stepper-content>

        <!-- Step 2 -->
        <v-stepper-content step="2">
          <v-card-title>Create New Product - Step 2</v-card-title>
          <v-form ref="step2Form" @submit.prevent="validateStep2">
            <v-file-input multiple accept="image/*" v-model="selectedFiles"></v-file-input>
            <v-btn type="submit" color="primary">Next</v-btn>
          </v-form>
        </v-stepper-content>

        <!-- Step 3 -->
        <v-stepper-content step="3">
          <v-card-title>Create New Product - Step 3</v-card-title>
          <v-form ref="step3Form" @submit.prevent="validateStep3">
            <v-date-picker v-model="newProduct.date" scrollable></v-date-picker>
            <v-time-picker v-model="newProduct.time" format="24hr"></v-time-picker>
            <!-- <v-btn type="submit" color="primary">Create Product</v-btn> -->
            <v-btn :disabled="!newProduct.date || !newProduct.time" type="submit" color="primary">Create Product</v-btn>
          </v-form>
        </v-stepper-content>
        
      </v-stepper>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showEditDialog" max-width="500" @input="cancelEdit">
    <v-card>
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1">Step 1</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 2" step="2">Step 2</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 3" step="3">Step 3</v-stepper-step>
        </v-stepper-header>

        <!-- Step 1 -->
        <v-stepper-content step="1">
          <v-card-title>Edit Product - Step 1</v-card-title>
          <v-form ref="step1Form" @submit.prevent="updateStep1">
            <v-text-field v-model="editStep1.name" label="Name"></v-text-field>
            <v-select v-model="editStep1.category" :items="categoryOptions" label="Category"></v-select>
            <v-textarea v-model="editStep1.description" label="Product Description" outlined rows="10" counter="1500"></v-textarea>
            <v-btn @click="step = 2" color="primary">Next</v-btn>
          </v-form>
        </v-stepper-content>

        <!-- Step 2 -->
        <v-stepper-content step="2">
          <v-card-title>Edit Product - Step 2</v-card-title>
          <v-form ref="step2Form" @submit.prevent="updateStep2">
            <v-file-input multiple accept="image/*" v-model="selectedFiles"></v-file-input>
            <v-btn @click="step = 3" color="primary">Next</v-btn>
          </v-form>
        </v-stepper-content>

        <!-- Step 3 -->
        <v-stepper-content step="3">
          <v-card-title>Edit Product - Step 3</v-card-title>
          <v-form ref="step3Form" @submit.prevent="updateStep3">
            <v-date-picker v-model="editStep3.date" scrollable></v-date-picker>
            <v-time-picker v-model="editStep3.time" format="24hr"></v-time-picker>
            <v-btn :disabled="!editStep3.date || !editStep3.time" type="submit" color="primary">Update Product</v-btn>
          </v-form>
        </v-stepper-content>


      </v-stepper>
    </v-card>
  </v-dialog>

    <v-dialog v-model="showProductDetailsDialog" max-width="500">
    <v-card>
      <v-card-title>Product Details</v-card-title>
      <v-card-text v-if="selectedProduct">
        <div>
          <strong>Name:</strong> {{ selectedProduct.Name }}
        </div>
        <div>
          <strong>Description:</strong> {{ selectedProduct.Description }}
        </div>
        <div>
          <strong>Category of the product:</strong> {{ selectedProduct.Category }}
        </div>
        <div>
          <strong>Images:</strong> {{ selectedProduct.Images }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="showProductDetailsDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

 

  </div>
</template>

<script>
import axios from 'axios';
export default {

  data() {
    return {
      step1Errors: {},
      selectedFiles: [],
      selectedProduct: {},
      showEditDialog: false,
      showCreateDialog: false,
      step: 1,
      newProduct: {
          name: '',
          category: '',
          description: '',
          images: []
        },
        editStep1: {
        name: '',
        category: '',
        description: '',
      },
      editStep2: {
        images: []
      },
      editStep3: {
        date: null,
        time: null,
      },
      selectedEditFiles: [],
      categoryOptions: [
      'Electronics',
      'Apparel & Fashion',
      'Home & Kitchen Appliances',
      'Health & Wellness',
      'Sports & Outdoors',
    ],
      showProductDetailsDialog: false,
      // selectedProduct: null,
      alert: {
        show: false,
        message: '',
        timeout: 3000, 
        color: 'success', 
      },
      deleteConfirmation: false,
      products: [],
      headers: [
        // { text: 'ID', value: 'id', align: 'start', width: '80px' },
        { text: 'Name', value: 'Name', align: 'start', width: '200px' },
        { text: 'Category', value: 'Category', align: 'start', width: '200px' },
        { text: 'Description', value: 'Description', align: 'start', width: '400px' },
        { text: 'DateTime', value: 'DateTime', align: 'start', width: '200px' },
        { text: 'Images', value: 'images', align: 'start', width: '150px' },
        { text: 'Action', value: 'actions', align: 'start', width: '250px' },
      ],
    };
  },
  computed: {
    shouldShowError() {
      return (fieldName) => {
        return !this.newProduct[fieldName];
      };
    },
    combinedDateTime() {
   
    return this.editStep3.date && this.editStep3.time
      ? `${this.editStep3.date} ${this.editStep3.time}` 
      : null; 
  }
  },
  
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async validateStep1() {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/product/create/step_1', this.newProduct);
    console.log('Step 1 data:', response.data.step1);
    this.step = 2; 
  } catch (error) {
    console.error('Error validating step 1:', error);
    this.step1Errors = error.response.data.errors;
  }
},

async validateStep2() {
  try {
    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      // Append file to FormData for upload
      formData.append('images[]', file);
      
      // Store only filename in newProduct.images array
      this.newProduct.images.push(file.name);
    });

    // Send the formData with images to the server for upload
    const response = await axios.post('http://127.0.0.1:8000/api/product/create/step_2', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Step 2 data:', response.data.step2);

    if (response.status === 200 && response.data && response.data.step2) {
      this.step = 3;
    } else {
      // Handle validation errors or other issues if needed
    }
  } catch (error) {
    console.error('Error validating step 2:', error);
    // Handle error, display message, etc.
  }
},
async validateStep3() {
  try {
    const selectedDate = new Date(this.newProduct.date);
    const selectedTime = new Date(`2000-01-01T${this.newProduct.time}`);

    if (!isNaN(selectedDate) && !isNaN(selectedTime)) {
   
      const formattedDateTime = `${this.newProduct.date} ${this.newProduct.time}`;
      console.log('DateTime:', formattedDateTime);
      const imagesAsString = this.newProduct.images.join(', ');
      const mergedData = {
        step1: {
          name: this.newProduct.name,
          category: this.newProduct.category,
          description: this.newProduct.description,
        },
        step2: {
          images: imagesAsString,
        },
        datetime: formattedDateTime,
      };

      console.log('mergedData:', mergedData);
      const response = await axios.post('http://127.0.0.1:8000/api/product/create/step_3', mergedData);
      console.log('Product created successfully:', response.data.message);

      this.alert.message = 'You have successfully created the product.';
      this.alert.color = 'success';
      this.alert.show = true;

      this.newProduct = {
        name: '',
        category: '',
        description: '',
        images: [],
      };

      this.selectedFiles = [];
      this.step = 1;
      this.showCreateDialog = false;
      this.fetchProducts();
    } else {
      // handle validation error
  
    }
  } catch (error) {
    console.error('Error validating Step 3:', error);
    // Handle error, display message, etc.
  }
},

  async editProduct(item) {
    const productId = item.id; 
    console.log("id selected", productId)
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/products/edit/${productId}`);
      const productData = response.data.product;
      this.selectedProduct = productData;
      console.log("data selected", this.selectedProduct)
      this.showEditDialog = true;

      this.editStep1.name = productData.Name;
      this.editStep1.category = productData.Category;
      this.editStep1.description = productData.Description;
   
    const dateTimeParts = productData.DateTime.split('T'); 
    this.editStep3.date = dateTimeParts[0]; 
    

    const timeParts = dateTimeParts[1].split(':');
    const hours = timeParts[0];
    const minutes = timeParts[1];

    this.editStep3.time = `${hours}:${minutes}`; 
  
    
      console.log("data name", productData.Name)
      
  
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  },

  async updateStep1(productId) {
    try {
      const requestData = {
        name: this.editStep1.name,
        category: this.editStep1.category,
        description: this.editStep1.description
      };

      const response = await axios.put(`http://127.0.0.1:8000/api/product/update_step1/${productId}`, requestData);
      console.log('Step 1 data:', response.data.step1);
      this.step = 2;
    } catch (error) {
      console.error('Error updating step 1:', error);
    }
  },

  // Update Step 2 function
  async updateStep2(productId) {
    try {
      const formData = new FormData();
      this.selectedFiles.forEach((file) => {
        formData.append('images[]', file);
      });

      const response = await axios.put(`http://127.0.0.1:8000/api/product/update_step2/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Step 2 data:', response.data.step2);
      this.step = 3;
    } catch (error) {
      console.error('Error updating step 2:', error);
    }
  },

  async updateStep3() {
 
  try {
    const productId = this.selectedProduct.id;
    console.log("Edit id selected", productId)
    const formattedDateTime1 = `${this.editStep3.date} ${this.editStep3.time}`;
    const requestData = {
        step1: {
          name: this.editStep1.name,
          category: this.editStep1.category,
          description: this.editStep1.description,
        },
        step2: {
          images: '',
        },
        datetime: formattedDateTime1,
      };

    console.log('Step 3 data:', requestData);
    const response = await axios.put(`http://127.0.0.1:8000/api/product/update_step3/${productId}`, requestData);
    console.log('Step 3 data:', response.data.message);
    
      this.alert.message = 'You have successfully updated the product.';
      this.alert.color = 'success';
      this.alert.show = true;

      this.step = 1;
      this.showEditDialog = false;
      this.fetchProducts();

    this.resetEdit(); 
  } catch (error) {
    console.error('Error updating step 3:', error);
  }
},



    async fetchProducts() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products');
        this.products = response.data;
        console.log("data", response.data)
      } 
      catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    formatDateTime(datetime) {
    const options = {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };

      const date = new Date(datetime);
      return date.toLocaleDateString('en-US', options);
    }, 

    cancelCreate() {
      this.newProduct.name = '';
      this.newProduct.description = '';
      this.newProduct.category = '';
      this.newProduct.date = '';
      this.newProduct.time = '';
      this.step = 1;
      this.showCreateDialog = false;
    },

    cancelEdit() {
      this.editStep1.name = '';
      this.editStep1.description = '';
      
      this.step = 1; // Reset to the first step
      this.showEditDialog = false;
    },
    async viewProduct(item) {
      const productId = item.id; 
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${productId}`);
        this.selectedProduct = response.data;
        console.log("data selected", response.data)
        this.showProductDetailsDialog = true; 
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    },
    confirmDelete(item) {
      this.itemToDelete = item.id; 
      console.log("data selected",item.id)
      this.deleteConfirmation = true;
    },
    async deleteConfirmed() {
      this.deleteConfirmation = false;
   
      const productId = this.itemToDelete // Assuming this is the ID of the item you want to delete
      try {
        await axios.delete(`http://127.0.0.1:8000/api/products/${productId}`);
        console.log(`Product with ID ${productId} has been deleted.`);
            
        this.alert.message = 'You have successfully deleted the product.';
        this.alert.color = 'success';
        this.alert.show = true;
      
        // Instead of fetching all products again, you can remove the deleted item from the current list
        this.products = this.products.filter(product => product.id !== productId);
      } catch (error) {
        console.error('Error deleting product:', error);
        this.alert.message = 'Failed to delete the product.';
        this.alert.color = 'error';
        this.alert.show = true;
      }
    },

    cancelDelete() {
      this.deleteConfirmation = false; 
    },
   
  }
}
</script>
<style>
.error--text {
  border-color: red; /* Change the border color to red */
}</style>
