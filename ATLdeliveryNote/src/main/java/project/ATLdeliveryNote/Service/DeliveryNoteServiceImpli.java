package project.ATLdeliveryNote.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import project.ATLdeliveryNote.DAO.DeliveryNoteDAO;
import project.ATLdeliveryNote.Model.DeliveryNote;


@Service
public class DeliveryNoteServiceImpli implements DeliveryNoteService {

	@Autowired
	private DeliveryNoteDAO deliveryDao;
	
	@Override
	@Transactional
	public void addDelivery(DeliveryNote delivery) {
		
		deliveryDao.addDelivery(delivery);
		
	}

	@Override
	@Transactional
	public void updateDelivery(DeliveryNote delivery) {
		
		deliveryDao.updateDelivery(delivery);
		
	}

	@Override
	@Transactional
	public DeliveryNote getDeliveryById(Long id) {
		DeliveryNote note = deliveryDao.getDeliveryById(id);
		return note;
	}
	
	@Override
	@Transactional
	public DeliveryNote getDeliveryBySerialNo(String serial) {
		DeliveryNote num = deliveryDao.getDeliveryBySerialNo(serial);
		return num;
	}

	@Override
	@Transactional
	public void removeDelivery(Long id) {
		
		deliveryDao.removeDelivery(id);
		
	}

	@Override
	@Transactional
	public List<DeliveryNote> listDelivery() {
		
		return deliveryDao.listDelivery();
	}

}
