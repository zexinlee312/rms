package com.rms.backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rms.backend.entity.Project;
import com.rms.backend.entity.ProjectMember;
import com.rms.backend.mapper.ProjectMapper;
import com.rms.backend.mapper.ProjectMemberMapper;
import com.rms.backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl extends ServiceImpl<ProjectMapper, Project> implements ProjectService {

    @Autowired
    private ProjectMemberMapper projectMemberMapper;

    @Override
    public List<Project> getProjectsByUserId(Long userId) {
        // 先查关联表
        List<ProjectMember> members = projectMemberMapper.selectList(
                new LambdaQueryWrapper<ProjectMember>().eq(ProjectMember::getUserId, userId)
        );
        
        List<Long> projectIds = members.stream().map(ProjectMember::getProjectId).collect(Collectors.toList());
        
        if (projectIds.isEmpty()) {
            return List.of();
        }
        
        return baseMapper.selectBatchIds(projectIds);
    }
}
