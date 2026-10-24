package com.example.lostitems.controller;

import com.example.lostitems.service.ItemAlreadyReturnedException;
import com.example.lostitems.service.ItemNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

	// 검증 실패도 ProblemDetail의 detail로 안내해서 화면에 그대로 보여 줄 수 있게 한다
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ProblemDetail handleValidation(MethodArgumentNotValidException e) {
		return ProblemDetail.forStatusAndDetail(
				HttpStatus.BAD_REQUEST, "입력값을 확인해 주세요. 이름과 건물은 필수입니다.");
	}

	@ExceptionHandler(ItemNotFoundException.class)
	public ProblemDetail handleNotFound(ItemNotFoundException e) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
	}

	@ExceptionHandler(ItemAlreadyReturnedException.class)
	public ProblemDetail handleConflict(ItemAlreadyReturnedException e) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
	}
}
