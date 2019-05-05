# Spring Boot 中使用 MyBatis 下实现多数据源动态切换，读写分离

## 配置数据源

- application.properties

```properties
spring.datasource.druid.master.name=master
spring.datasource.druid.master.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.druid.master.url=jdbc:mysql://localhost/product_master?useSSL=false
spring.datasource.druid.master.port=3306
spring.datasource.druid.master.username=root
spring.datasource.druid.master.password=123456

spring.datasource.druid.slave.name=slave
spring.datasource.druid.slave.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.druid.slave.url=jdbc:mysql://localhost/product_slave?useSSL=false
spring.datasource.druid.slave.port=3306
spring.datasource.druid.slave.username=root
spring.datasource.druid.slave.password=123456

# Druid dataSource config
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.druid.initial-size=5
spring.datasource.druid.max-active=20
spring.datasource.druid.min-idle=5
spring.datasource.druid.max-wait=60000
spring.datasource.druid.pool-prepared-statements=true
spring.datasource.druid.max-pool-prepared-statement-per-connection-size=20
spring.datasource.druid.max-open-prepared-statements=20
spring.datasource.druid.validation-query=SELECT 1
spring.datasource.druid.validation-query-timeout=30000
spring.datasource.druid.test-on-borrow=false
spring.datasource.druid.test-on-return=false
spring.datasource.druid.test-while-idle=false
#spring.datasource.druid.time-between-eviction-runs-millis=
#spring.datasource.druid.min-evictable-idle-time-millis=
#spring.datasource.druid.max-evictable-idle-time-millis=10000

# Druid stat filter config
spring.datasource.druid.filters=stat,wall,log4j,slf4j
spring.datasource.druid.web-stat-filter.enabled=true
spring.datasource.druid.web-stat-filter.url-pattern=/druid/*
#spring.datasource.druid.web-stat-filter.exclusions=
spring.datasource.druid.web-stat-filter.session-stat-enable=true
spring.datasource.druid.web-stat-filter.session-stat-max-count=10
#spring.datasource.druid.web-stat-filter.principal-session-name=
#spring.datasource.druid.web-stat-filter.principal-cookie-name=
spring.datasource.druid.web-stat-filter.profile-enable=true
spring.datasource.druid.filter.stat.db-type=mysql
spring.datasource.druid.filter.stat.log-slow-sql=true
spring.datasource.druid.filter.stat.slow-sql-millis=1000
spring.datasource.druid.filter.stat.merge-sql=true
spring.datasource.druid.filter.wall.enabled=true
spring.datasource.druid.filter.wall.db-type=mysql
spring.datasource.druid.filter.wall.config.delete-allow=true
spring.datasource.druid.filter.wall.config.drop-table-allow=false

# Druid manage page config
spring.datasource.druid.stat-view-servlet.enabled=true
spring.datasource.druid.stat-view-servlet.url-pattern=/druid/*
spring.datasource.druid.stat-view-servlet.reset-enable=true
spring.datasource.druid.stat-view-servlet.login-username=admin
spring.datasource.druid.stat-view-servlet.login-password=admin
#spring.datasource.druid.stat-view-servlet.allow=
#spring.datasource.druid.stat-view-servlet.deny=

# Druid AOP config
spring.datasource.druid.aop-patterns=wx.service.*
spring.aop.proxy-target-class=true

mybatis.type-aliases-package=wx.mapper
mybatis.mapper-locations=mappers/**Mapper.xml

```

## 配置数据源

- DataSourceRoutingDataSource.java

该类继承自 `AbstractRoutingDataSource` 类，在访问数据库时会调用该类的 `determineCurrentLookupKey()`
方法获取数据库实例的 key

```java
public class DynamicRoutingDataSource extends AbstractRoutingDataSource {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    protected Object determineCurrentLookupKey() {
        logger.info("Current DataSource is [{}]", DynamicDataSourceContextHolder.getDataSourceKey());
        return DynamicDataSourceContextHolder.getDataSourceKey();
    }
}

```

- DataSourceConfigurer.java

数据源配置类，在该类中生成多个数据源实例并将其注入到 `ApplicationContext` 中

```java
@Configuration
public class DataSourceConfig {

    /**
     * master DataSource
     * @Primary 注解用于标识默认使用的 DataSource Bean，因为有三个 DataSource Bean，该注解可用于 master
     * 或 slave DataSource Bean, 但不能用于 dynamicDataSource Bean, 否则会产生循环调用
     *
     * @ConfigurationProperties 注解用于从 application.properties 文件中读取配置，为 Bean 设置属性
     * @return data source
     */
    @Bean("master")
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource.druid.master")
    public DataSource master() {
        return DruidDataSourceBuilder.create().build();
    }

    /**
     * slave DataSource
     *
     * @return data source
     */
    @Bean("slave")
    @ConfigurationProperties(prefix = "spring.datasource.druid.slave")
    public DataSource slave() {
        return DruidDataSourceBuilder.create().build();
    }

    /**
     * Dynamic data source.
     *
     * @return the data source
     */
    @Bean("dynamicDataSource")
    public DataSource dynamicDataSource() {
        DynamicRoutingDataSource dynamicRoutingDataSource = new DynamicRoutingDataSource();
        Map<Object, Object> dataSourceMap = new HashMap<>(2);
        dataSourceMap.put("master", master());
        dataSourceMap.put("slave", slave());

        // 将 master 数据源作为默认指定的数据源
        dynamicRoutingDataSource.setDefaultTargetDataSource(master());
        // 将 master 和 slave 数据源作为指定的数据源
        dynamicRoutingDataSource.setTargetDataSources(dataSourceMap);

        // 将数据源的 key 放到数据源上下文的 key 集合中，用于切换时判断数据源是否有效
        DynamicDataSourceContextHolder.dataSourceKeys.addAll(dataSourceMap.keySet());
        return dynamicRoutingDataSource;
    }

    /**
     * 配置 SqlSessionFactoryBean
     * @ConfigurationProperties 在这里是为了将 MyBatis 的 mapper 位置和持久层接口的别名设置到
     * Bean 的属性中，如果没有使用 *.xml 则可以不用该配置，否则将会产生 invalid bond statement 异常
     *
     * @return the sql session factory bean
     */
    @Bean
    @ConfigurationProperties(prefix = "mybatis")
    public SqlSessionFactoryBean sqlSessionFactoryBean() {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        // 配置数据源，此处配置为关键配置，如果没有将 dynamicDataSource 作为数据源则不能实现切换
        sqlSessionFactoryBean.setDataSource(dynamicDataSource());
        return sqlSessionFactoryBean;
    }


    /**
     * 配置事务管理，如果使用到事务需要注入该 Bean，否则事务不会生效
     * 在需要的地方加上 @Transactional 注解即可
     * @return the platform transaction manager
     */
    @Bean
    public PlatformTransactionManager transactionManager() {
        return new DataSourceTransactionManager(dynamicDataSource());
    }
}

```

- DynamicDataSourceContextHolder.java

该类为数据源上下文配置，用于切换数据源

```java
public class DynamicDataSourceContextHolder {

    /**
     * Maintain variable for every thread, to avoid effect other thread
     */
    private static final ThreadLocal<String> contextHolder = new ThreadLocal<String>() {

        /**
         * 将 master 数据源的 key 作为默认数据源的 key
         */
        @Override
        protected String initialValue() {
            return "master";
        }
    };

    /**
     * 数据源的 key 集合，用于切换时判断数据源是否存在
     */
    public static List<Object> dataSourceKeys = new ArrayList<>();

    /**
     * To switch DataSource
     *
     * @param key the key
     */
    public static void setDataSourceKey(String key) {
        contextHolder.set(key);
    }

    /**
     * Get current DataSource
     *
     * @return data source key
     */
    public static String getDataSourceKey() {
        return contextHolder.get();
    }

    /**
     * To set DataSource as default
     */
    public static void clearDataSourceKey() {
        contextHolder.remove();
    }

    /**
     * Check if give DataSource is in current DataSource list
     *
     * @param key the key
     * @return boolean boolean
     */
    public static boolean containDataSourceKey(String key) {
        return dataSourceKeys.contains(key);
    }
}

```

- TargetDataSource.java

数据源注解，用于设置数据源的 key，指定使用哪个数据源

```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface TargetDataSource {
    String value();
}

```

- DynamicDataSourceAspect.java

动态数据源切换的切面，切 `@TargetDataSource` 注解，实现数据源切换

```java
@Aspect
@Component
public class DynamicDataSourceAspect {
    private static final Logger logger = LoggerFactory.getLogger(DynamicDataSourceAspect.class);

    /**
     * Switch DataSource
     *
     * @param point
     * @param targetDataSource
     */
    @Before("@annotation(targetDataSource))")
    public void switchDataSource(JoinPoint point, TargetDataSource targetDataSource) {
        if (!DynamicDataSourceContextHolder.containDataSourceKey(targetDataSource.value())) {
            logger.error("DataSource [{}] doesn't exist, use default DataSource [{}]", targetDataSource.value());
        } else {
            // 切换数据源
            DynamicDataSourceContextHolder.setDataSourceKey(targetDataSource.value());
            logger.info("Switch DataSource to [{}] in Method [{}]",
                    DynamicDataSourceContextHolder.getDataSourceKey(), point.getSignature());
        }
    }

    /**
     * Restore DataSource
     *
     * @param point
     * @param targetDataSource
     */
    @After("@annotation(targetDataSource))")
    public void restoreDataSource(JoinPoint point, TargetDataSource targetDataSource) {
        // 将数据源置为默认数据源
        DynamicDataSourceContextHolder.clearDataSourceKey();
        logger.info("Restore DataSource to [{}] in Method [{}]",
                DynamicDataSourceContextHolder.getDataSourceKey(), point.getSignature());
    }

}

```

## 配置 Product REST API 接口

- ProductController.java

```java
@RestController
@RequestMapping("/product")
public class ProduceController {

    @Autowired
    private ProductService productService;

    /**
     * Get all product
     *
     * @return
     * @throws Exception
     */
    @GetMapping("/master")
    @TargetDataSource("master")
    public List<Product> getAllMasterProduct() throws Exception {
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
    public List<Product> getAllSlaveProduct() throws Exception {
        return productService.selectAll();
    }
}

```

启动项目，此时访问 `/product/master` 会返回 `product_master` 数据库中 `product` 表中的所有数据，访问 `/product/slave` 会返回 `product_slave` 数据库中 `product` 表中的数据，同时也可以在看到切换数据源的 log，说明动态切换数据源是有效的。

在实际项目中如果使用注解的方式挨个标记并不是合理的方式，而且局限性太大，一个方法中可能既有查询又有写入，所以无法很好的实现读写分离；更好的方式是通过 AOP 切持久层接口，通过接口的方法名来判断应当使用哪种数据源，不过该方式要求使用统一的命名方式。
