package project.ATLdeliveryNote.DAO;

import java.util.List;

import project.ATLdeliveryNote.Model.DeliveryNote;


public interface DeliveryNoteDAO {
	
	public void addDelivery(DeliveryNote delivery);


	public void updateDelivery(DeliveryNote delivery);
		
		public DeliveryNote getDeliveryById(Long id);
		
		public DeliveryNote getDeliveryBySerialNo(String serial);
		
		public void removeDelivery(Long id);
		
		public List<DeliveryNote> listDelivery();

}
