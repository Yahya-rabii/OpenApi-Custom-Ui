package apidocs;

import java.util.ArrayList;
import java.util.List;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.reactive.result.view.RedirectView;

import java.util.ArrayList;
import java.util.List;

@Configuration
@Controller
public class OpenApiConfig {

	@Bean
	public List<GroupedOpenApi> apis(final RouteDefinitionLocator locator) {
		List<GroupedOpenApi> groups = new ArrayList<>();
		List<RouteDefinition> definitions = locator.getRouteDefinitions().collectList().block();

        assert definitions != null;
        definitions.stream()
                   .filter(routeDefinition -> routeDefinition.getId().matches(".*-core"))
                   .forEach(routeDefinition -> {
					   String groupName = String.format("%s/%s/%s",
														routeDefinition.getMetadata().get("domain"),
														routeDefinition.getMetadata().get("service"),
														routeDefinition.getMetadata().get("version"));

					   groups.add(GroupedOpenApi.builder()
												.group(groupName)
												.pathsToMatch("/**")
												.build());
				   });
		return groups;
	}

	@GetMapping("/")
	public RedirectView redirectWithUsingRedirectView() {
		return new RedirectView("/swagger-ui/index.html");
	}

}
