/*
 Navicat Premium Data Transfer

 Source Server         : WxDB
 Source Server Type    : MySQL
 Source Server Version : 50725
 Source Host           : 47.99.50.115
 Source Database       : mall-matrix

 Target Server Type    : MySQL
 Target Server Version : 50725
 File Encoding         : utf-8

 Date: 05/26/2019 18:51:05 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `c_misc`
-- ----------------------------
DROP TABLE IF EXISTS `c_misc`;
CREATE TABLE `c_misc` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '内部自增编号',
  `target` varchar(32) DEFAULT NULL,
  `target_id` varchar(64) DEFAULT NULL,
  `key` varchar(64) DEFAULT NULL,
  `value` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `c_template`
-- ----------------------------
DROP TABLE IF EXISTS `c_template`;
CREATE TABLE `c_template` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '内部自增编号',
  `name` varchar(32) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `salt` varchar(64) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `o_cart_item`
-- ----------------------------
DROP TABLE IF EXISTS `o_cart_item`;
CREATE TABLE `o_cart_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `product_category_id` bigint(20) NOT NULL COMMENT '商品分类',
  `product_sku_id` bigint(20) DEFAULT NULL,
  `member_id` bigint(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL COMMENT '购买数量',
  `price` decimal(10,2) DEFAULT NULL COMMENT '添加到购物车的价格',
  `product_pic` varchar(1000) DEFAULT NULL COMMENT '商品主图',
  `product_name` varchar(500) DEFAULT NULL COMMENT '商品名称',
  `product_sub_title` varchar(500) DEFAULT NULL COMMENT '商品副标题（卖点）',
  `product_sku_code` varchar(200) DEFAULT NULL COMMENT '商品sku条码',
  `member_nickname` varchar(500) DEFAULT NULL COMMENT '会员昵称',
  `product_brand` varchar(200) DEFAULT NULL,
  `product_sn` varchar(200) DEFAULT NULL,
  `product_attr` varchar(500) DEFAULT NULL COMMENT '商品销售属性:[{"key":"颜色","value":"颜色"},{"key":"容量","value":"4G"}]',
  `sp1` varchar(200) DEFAULT NULL COMMENT '销售属性1',
  `sp2` varchar(200) DEFAULT NULL COMMENT '销售属性2',
  `sp3` varchar(200) DEFAULT NULL COMMENT '销售属性3',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='购物车表';

-- ----------------------------
--  Records of `o_cart_item`
-- ----------------------------
BEGIN;
INSERT INTO `o_cart_item` VALUES ('12', '26', '19', '90', '1', '1', '3788.00', null, '华为 HUAWEI P20', 'AI智慧全面屏 6GB +64GB 亮黑色 全网通版 移动联通电信4G手机 双卡双待手机 双卡双待', '201806070026001', 'windir', null, null, null, '金色', '16G', null, '2019-05-26 10:28:30', null, '2019-05-26 10:28:29'), ('13', '27', '19', '98', '1', '3', '2699.00', null, '小米8', '骁龙845处理器，红外人脸解锁，AI变焦双摄，AI语音助手小米6X低至1299，点击抢购', '201808270027001', 'windir', null, null, null, '黑色', '32G', null, '2019-05-26 10:28:30', null, '2019-05-26 10:28:29'), ('14', '28', '19', '102', '1', '1', '649.00', null, '红米5A', '8天超长待机，137g轻巧机身，高通骁龙处理器小米6X低至1299，点击抢购', '201808270028001', 'windir', null, null, null, '金色', '16G', null, '2019-05-26 10:28:30', null, '2019-05-26 10:28:29'), ('15', '28', '19', '103', '1', '1', '699.00', null, '红米5A', '8天超长待机，137g轻巧机身，高通骁龙处理器小米6X低至1299，点击抢购', '201808270028001', 'windir', null, null, null, '金色', '32G', null, '2019-05-26 10:28:30', null, '2019-05-26 10:28:29'), ('16', '29', '19', '106', '1', '1', '5499.00', null, 'Apple iPhone 8 Plus', '【限时限量抢购】Apple产品年中狂欢节，好物尽享，美在智慧！速来 >> 勾选[保障服务][原厂保2年]，获得AppleCare+全方位服务计划，原厂延保售后无忧。', '201808270029001', 'windir', null, null, null, '金色', '32G', null, '2019-05-26 10:28:30', null, '2019-05-26 10:28:29');
COMMIT;

-- ----------------------------
--  Table structure for `o_delivery_template`
-- ----------------------------
DROP TABLE IF EXISTS `o_delivery_template`;
CREATE TABLE `o_delivery_template` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `charge_type` int(1) DEFAULT NULL COMMENT '计费类型:0->按重量；1->按件数',
  `first_weight` decimal(10,2) DEFAULT NULL COMMENT '首重kg',
  `first_fee` decimal(10,2) DEFAULT NULL COMMENT '首费（元）',
  `continue_weight` decimal(10,2) DEFAULT NULL,
  `continme_fee` decimal(10,2) DEFAULT NULL,
  `dest` varchar(255) DEFAULT NULL COMMENT '目的地（省、市）',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='运费模版';

-- ----------------------------
--  Table structure for `o_order`
-- ----------------------------
DROP TABLE IF EXISTS `o_order`;
CREATE TABLE `o_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '订单id',
  `user_id` bigint(20) NOT NULL,
  `coupon_id` bigint(20) DEFAULT NULL,
  `order_delivery_id` bigint(20) unsigned DEFAULT NULL COMMENT '订单派送的关联编号',
  `order_sn` varchar(64) DEFAULT NULL COMMENT '订单编号',
  `user_username` varchar(64) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL COMMENT '订单总金额',
  `pay_amount` decimal(10,2) DEFAULT NULL COMMENT '应付金额（实际支付金额）',
  `promotion_amount` decimal(10,2) DEFAULT NULL COMMENT '促销优化金额（促销价、满减、阶梯价）',
  `integration_amount` decimal(10,2) DEFAULT NULL COMMENT '积分抵扣金额',
  `coupon_amount` decimal(10,2) DEFAULT NULL COMMENT '优惠券抵扣金额',
  `discount_amount` decimal(10,2) DEFAULT NULL COMMENT '管理员后台调整订单使用的折扣金额',
  `pay_type` int(1) DEFAULT NULL COMMENT '支付方式：0->未支付；1->支付宝；2->微信',
  `source_type` int(1) DEFAULT NULL COMMENT '订单来源：0->PC订单；1->app订单',
  `status` int(1) DEFAULT NULL COMMENT '订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单',
  `order_type` int(1) DEFAULT NULL COMMENT '订单类型：0->正常订单；1->秒杀订单',
  `auto_confirm_day` int(11) DEFAULT NULL COMMENT '自动确认时间（天）',
  `integration` int(11) DEFAULT NULL COMMENT '可以获得的积分',
  `growth` int(11) DEFAULT NULL COMMENT '可以活动的成长值',
  `promotion_info` varchar(100) DEFAULT NULL COMMENT '活动信息',
  `note` varchar(500) DEFAULT NULL COMMENT '订单备注',
  `use_integration` int(11) DEFAULT NULL COMMENT '下单时使用的积分',
  `payment_time` datetime DEFAULT NULL COMMENT '支付时间',
  `delivery_time` datetime DEFAULT NULL COMMENT '发货时间',
  `receive_time` datetime DEFAULT NULL COMMENT '确认收货时间',
  `comment_time` datetime DEFAULT NULL COMMENT '评价时间',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COMMENT='交易的描述';

-- ----------------------------
--  Table structure for `o_order_bill`
-- ----------------------------
DROP TABLE IF EXISTS `o_order_bill`;
CREATE TABLE `o_order_bill` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '内部自增编号',
  `order_id` bigint(20) unsigned DEFAULT NULL,
  `bill_type` int(11) DEFAULT NULL COMMENT '发票类型：0->不开发票；1->电子发票；2->纸质发票',
  `bill_receiver_email` varchar(64) DEFAULT NULL COMMENT '收票人邮箱',
  `bill_receiver_phone` varchar(32) DEFAULT NULL COMMENT '收票人电话',
  `bill_content` varchar(200) DEFAULT NULL COMMENT '发票内容',
  `bill_header` varchar(200) DEFAULT NULL COMMENT '发票抬头',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `o_order_delivery`
-- ----------------------------
DROP TABLE IF EXISTS `o_order_delivery`;
CREATE TABLE `o_order_delivery` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '内部自增编号',
  `order_id` bigint(20) unsigned DEFAULT NULL,
  `type` tinytext COMMENT '派送方式 0 - 自提 1 - 物流 2 - 快递 3 - 外卖',
  `supplier_name` varchar(64) DEFAULT NULL COMMENT '供应商名称',
  `receiver_name` varchar(100) NOT NULL COMMENT '收货人姓名',
  `receiver_detail_address` varchar(200) DEFAULT NULL COMMENT '详细地址',
  `receiver_region` varchar(32) DEFAULT NULL COMMENT '区',
  `receiver_city` varchar(32) DEFAULT NULL COMMENT '城市',
  `receiver_province` varchar(32) DEFAULT NULL COMMENT '省份/直辖市',
  `receiver_post_code` varchar(32) DEFAULT NULL COMMENT '收货人邮编',
  `receiver_phone` varchar(32) NOT NULL COMMENT '收货人电话',
  `delivery_amount` decimal(10,2) DEFAULT NULL COMMENT '运费金额',
  `confirm_status` int(1) DEFAULT NULL COMMENT '确认收货状态：0->未确认；1->已确认',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_o_order_delivery_supplier_name` (`supplier_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单配送单';

-- ----------------------------
--  Table structure for `o_order_delivery_history`
-- ----------------------------
DROP TABLE IF EXISTS `o_order_delivery_history`;
CREATE TABLE `o_order_delivery_history` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '内部自增编号',
  `order_delivery_id` bigint(20) unsigned DEFAULT NULL,
  `courier_name` varchar(64) DEFAULT NULL COMMENT '快递员名称',
  `courier_phone` varchar(64) DEFAULT NULL COMMENT '快递员联系方式',
  `courier_position` varchar(64) DEFAULT NULL COMMENT '外卖员位置,经纬度逗号分隔',
  `confirm_status` int(1) DEFAULT NULL COMMENT '本次流转中的确认交付状态：0->未确认；1->已确认',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单配送的历史记录';

-- ----------------------------
--  Table structure for `o_order_item`
-- ----------------------------
DROP TABLE IF EXISTS `o_order_item`;
CREATE TABLE `o_order_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) DEFAULT NULL COMMENT '订单id',
  `order_sn` varchar(64) DEFAULT NULL COMMENT '订单编号',
  `product_id` bigint(20) DEFAULT NULL,
  `product_category_id` bigint(20) DEFAULT NULL COMMENT '商品分类id',
  `product_pic` varchar(500) DEFAULT NULL,
  `product_name` varchar(200) DEFAULT NULL,
  `product_brand` varchar(200) DEFAULT NULL,
  `product_sn` varchar(64) DEFAULT NULL,
  `product_price` decimal(10,2) DEFAULT NULL COMMENT '销售价格',
  `product_quantity` int(11) DEFAULT NULL COMMENT '购买数量',
  `product_sku_id` bigint(20) DEFAULT NULL COMMENT '商品sku编号',
  `product_sku_code` varchar(50) DEFAULT NULL COMMENT '商品sku条码',
  `product_attr` varchar(500) DEFAULT NULL COMMENT '商品销售属性:[{"key":"颜色","value":"颜色"},{"key":"容量","value":"4G"}]',
  `sp1` varchar(100) DEFAULT NULL COMMENT '商品的销售属性',
  `sp2` varchar(100) DEFAULT NULL,
  `sp3` varchar(100) DEFAULT NULL,
  `promotion_name` varchar(200) DEFAULT NULL COMMENT '商品促销名称',
  `promotion_amount` decimal(10,2) DEFAULT NULL COMMENT '商品促销分解金额',
  `coupon_amount` decimal(10,2) DEFAULT NULL COMMENT '优惠券优惠分解金额',
  `integration_amount` decimal(10,2) DEFAULT NULL COMMENT '积分优惠分解金额',
  `real_amount` decimal(10,2) DEFAULT NULL COMMENT '该商品经过优惠后的分解金额',
  `gift_integration` int(11) DEFAULT '0',
  `gift_growth` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COMMENT='交易的快照';

-- ----------------------------
--  Table structure for `o_order_setting`
-- ----------------------------
DROP TABLE IF EXISTS `o_order_setting`;
CREATE TABLE `o_order_setting` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `flash_order_overtime` int(11) DEFAULT NULL COMMENT '秒杀订单超时关闭时间(分)',
  `normal_order_overtime` int(11) DEFAULT NULL COMMENT '正常订单超时时间(分)',
  `confirm_overtime` int(11) DEFAULT NULL COMMENT '发货后自动确认收货时间（天）',
  `finish_overtime` int(11) DEFAULT NULL COMMENT '自动完成交易时间，不能申请售后（天）',
  `comment_overtime` int(11) DEFAULT NULL COMMENT '订单完成后自动好评时间（天）',
  `is_active` tinyint(4) DEFAULT NULL COMMENT '是否激活使用 0 - 未激活 1 - 已激活',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='订单设置';

-- ----------------------------
--  Table structure for `p_brand`
-- ----------------------------
DROP TABLE IF EXISTS `p_brand`;
CREATE TABLE `p_brand` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `first_letter` varchar(8) DEFAULT NULL COMMENT '首字母',
  `sort` int(11) DEFAULT NULL,
  `factory_status` int(1) DEFAULT NULL COMMENT '是否为品牌制造商：0->不是；1->是',
  `show_status` int(11) DEFAULT NULL COMMENT '0 - 不展示 1 - 展示',
  `product_count` int(11) DEFAULT NULL COMMENT '产品数量',
  `logo` varchar(255) DEFAULT NULL COMMENT '品牌logo',
  `big_pic` varchar(255) DEFAULT NULL COMMENT '专区大图',
  `brand_story` text COMMENT '品牌故事',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COMMENT='品牌表';

-- ----------------------------
--  Records of `p_brand`
-- ----------------------------
BEGIN;
INSERT INTO `p_brand` VALUES ('1', '万和', 'W', '0', '1', '1', '100', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg(5).jpg', '', 'Victoria\'s Secret的故事', null, null, null), ('2', '三星', 'S', '100', '1', '1', '100', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg (1).jpg', null, '三星的故事', null, null, null), ('3', '华为', 'H', '100', '1', '1', '100', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/17f2dd9756d9d333bee8e60ce8c03e4c_222_222.jpg', null, 'Victoria\'s Secret的故事', null, null, null), ('4', '格力', 'G', '30', '1', '1', '100', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/dc794e7e74121272bbe3ce9bc41ec8c3_222_222.jpg', null, 'Victoria\'s Secret的故事', null, null, null), ('5', '方太', 'F', '20', '1', '1', '100', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg (4).jpg', null, 'Victoria\'s Secret的故事', null, null, null), ('6', '小米', 'M', '500', '1', '1', '100', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/1e34aef2a409119018a4c6258e39ecfb_222_222.png', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180518/5afd7778Nf7800b75.jpg', '小米手机的故事', null, null, null), ('21', 'OPPO', 'O', '0', '1', '1', '88', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg(6).jpg', '', 'string', null, null, null), ('49', '七匹狼', 'S', '200', '1', '1', '77', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/18d8bc3eb13533fab466d702a0d3fd1f40345bcd.jpg', null, 'BOOB的故事', null, null, null), ('50', '海澜之家', 'H', '200', '1', '1', '66', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/99d3279f1029d32b929343b09d3c72de_222_222.jpg', '', '海澜之家的故事', null, null, null), ('51', '苹果', 'A', '200', '1', '1', '55', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg.jpg', null, '苹果的故事', null, null, null), ('58', 'NIKE', 'N', '0', '1', '1', '33', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/timg (51).jpg', '', 'NIKE的故事', null, null, null);
COMMIT;

-- ----------------------------
--  Table structure for `p_product`
-- ----------------------------
DROP TABLE IF EXISTS `p_product`;
CREATE TABLE `p_product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `brand_id` bigint(20) DEFAULT NULL,
  `product_category_id` bigint(20) DEFAULT NULL,
  `delivery_template_id` bigint(20) DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `product_category_name` varchar(255) DEFAULT NULL COMMENT '商品分类名称',
  `pic` varchar(255) DEFAULT NULL COMMENT '产品图片',
  `product_sn` varchar(64) NOT NULL COMMENT '货号',
  `publish_status` int(1) DEFAULT NULL COMMENT '上架状态：0->下架；1->上架',
  `new_status` int(1) DEFAULT NULL COMMENT '新品状态:0->不是新品；1->新品',
  `recommand_status` int(1) DEFAULT NULL COMMENT '推荐状态；0->不推荐；1->推荐',
  `verify_status` int(1) DEFAULT NULL COMMENT '审核状态：0->未审核；1->审核通过',
  `sort` int(11) DEFAULT NULL,
  `sale` int(11) DEFAULT NULL COMMENT '销量',
  `gift_growth` int(11) DEFAULT '0' COMMENT '赠送的成长值',
  `gift_point` int(11) DEFAULT '0' COMMENT '赠送的积分',
  `use_point_limit` int(11) DEFAULT NULL COMMENT '限制使用的积分数',
  `sub_title` varchar(255) DEFAULT NULL COMMENT '副标题',
  `description` text COMMENT '商品描述',
  `original_price` decimal(10,2) DEFAULT NULL COMMENT '市场价',
  `stock` int(11) DEFAULT NULL COMMENT '库存',
  `low_stock` int(11) DEFAULT NULL COMMENT '库存预警值',
  `unit` varchar(16) DEFAULT NULL COMMENT '单位',
  `weight` decimal(10,2) DEFAULT NULL COMMENT '商品重量，默认为克',
  `preview_status` int(1) DEFAULT NULL COMMENT '是否为预告商品：0->不是；1->是',
  `service_ids` varchar(64) DEFAULT NULL COMMENT '以逗号分割的产品服务：1->无忧退货；2->快速退款；3->免费包邮',
  `keywords` varchar(255) DEFAULT NULL COMMENT '商品关键字,以逗号分隔',
  `note` varchar(255) DEFAULT NULL COMMENT '备注',
  `album_pics` varchar(255) DEFAULT NULL COMMENT '画册图片，连产品图片限制为5张，以逗号分割',
  `detail_title` varchar(255) DEFAULT NULL COMMENT '详情标题',
  `detail_desc` text COMMENT '详情描述',
  `detail_html` text COMMENT '产品详情网页内容',
  `detail_mobile_html` text COMMENT '移动端网页详情',
  `brand_name` varchar(255) DEFAULT NULL COMMENT '品牌名称',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COMMENT='产品表';

-- ----------------------------
--  Records of `p_product`
-- ----------------------------
BEGIN;
INSERT INTO `p_product` VALUES ('1', '49', '7', '0', '银色星芒刺绣网纱底裤', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86577', '1', '1', '1', '1', '100', '0', '0', '100', null, '111', '111', '120.00', '100', '20', '件', '1000.00', '0', null, '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', null, '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '七匹狼', '2019-05-26 18:18:30', null, null), ('2', '49', '7', '0', '银色星芒刺绣网纱底裤2', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86578', '1', '1', '1', '1', '1', '0', '0', '100', null, '111', '111', '120.00', '100', '20', '件', '1000.00', '0', null, '银色星芒刺绣网纱底裤2', '银色星芒刺绣网纱底裤', null, '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '<p>银色星芒刺绣网纱底裤</p>', '<p>银色星芒刺绣网纱底裤</p>', '七匹狼', null, null, null), ('3', '1', '7', '0', '银色星芒刺绣网纱底裤3', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86579', '1', '1', '1', '1', '1', '0', '0', '100', null, '111', '111', '120.00', '100', '20', '件', '1000.00', '0', null, '银色星芒刺绣网纱底裤3', '银色星芒刺绣网纱底裤', null, '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '万和', null, null, null), ('4', '1', '7', '0', '银色星芒刺绣网纱底裤4', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86580', '1', '1', '1', '1', '1', '0', '0', '100', null, '111', '111', '120.00', '100', '20', '件', '1000.00', '0', null, '银色星芒刺绣网纱底裤4', '银色星芒刺绣网纱底裤', null, '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '万和', null, null, null), ('5', '1', '7', '0', '银色星芒刺绣网纱底裤5', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86581', '0', '1', '1', '1', '1', '0', '0', '100', null, '111', '111', '120.00', '100', '20', '件', '1000.00', '0', null, '银色星芒刺绣网纱底裤5', '银色星芒刺绣网纱底裤', null, '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '万和', null, null, null), ('6', '1', '7', '0', '银色星芒刺绣网纱底裤6', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86582', '1', '1', '1', '1', '1', '0', '0', '100', null, '111', '111', '120.00', '100', '20', '件', '1000.00', '0', null, '银色星芒刺绣网纱底裤6', '银色星芒刺绣网纱底裤', null, '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '银色星芒刺绣网纱底裤', '万和', null, null, null), ('7', '1', '7', '0', '女式超柔软拉毛运动开衫', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86577', '0', '0', '0', '0', '0', '0', '0', '100', '0', '匠心剪裁，垂感质地', '匠心剪裁，垂感质地', '299.00', '100', '0', '件', '0.00', '0', 'string', '女式超柔软拉毛运动开衫', 'string', 'string', 'string', 'string', 'string', 'string', '万和', null, null, null), ('8', '1', '7', '0', '女式超柔软拉毛运动开衫1', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86577', '0', '0', '0', '0', '0', '0', '0', '100', '0', '匠心剪裁，垂感质地', '匠心剪裁，垂感质地', '299.00', '100', '0', '件', '0.00', '0', 'string', '女式超柔软拉毛运动开衫', 'string', 'string', 'string', 'string', 'string', 'string', '万和', null, null, null), ('9', '1', '7', '0', '女式超柔软拉毛运动开衫1', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86577', '0', '0', '0', '0', '0', '0', '0', '100', '0', '匠心剪裁，垂感质地', '匠心剪裁，垂感质地', '299.00', '100', '0', '件', '0.00', '0', 'string', '女式超柔软拉毛运动开衫', 'string', 'string', 'string', 'string', 'string', 'string', '万和', null, null, null), ('10', '1', '7', '0', '女式超柔软拉毛运动开衫1', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86577', '0', '0', '0', '0', '0', '0', '0', '100', '0', '匠心剪裁，垂感质地', '匠心剪裁，垂感质地', '299.00', '100', '0', '件', '0.00', '0', 'string', '女式超柔软拉毛运动开衫', 'string', 'string', 'string', 'string', 'string', 'string', '万和', null, null, null), ('11', '1', '7', '0', '女式超柔软拉毛运动开衫1', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86577', '1', '0', '1', '0', '0', '0', '0', '100', '0', '匠心剪裁，垂感质地', '匠心剪裁，垂感质地', '299.00', '100', '0', '件', '0.00', '0', 'string', '女式超柔软拉毛运动开衫', 'string', 'string', 'string', 'string', 'string', 'string', '万和', null, null, null), ('12', '1', '7', '0', '女式超柔软拉毛运动开衫2', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86577', '1', '0', '1', '0', '0', '0', '0', '100', '0', '匠心剪裁，垂感质地', '匠心剪裁，垂感质地', '299.00', '100', '0', '件', '0.00', '0', 'string', '女式超柔软拉毛运动开衫', 'string', 'string', 'string', 'string', 'string', 'string', '万和', null, null, null), ('13', '1', '7', '0', '女式超柔软拉毛运动开衫3', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86577', '1', '0', '1', '0', '0', '0', '0', '100', '0', '匠心剪裁，垂感质地', '匠心剪裁，垂感质地', '299.00', '100', '0', '件', '0.00', '0', 'string', '女式超柔软拉毛运动开衫', 'string', 'string', 'string', 'string', 'string', 'string', '万和', null, null, null), ('14', '1', '7', '0', '女式超柔软拉毛运动开衫3', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86577', '0', '0', '1', '0', '0', '0', '0', '100', '0', '匠心剪裁，垂感质地', '匠心剪裁，垂感质地', '299.00', '100', '0', '件', '0.00', '0', 'string', '女式超柔软拉毛运动开衫', 'string', 'string', 'string', 'string', 'string', 'string', '万和', null, null, null), ('18', '1', '7', '0', '女式超柔软拉毛运动开衫3', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180522/web.png', 'No86577', '0', '0', '1', '0', '0', '0', '0', '100', '0', '匠心剪裁，垂感质地', '匠心剪裁，垂感质地', '299.00', '100', '0', '件', '0.00', '0', 'string', '女式超柔软拉毛运动开衫', 'string', 'string', 'string', 'string', 'string', 'string', '万和', null, null, null), ('22', '6', '7', '0', 'test', '外套', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180604/1522738681.jpg', '', '1', '0', '0', '0', '0', '0', '0', '0', '0', 'test', '', '0.00', '100', '0', '', '0.00', '1', '1,2', '', '', '', '', '', '', '', '小米', null, null, null), ('23', '6', '19', '0', '毛衫测试', '手机通讯', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180604/1522738681.jpg', 'NO.1098', '1', '1', '1', '0', '0', '0', '99', '99', '1000', '毛衫测试11', 'xxx', '109.00', '100', '0', '件', '1000.00', '1', '1,2,3', '毛衫测试', '毛衫测试', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180604/1522738681.jpg,http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180604/1522738681.jpg', '毛衫测试', '毛衫测试', '<p><img class=\"wscnph\" src=\"http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180604/155x54.bmp\" /><img class=\"wscnph\" src=\"http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180604/APP登录bg1080.jpg\" width=\"500\" height=\"500\" /><img class=\"wscnph\" src=\"http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180604/APP登录界面.jpg\" width=\"500\" height=\"500\" /></p>', '', '小米', null, null, null), ('24', '6', '7', '0', 'xxx', '外套', '', '', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'xxx', '', '0.00', '100', '0', '', '0.00', '0', '', '', '', '', '', '', '', '', '小米', null, null, null), ('26', '3', '19', '0', '华为 HUAWEI P20 ', '手机通讯', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ac1bf58Ndefaac16.jpg', '6946605', '1', '1', '1', '0', '100', '0', '3788', '3788', '0', 'AI智慧全面屏 6GB +64GB 亮黑色 全网通版 移动联通电信4G手机 双卡双待手机 双卡双待', '', '4288.00', '1000', '0', '件', '0.00', '1', '2,3,1', '', '', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ab46a3cN616bdc41.jpg,http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ac1bf5fN2522b9dc.jpg', '', '', '<p><img class=\"wscnph\" src=\"http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ad44f1cNf51f3bb0.jpg\" /><img class=\"wscnph\" src=\"http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ad44fa8Nfcf71c10.jpg\" /><img class=\"wscnph\" src=\"http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ad44fa9N40e78ee0.jpg\" /><img class=\"wscnph\" src=\"http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ad457f4N1c94bdda.jpg\" /><img class=\"wscnph\" src=\"http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5ad457f5Nd30de41d.jpg\" /><img class=\"wscnph\" src=\"http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/5b10fb0eN0eb053fb.jpg\" /></p>', '', '华为', null, null, null), ('27', '6', '19', '0', '小米8 全面屏游戏智能手机 6GB+64GB 黑色 全网通4G 双卡双待', '手机通讯', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/xiaomi.jpg', '7437788', '1', '1', '1', '0', '0', '0', '2699', '2699', '0', '骁龙845处理器，红外人脸解锁，AI变焦双摄，AI语音助手小米6X低至1299，点击抢购', '小米8 全面屏游戏智能手机 6GB+64GB 黑色 全网通4G 双卡双待', '2699.00', '100', '0', '', '0.00', '0', '', '', '', '', '', '', '<p><img class=\"wscnph\" src=\"http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5b2254e8N414e6d3a.jpg\" width=\"500\" /></p>', '', '小米', null, null, null), ('28', '6', '19', '0', '小米 红米5A 全网通版 3GB+32GB 香槟金 移动联通电信4G手机 双卡双待', '手机通讯', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5a9d248cN071f4959.jpg', '7437789', '1', '1', '1', '0', '0', '0', '649', '649', '0', '8天超长待机，137g轻巧机身，高通骁龙处理器小米6X低至1299，点击抢购', '', '649.00', '100', '0', '', '0.00', '0', '', '', '', '', '', '', '', '', '小米', null, null, null), ('29', '51', '19', '0', 'Apple iPhone 8 Plus 64GB 红色特别版 移动联通电信4G手机', '手机通讯', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5acc5248N6a5f81cd.jpg', '7437799', '1', '1', '0', '0', '0', '0', '5499', '5499', '0', '【限时限量抢购】Apple产品年中狂欢节，好物尽享，美在智慧！速来 >> 勾选[保障服务][原厂保2年]，获得AppleCare+全方位服务计划，原厂延保售后无忧。', '', '5499.00', '100', '0', '', '0.00', '0', '', '', '', '', '', '', '', '', '苹果', null, null, null), ('30', '50', '8', '0', 'HLA海澜之家简约动物印花短袖T恤', 'T恤', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5ad83a4fN6ff67ecd.jpg!cc_350x449.jpg', 'HNTBJ2E042A', '1', '1', '1', '0', '0', '0', '0', '0', '0', '2018夏季新品微弹舒适新款短T男生 6月6日-6月20日，满300减30，参与互动赢百元礼券，立即分享赢大奖', '', '98.00', '100', '0', '', '0.00', '0', '', '', '', '', '', '', '', '', '海澜之家', null, null, null), ('31', '50', '8', '0', 'HLA海澜之家蓝灰花纹圆领针织布短袖T恤', 'T恤', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5ac98b64N70acd82f.jpg!cc_350x449.jpg', 'HNTBJ2E080A', '1', '0', '0', '0', '0', '0', '0', '0', '0', '2018夏季新品短袖T恤男HNTBJ2E080A 蓝灰花纹80 175/92A/L80A 蓝灰花纹80 175/92A/L', '', '98.00', '100', '0', '', '0.00', '0', '', '', '', '', '', '', '', '', '海澜之家', null, null, null), ('32', '50', '8', '0', 'HLA海澜之家短袖T恤男基础款', 'T恤', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5a51eb88Na4797877.jpg', 'HNTBJ2E153A', '1', '0', '0', '0', '0', '0', '0', '0', '0', 'HLA海澜之家短袖T恤男基础款简约圆领HNTBJ2E153A藏青(F3)175/92A(50)', '', '68.00', '100', '0', '', '0.00', '0', '', '', '', '', '', '', '', '', '海澜之家', null, null, null), ('33', '6', '35', '0', '小米（MI）小米电视4A ', '手机数码', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5b02804dN66004d73.jpg', '4609652', '1', '0', '0', '0', '0', '0', '0', '0', '0', '小米（MI）小米电视4A 55英寸 L55M5-AZ/L55M5-AD 2GB+8GB HDR 4K超高清 人工智能网络液晶平板电视', '', '2499.00', '100', '0', '', '0.00', '0', '', '', '', '', '', '', '', '', '小米', null, null, null), ('34', '6', '35', '0', '小米（MI）小米电视4A 65英寸', '手机数码', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5b028530N51eee7d4.jpg', '4609660', '1', '0', '0', '0', '0', '0', '0', '0', '0', ' L65M5-AZ/L65M5-AD 2GB+8GB HDR 4K超高清 人工智能网络液晶平板电视', '', '3999.00', '100', '0', '', '0.00', '0', '', '', '', '', '', '', '', '', '小米', null, null, null), ('35', '58', '29', '0', '耐克NIKE 男子 休闲鞋 ROSHE RUN 运动鞋 511881-010黑色41码', '男鞋', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5b235bb9Nf606460b.jpg', '6799342', '1', '0', '0', '0', '0', '0', '0', '0', '0', '耐克NIKE 男子 休闲鞋 ROSHE RUN 运动鞋 511881-010黑色41码', '', '369.00', '100', '0', '', '0.00', '0', '', '', '', '', '', '', '', '', 'NIKE', null, null, null), ('36', '58', '29', '0', '耐克NIKE 男子 气垫 休闲鞋 AIR MAX 90 ESSENTIAL 运动鞋 AJ1285-101白色41码', '男鞋', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180615/5b19403eN9f0b3cb8.jpg', '6799345', '1', '1', '1', '0', '0', '0', '0', '0', '0', '耐克NIKE 男子 气垫 休闲鞋 AIR MAX 90 ESSENTIAL 运动鞋 AJ1285-101白色41码', '', '499.00', '100', '0', '', '0.00', '0', '', '', '', '', '', '', '', '', 'NIKE', null, null, null);
COMMIT;

-- ----------------------------
--  Table structure for `p_product_attr`
-- ----------------------------
DROP TABLE IF EXISTS `p_product_attr`;
CREATE TABLE `p_product_attr` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `select_type` int(1) DEFAULT NULL COMMENT '属性选择类型：0->唯一；1->单选；2->多选',
  `input_type` int(1) DEFAULT NULL COMMENT '属性录入方式：0->手工录入；1->从列表中选取',
  `input_list` varchar(255) DEFAULT NULL COMMENT '可选值列表，以逗号隔开',
  `sort` int(11) DEFAULT NULL,
  `filter_type` int(1) DEFAULT NULL COMMENT '分类筛选样式：1->普通；1->颜色',
  `search_type` int(1) DEFAULT NULL COMMENT '检索类型；0->不需要进行检索；1->关键字检索；2->范围检索',
  `related_status` int(1) DEFAULT NULL COMMENT '相同属性产品是否关联；0->不关联；1->关联',
  `hand_add_status` int(1) DEFAULT NULL COMMENT '是否支持手动新增；0->不支持；1->支持',
  `type` int(1) DEFAULT NULL COMMENT '属性的类型；0->规格；1->参数',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='商品属性参数表';

-- ----------------------------
--  Records of `p_product_attr`
-- ----------------------------
BEGIN;
INSERT INTO `p_product_attr` VALUES ('1', '尺寸', '2', '1', 'M,X,XL,2XL,3XL,4XL', '0', '0', '0', '0', '0', '0', null, null, null), ('7', '颜色', '2', '1', '黑色,红色,白色,粉色', '100', '0', '0', '0', '1', '0', null, null, null), ('13', '上市年份', '1', '1', '2013年,2014年,2015年,2016年,2017年', '0', '0', '0', '0', '0', '1', null, null, null), ('14', '上市年份1', '1', '1', '2013年,2014年,2015年,2016年,2017年', '0', '0', '0', '0', '0', '1', null, null, null), ('15', '上市年份2', '1', '1', '2013年,2014年,2015年,2016年,2017年', '0', '0', '0', '0', '0', '1', null, null, null), ('16', '上市年份3', '1', '1', '2013年,2014年,2015年,2016年,2017年', '0', '0', '0', '0', '0', '1', null, null, null), ('17', '上市年份4', '1', '1', '2013年,2014年,2015年,2016年,2017年', '0', '0', '0', '0', '0', '1', null, null, null), ('18', '上市年份5', '1', '1', '2013年,2014年,2015年,2016年,2017年', '0', '0', '0', '0', '0', '1', null, null, null), ('19', '适用对象', '1', '1', '青年女性,中年女性', '0', '0', '0', '0', '0', '1', null, null, null), ('20', '适用对象1', '2', '1', '青年女性,中年女性', '0', '0', '0', '0', '0', '1', null, null, null), ('21', '适用对象3', '2', '1', '青年女性,中年女性', '0', '0', '0', '0', '0', '1', null, null, null), ('24', '商品编号', '1', '0', '', '0', '0', '0', '0', '0', '1', null, null, null), ('25', '适用季节', '1', '1', '春季,夏季,秋季,冬季', '0', '0', '0', '0', '0', '1', null, null, null), ('32', '适用人群', '0', '1', '老年,青年,中年', '0', '0', '0', '0', '0', '1', null, null, null), ('33', '风格', '0', '1', '嘻哈风格,基础大众,商务正装', '0', '0', '0', '0', '0', '1', null, null, null), ('35', '颜色', '0', '0', '', '100', '0', '0', '0', '1', '0', null, null, null), ('37', '适用人群', '1', '1', '儿童,青年,中年,老年', '0', '0', '0', '0', '0', '1', null, null, null), ('38', '上市时间', '1', '1', '2017年秋,2017年冬,2018年春,2018年夏', '0', '0', '0', '0', '0', '1', null, null, null), ('39', '袖长', '1', '1', '短袖,长袖,中袖', '0', '0', '0', '0', '0', '1', null, null, null), ('40', '尺码', '0', '1', '29,30,31,32,33,34', '0', '0', '0', '0', '0', '0', null, null, null), ('41', '适用场景', '0', '1', '居家,运动,正装', '0', '0', '0', '0', '0', '1', null, null, null), ('42', '上市时间', '0', '1', '2018年春,2018年夏', '0', '0', '0', '0', '0', '1', null, null, null), ('43', '颜色', '0', '0', '', '100', '0', '0', '0', '1', '0', null, null, null), ('44', '容量', '0', '1', '16G,32G,64G,128G', '0', '0', '0', '0', '0', '0', null, null, null), ('45', '屏幕尺寸', '0', '0', '', '0', '0', '0', '0', '0', '1', null, null, null), ('46', '网络', '0', '1', '3G,4G', '0', '0', '0', '0', '0', '1', null, null, null), ('47', '系统', '0', '1', 'Android,IOS', '0', '0', '0', '0', '0', '1', null, null, null), ('48', '电池容量', '0', '0', '', '0', '0', '0', '0', '0', '1', null, null, null);
COMMIT;

-- ----------------------------
--  Table structure for `p_product_attr_value`
-- ----------------------------
DROP TABLE IF EXISTS `p_product_attr_value`;
CREATE TABLE `p_product_attr_value` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) DEFAULT NULL,
  `product_attr_id` bigint(20) DEFAULT NULL,
  `value` varchar(64) DEFAULT NULL COMMENT '手动添加规格或参数的值，参数单值，规格有多个时以逗号隔开',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=228 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='存储产品参数信息的表';

-- ----------------------------
--  Records of `p_product_attr_value`
-- ----------------------------
BEGIN;
INSERT INTO `p_product_attr_value` VALUES ('1', '9', '1', 'X', null, null, null), ('2', '10', '1', 'X', null, null, null), ('3', '11', '1', 'X', null, null, null), ('4', '12', '1', 'X', null, null, null), ('5', '13', '1', 'X', null, null, null), ('6', '14', '1', 'X', null, null, null), ('7', '18', '1', 'X', null, null, null), ('8', '7', '1', 'X', null, null, null), ('9', '7', '1', 'XL', null, null, null), ('10', '7', '1', 'XXL', null, null, null), ('11', '22', '7', 'x,xx', null, null, null), ('12', '22', '24', 'no110', null, null, null), ('13', '22', '25', '春季', null, null, null), ('14', '22', '37', '青年', null, null, null), ('15', '22', '38', '2018年春', null, null, null), ('16', '22', '39', '长袖', null, null, null), ('124', '23', '7', '米白色,浅黄色', null, null, null), ('125', '23', '24', 'no1098', null, null, null), ('126', '23', '25', '春季', null, null, null), ('127', '23', '37', '青年', null, null, null), ('128', '23', '38', '2018年春', null, null, null), ('129', '23', '39', '长袖', null, null, null), ('130', '1', '13', null, null, null, null), ('131', '1', '14', null, null, null, null), ('132', '1', '15', null, null, null, null), ('133', '1', '16', null, null, null, null), ('134', '1', '17', null, null, null, null), ('135', '1', '18', null, null, null, null), ('136', '1', '19', null, null, null, null), ('137', '1', '20', null, null, null, null), ('138', '1', '21', null, null, null, null), ('139', '2', '13', null, null, null, null), ('140', '2', '14', null, null, null, null), ('141', '2', '15', null, null, null, null), ('142', '2', '16', null, null, null, null), ('143', '2', '17', null, null, null, null), ('144', '2', '18', null, null, null, null), ('145', '2', '19', null, null, null, null), ('146', '2', '20', null, null, null, null), ('147', '2', '21', null, null, null, null), ('183', '31', '24', null, null, null, null), ('184', '31', '25', '夏季', null, null, null), ('185', '31', '37', '青年', null, null, null), ('186', '31', '38', '2018年夏', null, null, null), ('187', '31', '39', '短袖', null, null, null), ('198', '30', '24', null, null, null, null), ('199', '30', '25', '夏季', null, null, null), ('200', '30', '37', '青年', null, null, null), ('201', '30', '38', '2018年夏', null, null, null), ('202', '30', '39', '短袖', null, null, null), ('203', '26', '43', '金色,银色', null, null, null), ('204', '26', '45', '5.0', null, null, null), ('205', '26', '46', '4G', null, null, null), ('206', '26', '47', 'Android', null, null, null), ('207', '26', '48', '3000', null, null, null), ('213', '27', '43', '黑色,蓝色', null, null, null), ('214', '27', '45', '5.8', null, null, null), ('215', '27', '46', '4G', null, null, null), ('216', '27', '47', 'Android', null, null, null), ('217', '27', '48', '3000ml', null, null, null), ('218', '28', '43', '金色,银色', null, null, null), ('219', '28', '45', '5.0', null, null, null), ('220', '28', '46', '4G', null, null, null), ('221', '28', '47', 'Android', null, null, null), ('222', '28', '48', '2800ml', null, null, null), ('223', '29', '43', '金色,银色', null, null, null), ('224', '29', '45', '4.7', null, null, null), ('225', '29', '46', '4G', null, null, null), ('226', '29', '47', 'IOS', null, null, null), ('227', '29', '48', '1960ml', null, null, null);
COMMIT;

-- ----------------------------
--  Table structure for `p_product_category`
-- ----------------------------
DROP TABLE IF EXISTS `p_product_category`;
CREATE TABLE `p_product_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parent_id` bigint(20) DEFAULT NULL COMMENT '上级分类的编号：0表示一级分类',
  `name` varchar(64) DEFAULT NULL,
  `level` int(1) DEFAULT NULL COMMENT '分类级别：0->1级；1->2级',
  `product_count` int(11) DEFAULT NULL,
  `product_unit` varchar(64) DEFAULT NULL,
  `nav_status` int(1) DEFAULT NULL COMMENT '是否显示在导航栏：0->不显示；1->显示',
  `show_status` int(1) DEFAULT NULL COMMENT '显示状态：0->不显示；1->显示',
  `sort` int(11) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL COMMENT '关键字,逗号分隔',
  `description` text COMMENT '描述',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11111112 DEFAULT CHARSET=utf8mb4 COMMENT='产品种类';

-- ----------------------------
--  Records of `p_product_category`
-- ----------------------------
BEGIN;
INSERT INTO `p_product_category` VALUES ('2', '0', '手机数码', '0', '100', '件', '1', '1', '1', null, '手机数码', '手机数码', null, null, null), ('3', '0', '家用电器', '0', '100', '件', '1', '1', '1', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/subject_cate_jiadian.png', '家用电器', '家用电器', null, null, null), ('4', '0', '家具家装', '0', '100', '件', '1', '1', '1', null, '家具家装', '家具家装', null, null, null), ('5', '0', '汽车用品', '0', '100', '件', '1', '1', '1', null, '汽车用品', '汽车用品', null, null, null), ('7', '1', '外套', '1', '100', '件', '1', '1', '0', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/product_cate_waitao.png', '外套', '外套', null, null, null), ('8', '1', 'T恤', '1', '100', '件', '1', '1', '0', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/product_cate_tshirt.png', 'T恤', 'T恤', null, null, null), ('9', '1', '休闲裤', '1', '100', '件', '1', '1', '0', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/product_cate_xiuxianku.png', '休闲裤', '休闲裤', null, null, null), ('10', '1', '牛仔裤', '1', '100', '件', '1', '1', '0', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/product_cate_niuzaiku.png', '牛仔裤', '牛仔裤', null, null, null), ('11', '1', '衬衫', '1', '100', '件', '1', '1', '0', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/product_cate_chenshan.png', '衬衫', '衬衫分类', null, null, null), ('13', '12', '家电子分类1', '1', '1', 'string', '0', '1', '0', 'string', 'string', 'string', null, null, null), ('14', '12', '家电子分类2', '1', '1', 'string', '0', '1', '0', 'string', 'string', 'string', null, null, null), ('19', '2', '手机通讯', '1', '0', '件', '1', '1', '0', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/product_cate_shouji.png', '手机通讯', '手机通讯', null, null, null), ('29', '1', '男鞋', '1', '0', '', '0', '0', '0', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/product_cate_xie.png', '', '', null, null, null), ('30', '2', '手机配件', '1', '0', '', '1', '1', '0', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/product_cate_peijian.png', '手机配件', '手机配件', null, null, null), ('31', '2', '摄影摄像', '1', '0', '', '1', '1', '0', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/product_cate_sheying.png', '', '', null, null, null), ('32', '2', '影音娱乐', '1', '0', '', '1', '1', '0', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/product_cate_yule.png', '', '', null, null, null), ('33', '2', '数码配件', '1', '0', '', '1', '1', '0', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/product_cate_yule.png', '', '', null, null, null), ('34', '2', '智能设备', '1', '0', '', '1', '1', '0', 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190129/product_cate_zhineng.png', '', '', null, null, null), ('35', '3', '电视', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('36', '3', '空调', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('37', '3', '洗衣机', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('38', '3', '冰箱', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('39', '3', '厨卫大电', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('40', '3', '厨房小电', '1', '0', '', '0', '0', '0', '', '', '', null, null, null), ('41', '3', '生活电器', '1', '0', '', '0', '0', '0', '', '', '', null, null, null), ('42', '3', '个护健康', '1', '0', '', '0', '0', '0', '', '', '', null, null, null), ('43', '4', '厨房卫浴', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('44', '4', '灯饰照明', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('45', '4', '五金工具', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('46', '4', '卧室家具', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('47', '4', '客厅家具', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('48', '5', '全新整车', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('49', '5', '车载电器', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('50', '5', '维修保养', '1', '0', '', '1', '1', '0', '', '', '', null, null, null), ('51', '5', '汽车装饰', '1', '0', '', '1', '1', '0', '', '', '', null, null, null);
COMMIT;

-- ----------------------------
--  Table structure for `p_promotion`
-- ----------------------------
DROP TABLE IF EXISTS `p_promotion`;
CREATE TABLE `p_promotion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) DEFAULT NULL COMMENT '关联的产品编号',
  `promotion_price` decimal(10,2) DEFAULT NULL COMMENT '促销价格',
  `promotion_start_time` datetime DEFAULT NULL COMMENT '促销开始时间',
  `promotion_end_time` datetime DEFAULT NULL COMMENT '促销结束时间',
  `promotion_per_limit` int(11) DEFAULT NULL COMMENT '活动限购数量',
  `promotion_type` int(1) DEFAULT NULL COMMENT '促销类型：0->没有促销使用原价;1->使用促销价；2->使用会员价；3->使用阶梯价格；4->使用满减价格；5->限时购',
  `promotion_desc` bigint(20) DEFAULT NULL COMMENT '促销描述',
  `promotion_discount` smallint(6) DEFAULT NULL COMMENT '促销折扣,以 0 - 100 的整数描述',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COMMENT='营销推荐表';

-- ----------------------------
--  Table structure for `p_sku_stock`
-- ----------------------------
DROP TABLE IF EXISTS `p_sku_stock`;
CREATE TABLE `p_sku_stock` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) DEFAULT NULL,
  `sku_code` varchar(64) NOT NULL COMMENT 'sku编码',
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT '0' COMMENT '库存',
  `low_stock` int(11) DEFAULT NULL COMMENT '预警库存',
  `pic` varchar(255) DEFAULT NULL COMMENT '展示图片',
  `sale` int(11) DEFAULT NULL COMMENT '销量',
  `promotion_price` decimal(10,2) DEFAULT NULL COMMENT '单品促销价格',
  `lock_stock` int(11) DEFAULT '0' COMMENT '锁定库存',
  `sp1` varchar(64) DEFAULT NULL COMMENT '销售属性1',
  `sp2` varchar(64) DEFAULT NULL,
  `sp3` varchar(64) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COMMENT='库存表';

-- ----------------------------
--  Table structure for `u_member`
-- ----------------------------
DROP TABLE IF EXISTS `u_member`;
CREATE TABLE `u_member` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `integration` int(11) DEFAULT NULL COMMENT '积分',
  `growth` int(11) DEFAULT NULL COMMENT '成长值',
  `luckey_count` int(11) DEFAULT NULL COMMENT '剩余抽奖次数',
  `history_integration` int(11) DEFAULT NULL COMMENT '历史积分数量',
  `member_level_id` bigint(20) unsigned DEFAULT NULL COMMENT '会员等级编号',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COMMENT='会员表';

-- ----------------------------
--  Table structure for `u_member_level`
-- ----------------------------
DROP TABLE IF EXISTS `u_member_level`;
CREATE TABLE `u_member_level` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '等级名称',
  `growth_point` int(11) DEFAULT NULL COMMENT '成长点',
  `default_status` int(1) DEFAULT NULL COMMENT '是否为默认等级：0->不是；1->是',
  `free_delivery_point` decimal(10,2) DEFAULT NULL COMMENT '免运费标准',
  `comment_growth_point` int(11) DEFAULT NULL COMMENT '每次评价获取的成长值',
  `priviledge_free_delivery` int(1) DEFAULT NULL COMMENT '是否有免邮特权',
  `priviledge_sign_in` int(1) DEFAULT NULL COMMENT '是否有签到特权',
  `priviledge_comment` int(1) DEFAULT NULL COMMENT '是否有评论获奖励特权',
  `priviledge_promotion` int(1) DEFAULT NULL COMMENT '是否有专享活动特权',
  `priviledge_member_price` int(1) DEFAULT NULL COMMENT '是否有会员价格特权',
  `priviledge_birthday` int(1) DEFAULT NULL COMMENT '是否有生日特权',
  `note` varchar(200) DEFAULT NULL COMMENT '备注',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='会员等级表';

-- ----------------------------
--  Table structure for `u_permission`
-- ----------------------------
DROP TABLE IF EXISTS `u_permission`;
CREATE TABLE `u_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pid` bigint(20) DEFAULT NULL COMMENT '父级权限id',
  `name` varchar(100) DEFAULT NULL COMMENT '名称',
  `value` varchar(200) DEFAULT NULL COMMENT '权限值',
  `icon` varchar(500) DEFAULT NULL COMMENT '图标',
  `type` int(1) DEFAULT NULL COMMENT '权限类型：0->目录；1->菜单；2->按钮（接口绑定权限）',
  `uri` varchar(200) DEFAULT NULL COMMENT '前端资源路径',
  `status` int(1) DEFAULT NULL COMMENT '启用状态；0->禁用；1->启用',
  `sort` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COMMENT='后台用户权限表';

-- ----------------------------
--  Table structure for `u_role`
-- ----------------------------
DROP TABLE IF EXISTS `u_role`;
CREATE TABLE `u_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '名称',
  `description` varchar(500) DEFAULT NULL COMMENT '描述',
  `admin_count` int(11) DEFAULT NULL COMMENT '后台用户数量',
  `status` int(1) DEFAULT '1' COMMENT '启用状态：0->禁用；1->启用',
  `sort` int(11) DEFAULT '0' COMMENT '排序值',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='后台用户角色表';

-- ----------------------------
--  Table structure for `u_role_permission_relation`
-- ----------------------------
DROP TABLE IF EXISTS `u_role_permission_relation`;
CREATE TABLE `u_role_permission_relation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) DEFAULT NULL,
  `permission_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COMMENT='后台用户角色和权限关系表';

-- ----------------------------
--  Table structure for `u_user`
-- ----------------------------
DROP TABLE IF EXISTS `u_user`;
CREATE TABLE `u_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) DEFAULT NULL COMMENT '用户名',
  `password` varchar(64) DEFAULT NULL COMMENT '密码',
  `nickname` varchar(64) DEFAULT NULL COMMENT '昵称',
  `phone` varchar(64) DEFAULT NULL COMMENT '手机号码',
  `status` int(1) DEFAULT NULL COMMENT '帐号启用状态:0->禁用；1->启用',
  `avatar` varchar(500) DEFAULT NULL,
  `gender` int(1) DEFAULT NULL COMMENT '性别：0->未知；1->男；2->女',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `city` varchar(64) DEFAULT NULL COMMENT '所在城市',
  `job` varchar(100) DEFAULT NULL COMMENT '职业',
  `personalized_signature` varchar(200) DEFAULT NULL COMMENT '个性签名',
  `source_type` int(1) DEFAULT NULL COMMENT '用户来源',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`),
  UNIQUE KEY `idx_phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COMMENT='会员表';

SET FOREIGN_KEY_CHECKS = 1;
