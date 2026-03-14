package com.rms.backend.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.rms.backend.entity.Iteration;
import com.rms.backend.service.IterationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
        iteration.setStatus("未开启");
        iterationService.save(iteration);
        return iteration;
    }

    @PutMapping("/{id}")
    public Iteration update(@PathVariable Long id, @RequestBody Iteration iteration) {
        iteration.setId(id);
        iterationService.updateById(iteration);
        return iteration;
    }

    @PostMapping("/{id}/next-status")
    public ResponseEntity<Iteration> transitStatus(@PathVariable Long id) {
        Iteration iteration = iterationService.getById(id);
        if (iteration == null) return ResponseEntity.notFound().build();

        String currentStatus = iteration.getStatus() == null ? "未开启" : iteration.getStatus();
        
        switch (currentStatus) {
            case "未开启":
                iteration.setStatus("进行中");
                break;
            case "进行中":
                iteration.setStatus("已完成");
                iteration.setIsLocked(true); // 完成后自动锁定
                break;
            case "已完成":
                return ResponseEntity.badRequest().body(iteration);
            default:
                iteration.setStatus("进行中");
        }
        
        iterationService.updateById(iteration);
        return ResponseEntity.ok(iteration);
    }
}
