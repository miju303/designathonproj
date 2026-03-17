package com.faculty.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FacultySystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(FacultySystemApplication.class, args);
	}

}
