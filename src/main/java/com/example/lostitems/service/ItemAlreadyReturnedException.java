package com.example.lostitems.service;

public class ItemAlreadyReturnedException extends RuntimeException {

	public ItemAlreadyReturnedException(Long id) {
		super("이미 반환된 물건입니다. id=" + id);
	}
}
