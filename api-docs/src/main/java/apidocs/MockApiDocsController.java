package apidocs;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class MockApiDocsController {

    /**
     * This controller serves mock OpenAPI specs for all API endpoints
     * that match the pattern /api/{domain}/{service}/{version}/api-docs
     */
    @GetMapping(value = "/api/{domain}/{service}/{version}/api-docs", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getMockApiDocs(
            @PathVariable String domain,
            @PathVariable String service,
            @PathVariable String version) {
        
        String apiTitle = String.format("%s/%s/%s API", domain, service, version);
        String apiPath = String.format("/api/%s/%s/%s", domain, service, version);
        
        return createMockOpenApiSpec(apiTitle, apiPath, domain, service, version);
    }

    /**
     * Creates a mock OpenAPI 3.0 specification
     */
    private Map<String, Object> createMockOpenApiSpec(String title, String basePath, 
                                                       String domain, String service, String version) {
        Map<String, Object> spec = new HashMap<>();
        
        // OpenAPI version
        spec.put("openapi", "3.0.1");
        
        // Info section
        Map<String, Object> info = new HashMap<>();
        info.put("title", title);
        info.put("description", "Mock API specification for " + title);
        info.put("version", version);
        spec.put("info", info);
        
        // Servers section
        Map<String, Object> server = new HashMap<>();
        server.put("url", basePath);
        server.put("description", "Mock server for " + service);
        spec.put("servers", new Object[]{server});
        
        // Paths section with example endpoints
        Map<String, Object> paths = new HashMap<>();
        
        // GET endpoint
        Map<String, Object> getOperation = createOperation(
            "get",
            "List all " + service + " resources",
            "Returns a list of " + service + " items",
            "200",
            "Successful operation"
        );
        Map<String, Object> getPath = new HashMap<>();
        getPath.put("get", getOperation);
        paths.put("/resources", getPath);
        
        // POST endpoint
        Map<String, Object> postOperation = createOperation(
            "post",
            "Create a new " + service + " resource",
            "Creates a new " + service + " item",
            "201",
            "Resource created successfully"
        );
        Map<String, Object> postPath = new HashMap<>();
        postPath.put("post", postOperation);
        paths.put("/resources", postPath);
        
        // GET by ID endpoint
        Map<String, Object> getByIdOperation = createOperation(
            "get",
            "Get " + service + " resource by ID",
            "Returns a single " + service + " item",
            "200",
            "Successful operation"
        );
        Map<String, Object> getByIdPath = new HashMap<>();
        getByIdPath.put("get", getByIdOperation);
        
        // Add path parameter
        Map<String, Object> pathParam = new HashMap<>();
        pathParam.put("name", "id");
        pathParam.put("in", "path");
        pathParam.put("required", true);
        pathParam.put("description", "Resource ID");
        Map<String, String> schema = new HashMap<>();
        schema.put("type", "string");
        pathParam.put("schema", schema);
        getByIdOperation.put("parameters", new Object[]{pathParam});
        
        paths.put("/resources/{id}", getByIdPath);
        
        // PUT endpoint
        Map<String, Object> putOperation = createOperation(
            "put",
            "Update " + service + " resource",
            "Updates an existing " + service + " item",
            "200",
            "Resource updated successfully"
        );
        Map<String, Object> putPath = new HashMap<>();
        putPath.put("put", putOperation);
        
        // Add path parameter for PUT
        Map<String, Object> putPathParam = new HashMap<>();
        putPathParam.put("name", "id");
        putPathParam.put("in", "path");
        putPathParam.put("required", true);
        putPathParam.put("description", "Resource ID");
        putPathParam.put("schema", schema);
        putOperation.put("parameters", new Object[]{putPathParam});
        
        paths.put("/resources/{id}", putPath);
        
        // DELETE endpoint
        Map<String, Object> deleteOperation = createOperation(
            "delete",
            "Delete " + service + " resource",
            "Deletes a " + service + " item",
            "204",
            "Resource deleted successfully"
        );
        Map<String, Object> deletePath = new HashMap<>();
        deletePath.put("delete", deleteOperation);
        
        // Add path parameter for DELETE
        Map<String, Object> deletePathParam = new HashMap<>();
        deletePathParam.put("name", "id");
        deletePathParam.put("in", "path");
        deletePathParam.put("required", true);
        deletePathParam.put("description", "Resource ID");
        deletePathParam.put("schema", schema);
        deleteOperation.put("parameters", new Object[]{deletePathParam});
        
        paths.put("/resources/{id}", deletePath);
        
        spec.put("paths", paths);
        
        // Components section with example schema
        Map<String, Object> components = new HashMap<>();
        Map<String, Object> schemas = new HashMap<>();
        
        Map<String, Object> resourceSchema = new HashMap<>();
        resourceSchema.put("type", "object");
        
        Map<String, Object> properties = new HashMap<>();
        
        Map<String, String> idProp = new HashMap<>();
        idProp.put("type", "string");
        idProp.put("description", "Unique identifier");
        properties.put("id", idProp);
        
        Map<String, String> nameProp = new HashMap<>();
        nameProp.put("type", "string");
        nameProp.put("description", "Resource name");
        properties.put("name", nameProp);
        
        Map<String, String> descProp = new HashMap<>();
        descProp.put("type", "string");
        descProp.put("description", "Resource description");
        properties.put("description", descProp);
        
        Map<String, String> createdAtProp = new HashMap<>();
        createdAtProp.put("type", "string");
        createdAtProp.put("format", "date-time");
        createdAtProp.put("description", "Creation timestamp");
        properties.put("createdAt", createdAtProp);
        
        resourceSchema.put("properties", properties);
        schemas.put("Resource", resourceSchema);
        
        components.put("schemas", schemas);
        spec.put("components", components);
        
        // Tags section
        Map<String, String> tag = new HashMap<>();
        tag.put("name", service);
        tag.put("description", "Operations for " + service + " in " + domain);
        spec.put("tags", new Object[]{tag});
        
        return spec;
    }

    /**
     * Helper method to create an operation object
     */
    private Map<String, Object> createOperation(String method, String summary, 
                                                  String description, String responseCode, 
                                                  String responseDescription) {
        Map<String, Object> operation = new HashMap<>();
        operation.put("summary", summary);
        operation.put("description", description);
        operation.put("operationId", method + "Resource");
        
        // Responses
        Map<String, Object> responses = new HashMap<>();
        Map<String, Object> response = new HashMap<>();
        response.put("description", responseDescription);
        
        // Add content for successful responses
        if (!"204".equals(responseCode)) {
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> jsonContent = new HashMap<>();
            Map<String, Object> schema = new HashMap<>();
            
            if ("200".equals(responseCode) && method.equals("get")) {
                // Array response for list operations
                schema.put("type", "array");
                Map<String, String> items = new HashMap<>();
                items.put("$ref", "#/components/schemas/Resource");
                schema.put("items", items);
            } else {
                // Single object response
                schema.put("$ref", "#/components/schemas/Resource");
            }
            
            jsonContent.put("schema", schema);
            content.put("application/json", jsonContent);
            response.put("content", content);
        }
        
        responses.put(responseCode, response);
        operation.put("responses", responses);
        
        return operation;
    }
}
