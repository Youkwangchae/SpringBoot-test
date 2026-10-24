package com.example.lostitems.service;

public class ItemNotFoundException extends RuntimeException {

	public ItemNotFoundException(Long id) {
		super("물건을 찾을 수 없습니다. id=" + id);
	}
}
