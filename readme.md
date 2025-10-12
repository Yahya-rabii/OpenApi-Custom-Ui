# API Documentation Portal

## Project Description

A modern API Documentation Portal with a hexagonal interface design that displays API endpoints in an interactive, visually appealing way. This project provides a custom Swagger OpenAPI documentation interface that allows you to expose your APIs to integrators or clients in a more branded, user-friendly, and visually appealing way.

## Features

- **Hexagonal Interface**: APIs are displayed in a beautiful hexagonal grid layout
- **Search Functionality**: Real-time search through API names and endpoints  
- **Swagger Integration**: Full Swagger UI integration for API documentation
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Glass morphism design with smooth animations



## Project Structure

```
├───api-docs                           # spring boot demo application
│   ├───src                            # Source code
│   │   ├───main                       # Production source code and resources
│   │   │   ├───java                   # Java source files directory
│   │   │   │   └───apidocs            # Root package containing the main application classes and API documentation logic
│   │   │   └───resources              # Non-Java resources and configuration files
│   │   │       └───static             # Static web assets served directly by the web server
│   │   │           └───swagger-ui     # Custom Swagger UI assets and configuration files for API documentation interface
│   │   └───test
│   │       └───java
│   │           └───apidocs
│   └───pom.xml                        # Maven build file
-----

├── static-demo/          # Standalone Node.js server demo
│   ├── server.js         # Express.js server
│   ├── index.html        # Main portal interface
│   ├── data.json         # API configuration data
│   ├── package.json      # Node.js dependencies
│   └── logo.png          # Logo image

```


## Quick Start

### Option 1: Standalone Node.js Server 
#### Prerequisites
- Node.js (version 14.0.0 or higher)
- npm (comes with Node.js)

#### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

The Node.js server will:
- Serve the hexagonal UI interface
- Load API data from `data.json`
- Provide mock Swagger documentation for each API
- Handle search and filtering functionality

## Project Structure

```
/
├── server.js          # Express.js server
├── index.html         # Main portal interface
├── data.json          # API configuration data
├── package.json       # Node.js dependencies
└── README.md          # This file
```

## Spring Boot Integration

For **real integration** with a Spring Boot application using Gateway with Service Discovery:

### 1. Copy Static Files

Place these files in your Spring Boot project:
```
src/main/resources/static/swagger-ui/
├── index.html          # Main portal interface
├── data.json           # Your API configuration
├── favicon-16x16.png
├── favicon-32x32.png
├── index.css
├── logo.png
├── oauth2-redirect.html
├── swagger-initializer.js
├── swagger-ui-bundle.js
├── swagger-ui-bundle.js.map
├── swagger-ui-es-bundle-core.js
├── swagger-ui-es-bundle-core.js.map
├── swagger-ui-es-bundle.js
├── swagger-ui-es-bundle.js.map
├── swagger-ui-standalone-preset.js
├── swagger-ui-standalone-preset.js.map
├── swagger-ui.css
├── swagger-ui.css.map
├── swagger-ui.js
└── swagger-ui.js.map
```

### 2. Configure Application Properties

In your `application.yml` or `application.properties`:

```yaml
springdoc:
  swagger-ui:
    enabled: false  # Disable default Swagger UI
  api-docs:
    path: /api
```

### 3. Add Required Configuration Beans

Since Swagger UI is disabled, you need these beans to fetch API data:

```java
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
```

### 4. Add Swagger Config Controller

```java
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
```

### 5. Access Your Custom UI

Navigate to: `http://your-app-url/swagger-ui/index.html`

## Running the included Spring Boot demo (Windows / PowerShell)

If you want to run the demo Spring Boot application included in `api-docs/`, make sure you have the following prerequisites installed on your machine:

- Java 17 (or later) installed and available on your PATH (java -version should report a Java 17 runtime)
- Maven installed and available on your PATH (mvn -v should report Maven)

Then open PowerShell, change into the `api-docs` folder and run the Maven build and the generated jar. Example commands:

```powershell
mvn clean compile package

# After the build completes, run the generated jar (adjust version if different)

java -jar .\target\api-docs-0.4.0-SNAPSHOT.jar
```

When the application starts you should see Spring Boot startup logs and an ASCII Spring Boot banner. By default the app will serve the custom Swagger UI static files under `/swagger-ui/`. For example, open in your browser:

```
http://localhost:8000/swagger-ui/index.html
```

Troubleshooting
- If `mvn` or `java` are not recognised, ensure Java 17 and Maven are correctly installed and added to your PATH.


Notes
- The demo application was built with Spring Boot 3.4.x and requires Java 17+ at runtime. If you need to change the packaged artifact name, update the `java -jar` command accordingly.

## Summary

This project provides two deployment options:

1. **Standalone Node.js Server**: Complete solution with backend API serving mock Swagger documentation

2. **Spring Boot Integration**: Professional integration with real microservices using Gateway and Service Discovery

## License

Feel free to use and modify for your API documentation needs.

## Demo Video

https://github.com/user-attachments/assets/7150c46b-478c-44b0-8c61-d40d20f0a635


