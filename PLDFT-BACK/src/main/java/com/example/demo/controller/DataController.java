package com.example.demo.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET })
public class DataController {

    private final String BASE_URL = "http://122.8.186.221:7582";

    // Obtener datos de un cliente específico
    @GetMapping("/getClienteData/{codigo}/{perfil}")
    @PreAuthorize("hasAuthority('ROLE_demo')")
    public ResponseEntity<String> getClienteData(
            @PathVariable String codigo,
            @PathVariable String perfil,
            @RequestHeader("Authorization") String authHeader) {

        String url = BASE_URL + "/clientes/spsClientesFM/" + codigo + "/" + perfil;
        return fetchExternalData(url, authHeader);
    }

    // Obtener datos de un cliente específico
    @GetMapping("/getClientesM/{codigo}/{perfil}")
    @PreAuthorize("hasAuthority('ROLE_demo')")
    public ResponseEntity<String> getClientesM(
            @PathVariable String codigo,
            @PathVariable String perfil,
            @RequestHeader("Authorization") String authHeader) {

        String url = BASE_URL + "/clientes/spsClientesFM/" + codigo + "/" + perfil;
        return fetchExternalData(url, authHeader);
    }

    @GetMapping("/getPerfilT/{codigo}/{perfil}")
    @PreAuthorize("hasAuthority('ROLE_demo')")
    public ResponseEntity<String> getPerfilT(
            @PathVariable String codigo,
            @PathVariable String perfil,
            @RequestHeader("Authorization") String authHeader) {

        String url = BASE_URL + "/clientes/spsClientesFM/" + codigo + "/" + perfil;
        return fetchExternalData(url, authHeader);
    }

    // Obtener movimientos del cliente
    @GetMapping("/getMovimientos")
    @PreAuthorize("hasAuthority('ROLE_demo')")
    public ResponseEntity<String> getMovimientos(@RequestHeader("Authorization") String authHeader) {
        String url = BASE_URL + "/tesoreria/lista-saldoMovimiento-by-cliente/1/1";
        return fetchExternalData(url, authHeader);
    }

    // Obtener las transacciones realizadas
    @GetMapping("/getTransacciones")
    @PreAuthorize("hasAuthority('ROLE_demo')")
    public ResponseEntity<String> getTransacciones(@RequestHeader("Authorization") String authHeader) {
        String url = BASE_URL + "/tesoreria/spsHistorialMovCli/35/0002/1";
        return fetchExternalData(url, authHeader);
    }

    @GetMapping("/contarClientesFisicos/{codigo}/{perfil}")
    @PreAuthorize("hasAuthority('ROLE_demo')")
    public ResponseEntity<String> contarClientesFisicos(
            @PathVariable String codigo,
            @PathVariable String perfil,
            @RequestHeader("Authorization") String authHeader) {

        String url = BASE_URL + "/clientes/spsClientesFM/" + codigo + "/" + perfil;
        return fetchExternalData(url, authHeader);

    }

    // Método reutilizable para realizar la petición HTTP externa
    private ResponseEntity<String> fetchExternalData(String url, String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity,
                String.class);
        return ResponseEntity.ok(response.getBody());
    }
}
