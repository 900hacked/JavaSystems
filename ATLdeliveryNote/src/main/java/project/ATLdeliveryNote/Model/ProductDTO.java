package project.ATLdeliveryNote.Model;

public class ProductDTO {
	
	private Long id;
    private String productName;
    private String description;
    
    
	public ProductDTO(Long id, String productName, String description) {
		
		this.id = id;
		this.productName = productName;
		this.description = description;
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getProductName() {
		return productName;
	}


	public void setProductName(String productName) {
		this.productName = productName;
	}


	public String getDescription() {
		return description;
	}


	public void setDescription(String description) {
		this.description = description;
	}
    
	
	
    

}
