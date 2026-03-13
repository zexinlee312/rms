package com.rms.backend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rms.backend.entity.Iteration;
import com.rms.backend.mapper.IterationMapper;
import com.rms.backend.service.IterationService;
import org.springframework.stereotype.Service;

@Service
public class IterationServiceImpl extends ServiceImpl<IterationMapper, Iteration> implements IterationService {
}
