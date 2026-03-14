package com.rms.backend.controller;

import com.rms.backend.entity.Project;
import com.rms.backend.entity.User;
import com.rms.backend.entity.ProjectMember;
import com.rms.backend.mapper.ProjectMemberMapper;
import com.rms.backend.service.ProjectService;
import com.rms.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectMemberMapper projectMemberMapper;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Project>> getMyProjects() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userService.getByUsername(username);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        List<Project> projects = projectService.getProjectsByUserId(user.getId());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<User>> getProjectMembers(@PathVariable Long id) {
        List<ProjectMember> members = projectMemberMapper.selectList(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<ProjectMember>().eq(ProjectMember::getProjectId, id)
        );
        
        List<Long> userIds = members.stream().map(ProjectMember::getUserId).collect(Collectors.toList());
        
        if (userIds.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        
        return ResponseEntity.ok(userService.listByIds(userIds));
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userService.getByUsername(username);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        project.setOwnerId(user.getId());
        project.setCreatedAt(LocalDateTime.now());
        projectService.save(project);
        
        // 自动将创建者加入项目成员表
        ProjectMember member = new ProjectMember();
        member.setProjectId(project.getId());
        member.setUserId(user.getId());
        member.setRole("OWNER");
        projectMemberMapper.insert(member);
        
        return ResponseEntity.ok(project);
    }
}
