package project.ATLdeliveryNote.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class HomeController {

    @RequestMapping("/")
    public String home(){

        return "redirect:/resources/index.html";

    }

//    @RequestMapping(value = "/home", method = RequestMethod.GET)
//    public void redirectToProductsGets(HttpServletRequest request, HttpServletResponse response) throws IOException {
//        String context = request.getContextPath();
//        response.sendRedirect(context + "/resources/productsGets.html");
//    }

    @RequestMapping(value = "/home", method = RequestMethod.GET)
    public String redirectToProductsGets() {
        return "redirect:/resources/productsGets.html";
    }

}
