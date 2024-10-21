class ProductManager {
    constructor() {
        this.products = [];  
        this.currentId = 1;   
    }

    
    addProduct(title, description, price, thumbnail, code, stock) {
        
        if (this.products.find(product => product.code === code)) {
            return "Error: Producto con el mismo codigo ya existe.";
        }

        const product = {
            id: this.currentId++,  
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,  
            code: code,            
            stock: stock           
        };

        this.products.push(product);
        return product;
    }

    
    getProducts() {
        return this.products;
    }

    
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    
    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1);
            return deletedProduct;
        } else {
            return null;
        }
    }

    
    updateProduct(id, newInfo) {
        const product = this.getProductById(id);
        if (product) {
            Object.assign(product, newInfo);
            return product;
        } else {
            return null;
        }
    }
}


const manager = new ProductManager();
manager.addProduct("Camisa", "Camiseta 100% algodón", 100.00, "url-de-imagen-camisa", "CDA100", 20);
manager.addProduct("Gorra", "Gorra new era", 600.00, "url-de-imagen-Gorra", "GNE12", 10);

console.log(manager.getProducts());
console.log(manager.getProductById(1));

manager.updateProduct(1, { price: 60.00, stock: 35 });
console.log(manager.getProductById(1));

manager.deleteProduct(2);
console.log(manager.getProducts());