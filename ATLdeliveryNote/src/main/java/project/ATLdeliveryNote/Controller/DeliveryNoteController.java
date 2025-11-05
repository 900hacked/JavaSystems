package project.ATLdeliveryNote.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import project.ATLdeliveryNote.Model.DeliveryNote;
import project.ATLdeliveryNote.Model.DeliveryNoteDTO;
import project.ATLdeliveryNote.Model.Product;
import project.ATLdeliveryNote.Service.DeliveryNoteService;

@Controller
@RequestMapping("/delivery")
public class DeliveryNoteController {

	@Autowired
	private DeliveryNoteService service;

	@ResponseBody
	@RequestMapping(value = "/add", method = RequestMethod.POST, consumes = "application/json")
	public ResponseEntity<Map<String, String>> addDelivery(@RequestBody DeliveryNote delivery) {

		service.addDelivery(delivery);

		// After persisting, delivery should have its serialNumber set. Return it so the
		// frontend can use the authoritative serial (especially when server generates it).
		Map<String, String> resp = new HashMap<>();
		resp.put("serial", delivery.getSerialNumber());
		return ResponseEntity.ok(resp);
	}

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String allowLogin() {
		return "redirect:/resources/index.html";
	}

	@RequestMapping(value = "/note", method = RequestMethod.GET)
	public String frontDelivery() {
		return "forward:/resources/delivery/delivery.html";
	}

	@ResponseBody
	@RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
	public ResponseEntity<String> updateDelivery(@RequestBody DeliveryNote updatedDelivery,
			@PathVariable("id") Long id) {

		DeliveryNote note = service.getDeliveryById(id);
		if (note != null) {
			note.setProduct(updatedDelivery.getProduct());
			note.setQuantity(updatedDelivery.getQuantity());
			service.updateDelivery(note);
			return ResponseEntity.ok("Successfully Updated");
		} else {
			return ResponseEntity.notFound().build();
		}

	}

	@ResponseBody
	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET)
	public ResponseEntity<DeliveryNoteDTO> getDeliveryById(@PathVariable("id") Long id) {
		DeliveryNote note = service.getDeliveryById(id);
		if (note == null) {
			return ResponseEntity.notFound().build();
		}

		Product product = note.getProduct();

		DeliveryNoteDTO dto = new DeliveryNoteDTO(
				note.getId(),
				note.getQuantity(),
				note.getSerialNumber(),
				product.getProductName(),
				product.getDescription());

		return ResponseEntity.ok(dto);
	}

	@ResponseBody
	@RequestMapping(value = "/getSerial/{serialNumber}", method = RequestMethod.GET)
	public ResponseEntity<DeliveryNoteDTO> getDeliveryBySerialNo(@PathVariable("serialNumber") String serialNumber) {
		DeliveryNote note = service.getDeliveryBySerialNo(serialNumber);

		if (note == null) {
			return ResponseEntity.notFound().build();
		}

		Product product = note.getProduct();

		DeliveryNoteDTO dto = new DeliveryNoteDTO(
				note.getId(),
				note.getQuantity(),
				note.getSerialNumber(),
				product.getProductName(),
				product.getDescription());

		return ResponseEntity.ok(dto);
	}

	@ResponseBody
	@RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<String> removeDelivery(@PathVariable("id") Long id) {

		DeliveryNote note = service.getDeliveryById(id);

		if (note == null) {
			return ResponseEntity.notFound().build();
		}

		service.removeDelivery(id);
		return ResponseEntity.ok("Delivery " + id + " has been deleted");
	}

	@ResponseBody
	@RequestMapping(value = "/gets", method = RequestMethod.GET)
	public ResponseEntity<List<DeliveryNote>> getAll() {

		return ResponseEntity.ok(service.listDelivery());
	}

	// Return delivery notes that share the same serial number (used to show a batch)
	@ResponseBody
	@RequestMapping(value = "/bySerial/{serial}", method = RequestMethod.GET)
	public ResponseEntity<List<DeliveryNoteDTO>> getBySerial(@PathVariable("serial") String serial) {
		List<DeliveryNote> all = service.listDelivery();
		List<DeliveryNoteDTO> dtos = all.stream()
				.filter(n -> serial != null && serial.equals(n.getSerialNumber()))
				.map(n -> {
					Product p = n.getProduct();
					return new DeliveryNoteDTO(n.getId(), n.getQuantity(), n.getSerialNumber(), p.getProductName(), p.getDescription());
				})
				.collect(Collectors.toList());

		return ResponseEntity.ok(dtos);
	}

}
