package com.rms.backend.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("project_member")
public class ProjectMember {
    private Long projectId;
    private Long userId;
    private String role;
}
