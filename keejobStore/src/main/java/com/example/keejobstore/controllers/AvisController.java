package com.example.keejobstore.controllers;


import com.example.keejobstore.entity.Avis;
import com.example.keejobstore.service.AvisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avis")
@RequiredArgsConstructor
public class AvisController {

    private final AvisService avisService;



    @GetMapping
    public ResponseEntity<List<Avis>> getAllAvis() {
        return ResponseEntity.ok(avisService.getAllAvis());
    }

    @GetMapping("/centre/{centreId}")
    public ResponseEntity<List<Avis>> getAvisByCentre(@PathVariable Long centreId) {
        return ResponseEntity.ok(avisService.getAvisByCentreId(centreId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Avis> getAvisById(@PathVariable Long id) {
        return ResponseEntity.ok(avisService.getAvisById(id));
    }

    @PostMapping("/centre/{centreId}")
    public ResponseEntity<Avis> createAvis(@PathVariable Long centreId, @RequestBody Avis avis) {
        Avis created = avisService.createAvis(centreId, avis);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Avis> updateAvis(@PathVariable Long id, @RequestBody Avis avis) {
        return ResponseEntity.ok(avisService.updateAvis(id, avis));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvis(@PathVariable Long id) {
        avisService.deleteAvis(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/formation/{formationId}")
    public ResponseEntity<List<Avis>> getAvisByFormation(@PathVariable Long formationId) {
        return ResponseEntity.ok(avisService.getAvisByFormationId(formationId));
    }

    @PostMapping("/formation/{formationId}")
    public ResponseEntity<Avis> createAvisForFormation(@PathVariable Long formationId, @RequestBody Avis avis) {
        Avis created = avisService.createAvisForFormation(formationId, avis);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

}