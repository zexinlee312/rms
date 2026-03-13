package com.rms.backend.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.rms.backend.entity.Iteration;
import com.rms.backend.service.IterationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/iterations")
public class IterationController {

    @Autowired
    private IterationService iterationService;

    @GetMapping
    public List<Iteration> getByProject(@RequestParam Long projectId) {
        return iterationService.list(new LambdaQueryWrapper<Iteration>().eq(Iteration::getProjectId, projectId));
    }

    @PostMapping
    public Iteration create(@RequestBody Iteration iteration) {
        iteration.setCreatedAt(LocalDateTime.now());
        iteration.setStatus("OPEN");
        iterationService.save(iteration);
        return iteration;
    }

    @PutMapping("/{id}")
    public Iteration update(@PathVariable Long id, @RequestBody Iteration iteration) {
        iteration.setId(id);
        iterationService.updateById(iteration);
        return iteration;
    }
}
