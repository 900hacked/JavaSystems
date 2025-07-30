package project.ATLdeliveryNote.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import project.ATLdeliveryNote.Model.Product;
import project.ATLdeliveryNote.Model.ProductDTO;
import project.ATLdeliveryNote.Service.ProductService;


@Controller
@RequestMapping("/products")
public class ProductController {
	
	@Autowired
	private ProductService service;
	
	@ResponseBody
	@RequestMapping(value = "/add", method = RequestMethod.POST, consumes = "application/json")
	public String addProducts(@RequestBody Product product ) {
		
		service.addProduct(product);
		
		return "Successfully added product";
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String allowLogin() {
		return "login";
	}
	
	@ResponseBody
	@RequestMapping(value = "/update/{id}", method = RequestMethod.PUT, consumes = "application/json")
	public String updateProducts(@RequestBody Product updatedProduct, @PathVariable("id") Long id) {

		Product prod = service.getProductsById(id);
		prod.setProductName(updatedProduct.getProductName());
		prod.setDescription(updatedProduct.getDescription());
		
		service.updateProducts(prod);
		System.out.println("Updated data " + prod);

		return "Successfully Updated";
		
	}
	
	@ResponseBody
	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET)
	public Product getProductsById(@PathVariable("id") Long id) {
		
		Product body = service.getProductsById(id);
		
		return body;
	}
	
	@ResponseBody
	@RequestMapping(value = "/search/{name}", method = RequestMethod.GET)
	public ResponseEntity<List<ProductDTO>> searchProductsByName(@PathVariable String name) {
        List<Product> products = service.getProductsByName(name);

        if (products.isEmpty()) {
            return ResponseEntity.noContent().build(); 
        }

        List<ProductDTO> dtos = products.stream()
            .map(p -> new ProductDTO(p.getId(), p.getProductName(), p.getDescription()))
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
	
	@ResponseBody
	@RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
	public String removeProducts(@PathVariable("id") Long id) {
		
		service.removeProducts(id);
		
		return "Product " + id + " has been deleted";
	}
	
	@ResponseBody
	@RequestMapping(value = "/gets", method = RequestMethod.GET)
	public List<Product> getAll(){
		
		return service.listProducts();
	}
}
