package wx.service;

import wx.mapper.ProductDao;
import wx.modal.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Product service for handler logic of product operation
 *
 * @author HelloWood
 * @date 2017-07-11 11:58
 * @Email hellowoodes@gmail.com
 */

@Service
@Transactional(rollbackFor = Exception.class)
public class ProductService {

    @Autowired
    private ProductDao productDao;

    /**
     * Get product by id
     * If not found product will throw Exception
     *
     * @param productId
     * @return
     * @throws Exception
     */
    public Product select(long productId) throws Exception {
        Product product = productDao.select(productId);
        if (product == null) {
            throw new Exception("Product:" + productId + " not found");
        }
        return product;
    }

    /**
     * Update product by id
     * If update failed will throw Exception
     *
     * @param productId
     * @param newProduct
     * @return
     * @throws Exception
     */
    public Product update(long productId, Product newProduct) throws Exception {

        if (productDao.update(newProduct) <= 0) {
            throw new Exception("Update product:" + productId + "failed");
        }
        return newProduct;
    }

    /**
     * Add product to DB
     *
     * @param newProduct
     * @return
     * @throws Exception
     */
    public boolean add(Product newProduct) throws Exception {
        Integer num = productDao.insert(newProduct);
        if (num <= 0) {
            throw new Exception("Add product failed");
        }
        return true;
    }

    /**
     * Delete product from DB
     *
     * @param productId
     * @return
     * @throws Exception
     */
    public boolean delete(long productId) throws Exception {
        Integer num = productDao.delete(productId);
        if (num <= 0) {
            throw new Exception("Delete product:" + productId + "failed");
        }
        return true;
    }

    /**
     * Query all product
     *
     * @return
     */
    public List<Product> selectAll() {
        return productDao.selectAll();
    }
}
