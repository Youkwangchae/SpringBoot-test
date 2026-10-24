package com.example.lostitems.controller;

import com.example.lostitems.dto.CreateItemRequest;
import com.example.lostitems.dto.ItemResponse;
import com.example.lostitems.service.LostItemService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/items")
public class LostItemController {

	private final LostItemService service;

	public LostItemController(LostItemService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<ItemResponse> register(@Valid @RequestBody CreateItemRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.register(request));
	}

	@GetMapping
	public List<ItemResponse> list(@RequestParam(name = "building", required = false) String building) {
		return service.findAll(building);
	}

	@GetMapping("/{id}")
	public ItemResponse detail(@PathVariable Long id) {
		return service.findById(id);
	}

	@PatchMapping("/{id}/return")
	public ItemResponse returnItem(@PathVariable Long id) {
		return service.returnItem(id);
	}
}
