package com.rms.backend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.rms.backend.entity.Project;
import java.util.List;

public interface ProjectService extends IService<Project> {
    List<Project> getProjectsByUserId(Long userId);
}
