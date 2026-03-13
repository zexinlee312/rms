package com.rms.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.rms.backend.entity.Project;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProjectMapper extends BaseMapper<Project> {
}
