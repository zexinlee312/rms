package com.rms.backend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.rms.backend.entity.User;

public interface UserService extends IService<User> {
    User getByUsername(String username);
}
