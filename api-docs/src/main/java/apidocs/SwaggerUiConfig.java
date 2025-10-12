package apidocs;

import org.springdoc.core.models.GroupedOpenApi;
import org.springdoc.core.properties.SwaggerUiConfigParameters;
import org.springdoc.core.properties.SwaggerUiConfigProperties;
import org.springdoc.core.properties.AbstractSwaggerUiConfigProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerUiConfig {

    @Bean
    public SwaggerUiConfigParameters swaggerUiConfigParameters(List<GroupedOpenApi> groupedApis) {
        SwaggerUiConfigParameters params = new SwaggerUiConfigParameters(new SwaggerUiConfigProperties());

        params.setConfigUrl("/api/swagger-config");

        groupedApis.forEach(g -> {
            String group = g.getGroup();
            String url = "/api/" + group + "/api-docs";
            AbstractSwaggerUiConfigProperties.SwaggerUrl swaggerUrl =
                    new AbstractSwaggerUiConfigProperties.SwaggerUrl(group, url, group);
            params.getUrls().add(swaggerUrl);
        });

        return params;
    }
}