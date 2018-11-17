package wx.wechat.utils;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by apple on 16/6/7.
 */
public class XMLUtilsTest {

    // 待测试的XMLUtils类
    XMLUtils xmlUtils;

    //待测试的文档
    Document doc4Test;

    @Before
    public void setUp() {
        this.doc4Test = this.createXml();
        this.xmlUtils = new XMLUtils();
    }

    @Test
    public void test_convertToXML() {

        Map<String, String> map = new HashMap<>();

        map.put("appid", "wx2421b1c4370ec43b");

        System.out.println(this.xmlUtils.convertToXML(map));
    }

    @Test
    public void test_XML2Map() {

        Map map = xmlUtils.XML2Map(doc4Test);

        System.out.println(map.toString());

    }


    /**
     * @return
     * @function 辅助测试程序
     */
    private Document createXml() {
        Document doc = DocumentHelper.createDocument();
        Element e = doc.addElement("GmMail");
        e.addElement("template_id").setText("2");
        e.addElement("to_address").setText("test@corp.gm.com");
        e.addElement("to_alias").setText("tom");
        e.addElement("message").setText("XML- Message");
        e.addElement("recipient_name").setText("xml-tom");
        e.addElement("send_address").setText("xml-test@163.com");
        e.addElement("sender_comp_name").setText("xml-gm");
        e.addElement("subject").setText("xml-hello guys");
        Element Selecteditems = e.addElement("selected_items");

        Element itemsGroup = Selecteditems.addElement("item_group");
        //Element item = itemsGroup.addElement("item");
        itemsGroup.addElement("item_url").setText("");
        itemsGroup.addElement("item_name").setText("gm");
        itemsGroup.addElement("item_desc").setText("gmdesc");
        itemsGroup.addElement("item_desc2").setText("gmdesc2");
        itemsGroup.addElement("item_desc3").setText("gmdesc3");
        itemsGroup.addElement("item_desc4").setText("gmdesc4");
        Selecteditems.addElement("items_source").setText("products");
        itemsGroup = Selecteditems.addElement("item_group");
        itemsGroup.addElement("item_url").setText("");
        itemsGroup.addElement("item_name").setText("gm");
        itemsGroup.addElement("item_desc").setText("gmdesc");
        Element attachment = e.addElement("attachments");
        Element attachmentGroup = attachment.addElement("attachment-group");
        attachmentGroup.addElement("attachment_url").setText("");
        attachmentGroup.addElement("attachment_name").setText("");
        Element attachmentDesc = attachmentGroup.addElement("attachment_desc");
        attachmentDesc.addElement("desc1").setText("attach-desc1");
        attachmentDesc.addElement("desc2").setText("attach-desc2");
        attachmentDesc.addElement("desc3").setText("attach-desc3");
        attachmentDesc.addElement("desc4").setText("attach-desc4");
        attachmentGroup = attachment.addElement("attachment-group");
        attachmentGroup.addElement("attachment_url").setText("");
        attachmentGroup.addElement("attachment_name").setText("");
        attachmentDesc = attachmentGroup.addElement("attachment_desc");
        attachmentDesc.addElement("desc1").setText("attach-desc1");
        attachmentDesc.addElement("desc2").setText("attach-desc2");
        attachmentDesc = attachmentGroup.addElement("attachment_desc");
        attachmentDesc.addElement("desc1").setText("attach-desc1");
        attachmentDesc.addElement("desc2").setText("attach-desc2");
        Element descGroup = e.addElement("desc_group");
        descGroup.addElement("desc_item").setText("desc_item_1");
        descGroup.addElement("desc_item").setText("desc_item_2");
        descGroup.addElement("desc_item").setText("desc_item_3");
        descGroup.addElement("desc_item").setText("desc_item_4");
        descGroup.addElement("desc_item").setText("desc_item_5");
        return doc;
    }
}
