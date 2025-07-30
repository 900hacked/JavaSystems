package project.ATLdeliveryNote.Model;

public class DeliveryNoteDTO {
	
	private Long id;
    private int quantity;
    private String serialNumber;
    private String productName;
    private String description;

   
    public DeliveryNoteDTO(Long id, int quantity, String serialNumber, String productName, String description) {
        this.id = id;
        this.quantity = quantity;
        this.serialNumber = serialNumber;
        this.productName = productName;
        this.description = description;
    }

   
    public Long getId() {
        return id;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public String getProductName() {
        return productName;
    }

    public String getProductDescription() {
        return description;
    }

}
