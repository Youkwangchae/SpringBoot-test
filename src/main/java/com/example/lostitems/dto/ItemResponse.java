package com.example.lostitems.dto;

import com.example.lostitems.domain.ItemStatus;
import com.example.lostitems.domain.LostItem;
import java.time.LocalDate;

public record ItemResponse(
		Long id,
		String name,
		String building,
		LocalDate foundDate,
		String storage,
		ItemStatus status) {

	public static ItemResponse from(LostItem item) {
		return new ItemResponse(
				item.getId(),
				item.getName(),
				item.getBuilding(),
				item.getFoundDate(),
				item.getStorage(),
				item.getStatus());
	}
}
