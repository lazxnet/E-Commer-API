package com.lazxnet.e_commer.userClient.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class UserClientConfig {

    @Bean
    public BCryptPasswordEncoder passwordClientEncoder(){
        return new BCryptPasswordEncoder();
    }
    
}
