package project.ATLdeliveryNote.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
	public ResponseEntity<String> addDelivery(@RequestBody DeliveryNote delivery ) {
		 
		
		service.addDelivery(delivery);
		
		return ResponseEntity.ok("Successfully added Delivery");
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String allowLogin() {
		return "login";
	}
	
	@ResponseBody
	@RequestMapping(value = "/update/{id}", method = RequestMethod.PUT, consumes = "application/json")
	public ResponseEntity<String> updateDelivery(@RequestBody DeliveryNote updatedDelivery, @PathVariable("id") Long id) {

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
	        product.getDescription()
	    );

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
            product.getDescription()
        );

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
	public ResponseEntity<List<DeliveryNote>> getAll(){
		
		return ResponseEntity.ok(service.listDelivery());
	}

}
