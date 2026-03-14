package com.rms.backend.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("iteration")
public class Iteration {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long projectId;
    private String name;
    private String description;
    private String status; // OPEN, CLOSED
    private LocalDate startDate;
    private LocalDate endDate;
    
    // 扩展字段
    private Long ownerId;
    private BigDecimal capacity; // 工时容量
    private BigDecimal totalWorkload; // 当前工时总量
    private Integer totalTaskCount; // 总工作量数量
    private Integer completedTaskCount; // 已完成工作量
    private Boolean isLocked; // 是否已锁定
    
    private LocalDateTime createdAt;
}
