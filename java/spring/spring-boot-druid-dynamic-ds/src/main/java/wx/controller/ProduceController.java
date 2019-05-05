package wx.controller;

import wx.config.TargetDataSource;
import wx.modal.Product;
import wx.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Product controller
 *
 * @author HelloWood
 * @date 2017-07-11 11:38
 * @Email hellowoodes@gmail.com
 */

@RestController
@RequestMapping("/product")
public class ProduceController {

    @Autowired
    private ProductService productService;

    /**
     * Get product by id
     *
     * @param productId
     * @return
     * @throws Exception
     */
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable("id") Long productId) throws Exception {
        return productService.select(productId);
    }

    /**
     * Get all product
     *
     * @return
     * @throws Exception
     */
    @GetMapping("/master")
    @TargetDataSource("master")
    public List<Product> getAllMasterProduct() {
        return productService.selectAll();
    }

    /**
     * Get all product
     *
     * @return
     * @throws Exception
     */
    @GetMapping("/slave")
    @TargetDataSource("slave")
    public List<Product> getAllSlaveProduct() {
        return productService.selectAll();
    }

    /**
     * Update product by id
     *
     * @param productId
     * @param newProduct
     * @return
     * @throws Exception
     */
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable("id") Long productId, @RequestBody Product newProduct) throws Exception {
        return productService.update(productId, newProduct);
    }

    /**
     * Delete product by id
     *
     * @param productId
     * @return
     * @throws Exception
     */
    @DeleteMapping("/{id}")
    public boolean deleteProduct(@PathVariable("id") long productId) throws Exception {
        return productService.delete(productId);
    }

    /**
     * Save product
     *
     * @param newProduct
     * @return
     * @throws Exception
     */
    @PostMapping
    public boolean addProduct(@RequestBody Product newProduct) throws Exception {
        return productService.add(newProduct);
    }
}
