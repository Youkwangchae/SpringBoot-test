package com.example.lostitems.controller;

import com.example.lostitems.service.ItemAlreadyReturnedException;
import com.example.lostitems.service.ItemNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(ItemNotFoundException.class)
	public ProblemDetail handleNotFound(ItemNotFoundException e) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
	}

	@ExceptionHandler(ItemAlreadyReturnedException.class)
	public ProblemDetail handleConflict(ItemAlreadyReturnedException e) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
	}
}
