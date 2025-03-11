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

    // Método para el tipo de moneda
    @GetMapping("/getTipoCambio")
@PreAuthorize("hasAuthority('ROLE_demo')")
public ResponseEntity<String> getTipoCambio(@RequestHeader("Authorization") String authHeader) {
    String url = "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF60653/datos/2025-03-11/2025-03-11";

    // Token de Banxico
    String banxicoToken = "3fa2dbbeb71b4b6a870ad696beaedc0bb91acab5cd0843d481eefa2da607ae5a";

    // Realizar la petición a la API de Banxico
    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.set("Bmx-Token", banxicoToken); // Se agrega el token en los headers
    HttpEntity<String> entity = new HttpEntity<>(headers);

    ResponseEntity<String> response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, String.class);
    return ResponseEntity.ok(response.getBody());
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
