package apidocs;

import org.springdoc.core.properties.SwaggerUiConfigParameters;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class SwaggerConfigController {

    private final SwaggerUiConfigParameters swaggerUiConfigParameters;

    public SwaggerConfigController(SwaggerUiConfigParameters swaggerUiConfigParameters) {
        this.swaggerUiConfigParameters = swaggerUiConfigParameters;
    }

    @GetMapping("/api/swagger-config")
    public Map<String, Object> swaggerConfig() {
        return swaggerUiConfigParameters.getConfigParameters();
    }
}