package com.example.lostitems.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record CreateItemRequest(
		@NotBlank String name,
		@NotBlank String building,
		LocalDate foundDate,
		String storage) {
}
