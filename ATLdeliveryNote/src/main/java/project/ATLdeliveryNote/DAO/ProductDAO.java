package project.ATLdeliveryNote.DAO;

import java.util.List;

import project.ATLdeliveryNote.Model.Product;



public interface ProductDAO {
	
	public void addProduct(Product product);


	public void updateProducts(Product product);
		
		public Product getProductsById(Long id);
		
		public List<Product> getProductsByName(String name);
		
		public void removeProducts(Long id);
		
		public List<Product> listProducts();

}
