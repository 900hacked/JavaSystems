package project.ATLdeliveryNote.DAO;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import project.ATLdeliveryNote.Model.Product;



@Repository
public class ProductDAOImpli implements ProductDAO {

	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	public void addProduct(Product product) {
		Session session = sessionFactory.getCurrentSession();
		session.persist(product);
		
	}

	@Override
	public void updateProducts(Product product) {
		try {
			Session session = sessionFactory.getCurrentSession();
			 session.update(product);
			 System.out.println("Successfully updated" + product);
			}
			catch(Exception e) {
				System.out.println("Something went wrong" + e);
			}
		
	}

	@Override
	public Product getProductsById(Long id) {
		Session session = sessionFactory.getCurrentSession();
		Product prod = (Product) session.get(Product.class, new Long(id));
		return prod;
		
	}
	
	@Override
	public List<Product> getProductsByName(String name){
		Session session = sessionFactory.getCurrentSession();
		return session
	            .createQuery("FROM Product p WHERE LOWER(p.productName) LIKE :name", Product.class)
	            .setParameter("name", "%" + name.toLowerCase() + "%")
	            .getResultList();
	    }
	

	@Override
	public void removeProducts(Long id) {

		Session session = sessionFactory.getCurrentSession();
		Product remove = (Product) session.get(Product.class, new Long(id));
		if(null != remove) {
			session.delete(remove);
		}
		
	}

	@Override
	public List<Product> listProducts() {
		Session session = sessionFactory.getCurrentSession();
		List<Product> productList = session.createQuery("from Product").list();
		return productList;
		
	}

}
