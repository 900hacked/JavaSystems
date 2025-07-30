package project.ATLdeliveryNote.Model;

import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;

@Entity
@Table(name = "Delivery_Note")
public class DeliveryNote {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	private Product product;
	
	private int quantity;
	
	private String serialNumber;
	
	
	
	public DeliveryNote() {
		
	}

	public DeliveryNote( Product product, int quantity) {
		
		this.product = product;
		this.quantity = quantity;
		
		
	}
	
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	
	public void setSerialNumber(String serialNumber) {
	    this.serialNumber = serialNumber;
	}

	public String getSerialNumber() {
		return serialNumber;
	}

	
	
	
	
	

}
