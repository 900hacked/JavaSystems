package project.ATLdeliveryNote.Service;

import java.util.List;

import project.ATLdeliveryNote.Model.Product;



public interface ProductService {
	
	public void addProduct(Product product);


	public void updateProducts(Product products);
		
		public Product getProductsById(Long id);
		
		public List<Product> getProductsByName(String name);
		
		public void removeProducts(Long id);
		
		public List<Product> listProducts();


}
