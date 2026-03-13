package com.rms.backend.controller;

import com.rms.backend.entity.Requirement;
import com.rms.backend.service.RequirementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;

@RestController
@RequestMapping("/api/requirements")
public class RequirementController {

    @Autowired
    private RequirementService requirementService;

    @GetMapping
    public List<Requirement> getAll(@RequestParam(required = false) Long projectId, 
                                    @RequestParam(required = false) Long iterationId,
                                    @RequestParam(required = false) Boolean inBacklog) {
        LambdaQueryWrapper<Requirement> query = new LambdaQueryWrapper<>();
        if (projectId != null) {
            query.eq(Requirement::getProjectId, projectId);
        }
        if (iterationId != null) {
            query.eq(Requirement::getIterationId, iterationId);
        }
        if (inBacklog != null && inBacklog) {
            query.isNull(Requirement::getIterationId);
        }
        return requirementService.list(query);
    }

    @GetMapping("/{id}")
    public Requirement getById(@PathVariable Long id) {
        return requirementService.getById(id);
    }

    @PostMapping
    public boolean create(@RequestBody Requirement requirement) {
        return requirementService.save(requirement);
    }

    @PutMapping("/{id}")
    public boolean update(@PathVariable Long id, @RequestBody Requirement requirement) {
        requirement.setId(id);
        return requirementService.updateById(requirement);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Long id) {
        return requirementService.removeById(id);
    }
}
