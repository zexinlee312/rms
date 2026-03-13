package com.rms.backend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rms.backend.entity.Requirement;
import com.rms.backend.mapper.RequirementMapper;
import com.rms.backend.service.RequirementService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RequirementServiceImpl extends ServiceImpl<RequirementMapper, Requirement> implements RequirementService {
    @Override
    public boolean save(Requirement entity) {
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
        return super.save(entity);
    }

    @Override
    public boolean updateById(Requirement entity) {
        entity.setUpdatedAt(LocalDateTime.now());
        return super.updateById(entity);
    }
}
