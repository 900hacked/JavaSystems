package project.ATLdeliveryNote.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import project.ATLdeliveryNote.DAO.ProductDAO;
import project.ATLdeliveryNote.Model.Product;

@Service
public class ProductServiceImpli implements ProductService {

	@Autowired
	private ProductDAO productDao;
	
	@Override
	@Transactional
	public void addProduct(Product product) {
		
		productDao.addProduct(product);
		
	}

	@Override
	@Transactional
	public void updateProducts(Product products) {
		
		productDao.updateProducts(products);
		
	}

	@Override
	@Transactional
	public Product getProductsById(Long id) {
		
		Product prod = productDao.getProductsById(id);
		return prod;
	}
	@Override
	@Transactional
	public List<Product> getProductsByName(String name){
		
		return productDao.getProductsByName(name);
	}

	@Override
	@Transactional
	public void removeProducts(Long id) {
		
		productDao.removeProducts(id);
		
	}

	@Override
	@Transactional
	public List<Product> listProducts() {
		
		return productDao.listProducts();
	}

}
