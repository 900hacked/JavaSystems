package project.ATLdeliveryNote.DAO;

import java.util.List;
import java.util.UUID;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import project.ATLdeliveryNote.Model.DeliveryNote;

@Repository
public class DeliveryNoteDAOImpli implements DeliveryNoteDAO {

	@Autowired
	private SessionFactory sessionFactory;

	@Override
	public void addDelivery(DeliveryNote delivery) {
		Session session = sessionFactory.getCurrentSession();
		// If the client provided a serialNumber (e.g. batch id from frontend), keep it.
		// Otherwise generate a new serial in the ATL#### format.
		String provided = delivery.getSerialNumber();
		// If client didn't provide a serial or provided the temporary AUTO-... batch
		// id,
		// generate a server-side ATL serial. If client already provided an ATL... id,
		// preserve it.
		if (provided != null && provided.trim().startsWith("AUTO")) {
			provided = null;
			delivery.setSerialNumber(null);
		}

		if (provided == null || provided.trim().isEmpty()) {
			// Get the latest serial number from the DB
			String lastSerial = (String) session.createQuery(
					"SELECT d.serialNumber FROM DeliveryNote d ORDER BY d.id DESC")
					.setMaxResults(1)
					.uniqueResult();

			int nextNumber = 1;
			if (lastSerial != null && lastSerial.startsWith("ATL")) {
				try {
					// Extract numeric part
					String numericPart = lastSerial.substring(3);
					nextNumber = Integer.parseInt(numericPart) + 1;
				} catch (NumberFormatException e) {
					// If somehow the last serial is corrupted, fallback to 1
					nextNumber = 1;
				}
			}

			// Use 3-digit padding for numbers below 1000 (e.g. ATL001). For >=1000 produce
			// ATL1000, ATL1001, etc.
			String newSerial;
			if (nextNumber < 1000) {
				newSerial = String.format("ATL%03d", nextNumber);
			} else {
				newSerial = "ATL" + nextNumber;
			}

			delivery.setSerialNumber(newSerial);
		} else {
			// preserve the client-provided serial (trim whitespace)
			delivery.setSerialNumber(provided.trim());
		}

		session.persist(delivery);

	}

	@Override
	public void updateDelivery(DeliveryNote delivery) {
		try {
			Session session = sessionFactory.getCurrentSession();
			session.update(delivery);
			System.out.println("Successfully updated" + delivery);
		} catch (Exception e) {
			System.out.println("Something went wrong" + e);
		}

	}

	@Override
	public DeliveryNote getDeliveryById(Long id) {
		Session session = sessionFactory.getCurrentSession();
		DeliveryNote note = (DeliveryNote) session.get(DeliveryNote.class, new Long(id));
		return note;
	}

	@Override
	public DeliveryNote getDeliveryBySerialNo(String serial) {
		Session session = sessionFactory.getCurrentSession();
		try {
			return session
					.createQuery("FROM DeliveryNote d WHERE d.serialNumber = :serialNumber", DeliveryNote.class)
					.setParameter("serialNumber", serial)
					.uniqueResult(); // returns null if no result
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public void removeDelivery(Long id) {
		Session session = sessionFactory.getCurrentSession();
		DeliveryNote remove = (DeliveryNote) session.get(DeliveryNote.class, new Long(id));
		if (null != remove) {
			session.delete(remove);
		}

	}

	@Override
	public List<DeliveryNote> listDelivery() {
		Session session = sessionFactory.getCurrentSession();
		List<DeliveryNote> deliveryList = session.createQuery("from DeliveryNote").list();
		return deliveryList;
	}

}
