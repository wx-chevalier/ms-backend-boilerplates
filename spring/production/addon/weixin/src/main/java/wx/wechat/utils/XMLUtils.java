package wx.wechat.utils;

import lombok.SneakyThrows;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import java.util.*;

/**
 * Created by apple on 16/6/7.
 */
public class XMLUtils {

    /**
     * @param map 考虑到微信中只有一层XML,因此不考虑MAP嵌套循环的情况
     * @return
     * @function 将输入的MAP转化为XML
     */
    public static String convertToXML(Map<String, String> map) {

        Document document = DocumentHelper.createDocument();

        Element root = document.addElement("xml");

        //遍历Map中所有键值
        map.forEach((key, value) -> {

            Element e = root.addElement(key).addText(value);

        });

        //返回创建好的XML字符串
        return document.asXML();
    }

    /**
     * @param xml 字符串类型的XML
     * @return
     * @function 将XML转化为Map
     */
    @SneakyThrows
    public static Map<String, Object> XML2Map(String xml) {

        //从输入的XML创建Document
        Document document = DocumentHelper.parseText(xml);

        //返回创建好的Map对象
        return XML2Map(document);
        
    }

    /**
     * @param doc
     * @return
     * @function 将XML转化为Map
     */
    public static Map<String, Object> XML2Map(Document doc) {
        Map<String, Object> map = new HashMap<String, Object>();
        if (doc == null)
            return map;
        Element root = doc.getRootElement();
        for (Iterator iterator = root.elementIterator(); iterator.hasNext(); ) {
            Element e = (Element) iterator.next();
            //System.out.println(e.getName());
            List list = e.elements();
            if (list.size() > 0) {
                map.put(e.getName(), Dom2Map(e));
            } else
                map.put(e.getName(), e.getText());
        }
        return map;
    }

    /**
     * @param e
     * @return
     * @function 私有方法, 将某个Element转化为Map
     */
    private static Map Dom2Map(Element e) {
        Map map = new HashMap();
        List list = e.elements();
        if (list.size() > 0) {
            for (int i = 0; i < list.size(); i++) {
                Element iter = (Element) list.get(i);
                List mapList = new ArrayList();

                if (iter.elements().size() > 0) {
                    Map m = Dom2Map(iter);
                    if (map.get(iter.getName()) != null) {
                        Object obj = map.get(iter.getName());
                        if (!obj.getClass().getName().equals("java.util.ArrayList")) {
                            mapList = new ArrayList();
                            mapList.add(obj);
                            mapList.add(m);
                        }
                        if (obj.getClass().getName().equals("java.util.ArrayList")) {
                            mapList = (List) obj;
                            mapList.add(m);
                        }
                        map.put(iter.getName(), mapList);
                    } else
                        map.put(iter.getName(), m);
                } else {
                    if (map.get(iter.getName()) != null) {
                        Object obj = map.get(iter.getName());
                        if (!obj.getClass().getName().equals("java.util.ArrayList")) {
                            mapList = new ArrayList();
                            mapList.add(obj);
                            mapList.add(iter.getText());
                        }
                        if (obj.getClass().getName().equals("java.util.ArrayList")) {
                            mapList = (List) obj;
                            mapList.add(iter.getText());
                        }
                        map.put(iter.getName(), mapList);
                    } else
                        map.put(iter.getName(), iter.getText());
                }
            }
        } else
            map.put(e.getName(), e.getText());
        return map;
    }
}
